"""Bazi (八字 / Four Pillars) casting logic for package and CLI use.

Bazi maps a Gregorian birth instant to four "pillars" (年柱/月柱/日柱/时柱),
each a Heavenly Stem (天干) + Earthly Branch (地支) pair, plus Five Elements
(五行), NaYin (纳音), and Chinese zodiac (生肖).

This module is a thin, audited wrapper around the ``lunar-python`` package so
the AI host never invents a chart. Install with::

    pip install 'oraclebone[lunar]'

CLI::

    oraclebone bazi --datetime 1990-05-20T14:30:00

JSON output is the contract; agents MUST interpret it without inventing
pillars, stems, branches, or wuxing values.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime, timedelta
from typing import Any


STEMS_PINYIN = {
    "甲": "Jia", "乙": "Yi", "丙": "Bing", "丁": "Ding", "戊": "Wu",
    "己": "Ji", "庚": "Geng", "辛": "Xin", "壬": "Ren", "癸": "Gui",
}

BRANCHES_PINYIN = {
    "子": "Zi", "丑": "Chou", "寅": "Yin", "卯": "Mao", "辰": "Chen",
    "巳": "Si", "午": "Wu", "未": "Wei", "申": "Shen", "酉": "You",
    "戌": "Xu", "亥": "Hai",
}

STEM_WUXING = {
    "甲": ("wood", "yang"), "乙": ("wood", "yin"),
    "丙": ("fire", "yang"), "丁": ("fire", "yin"),
    "戊": ("earth", "yang"), "己": ("earth", "yin"),
    "庚": ("metal", "yang"), "辛": ("metal", "yin"),
    "壬": ("water", "yang"), "癸": ("water", "yin"),
}

BRANCH_WUXING = {
    "子": ("water", "yang"), "丑": ("earth", "yin"),
    "寅": ("wood", "yang"), "卯": ("wood", "yin"),
    "辰": ("earth", "yang"), "巳": ("fire", "yin"),
    "午": ("fire", "yang"), "未": ("earth", "yin"),
    "申": ("metal", "yang"), "酉": ("metal", "yin"),
    "戌": ("earth", "yang"), "亥": ("water", "yin"),
}

SHENGXIAO_EN = {
    "鼠": "Rat", "牛": "Ox", "虎": "Tiger", "兔": "Rabbit",
    "龙": "Dragon", "蛇": "Snake", "马": "Horse", "羊": "Goat",
    "猴": "Monkey", "鸡": "Rooster", "狗": "Dog", "猪": "Pig",
}

# Zodiac derived directly from the year pillar's earthly branch so the
# reported shengxiao always agrees with the year pillar (lichun boundary).
BRANCH_SHENGXIAO = {
    "子": "鼠", "丑": "牛", "寅": "虎", "卯": "兔",
    "辰": "龙", "巳": "蛇", "午": "马", "未": "羊",
    "申": "猴", "酉": "鸡", "戌": "狗", "亥": "猪",
}


def load_solar():
    """Import ``lunar_python.Solar`` lazily so the dep stays optional."""
    if os.environ.get("ORACLEBONE_DISABLE_LUNAR_PYTHON") or os.environ.get("AI_DIVINATION_DISABLE_LUNAR_PYTHON"):
        raise ImportError(
            "lunar_python is required for bazi. "
            "Install with: pip install 'oraclebone[lunar]'"
        )
    try:
        from lunar_python import Solar
    except ImportError as exc:
        raise ImportError(
            "lunar_python is required for bazi. "
            "Install with: pip install 'oraclebone[lunar]'"
        ) from exc
    return Solar


def _pillar(stem: str, branch: str) -> dict[str, Any]:
    stem_el, stem_pol = STEM_WUXING[stem]
    branch_el, branch_pol = BRANCH_WUXING[branch]
    return {
        "ganzhi": f"{stem}{branch}",
        "stem": {
            "char": stem,
            "pinyin": STEMS_PINYIN[stem],
            "element": stem_el,
            "polarity": stem_pol,
        },
        "branch": {
            "char": branch,
            "pinyin": BRANCHES_PINYIN[branch],
            "element": branch_el,
            "polarity": branch_pol,
        },
    }


def _element_tally(pillars: dict[str, dict[str, Any]]) -> dict[str, int]:
    tally = {"wood": 0, "fire": 0, "earth": 0, "metal": 0, "water": 0}
    for pillar in pillars.values():
        tally[pillar["stem"]["element"]] += 1
        tally[pillar["branch"]["element"]] += 1
    return tally


def cast(
    raw_datetime: str | None,
    timezone: str | None = None,
    longitude: float | None = None,
) -> dict[str, Any]:
    """Cast a bazi chart from a Gregorian ISO 8601 datetime string.

    ``raw_datetime`` must include date and time (e.g. ``1990-05-20T14:30:00``).
    The hour is critical — bazi without an exact birth hour is incomplete.

    ``timezone`` is an IANA name (e.g. ``Asia/Tokyo``) declaring which civil
    time the input is in. ``longitude`` (degrees East) enables true-solar-time
    correction: the civil time is shifted by 4 minutes per degree of longitude
    away from the timezone's standard meridian. The equation of time is not
    applied; the correction is reported in the output for auditability.
    """
    if not raw_datetime:
        raise ValueError(
            "--datetime is required for bazi (Gregorian ISO 8601, e.g. 1990-05-20T14:30:00)"
        )
    dt = datetime.fromisoformat(raw_datetime)
    input_had_explicit_offset = dt.tzinfo is not None

    tzinfo = None
    timezone_note = None
    if timezone:
        from zoneinfo import ZoneInfo

        try:
            tzinfo = ZoneInfo(timezone)
        except Exception as exc:
            raise ValueError(f"Unknown IANA timezone: {timezone}") from exc
        if input_had_explicit_offset and dt.utcoffset() != dt.replace(tzinfo=tzinfo).utcoffset():
            timezone_note = (
                f"Input ISO string carried an explicit UTC offset ({dt.utcoffset()}), "
                f"which was replaced by --timezone {timezone} ({dt.replace(tzinfo=tzinfo).utcoffset()})."
            )
        dt = dt.replace(tzinfo=tzinfo)

    true_solar = None
    if longitude is not None:
        if tzinfo is None:
            raise ValueError("--longitude requires --timezone so the standard meridian is known")
        if not -180.0 <= longitude <= 180.0:
            raise ValueError("--longitude must be between -180 and 180 degrees East")
        offset_hours = dt.utcoffset().total_seconds() / 3600
        correction_minutes = (longitude - 15 * offset_hours) * 4
        dt = dt + timedelta(minutes=correction_minutes)
        true_solar = {
            "longitude_east": longitude,
            "standard_meridian_east": 15 * offset_hours,
            "correction_minutes": round(correction_minutes, 2),
            "note": "Longitude correction only; the equation of time is not applied.",
        }

    Solar = load_solar()
    solar = Solar.fromYmdHms(dt.year, dt.month, dt.day, dt.hour, dt.minute, dt.second or 0)
    lunar = solar.getLunar()
    ec = lunar.getEightChar()

    year = _pillar(ec.getYearGan(), ec.getYearZhi())
    month = _pillar(ec.getMonthGan(), ec.getMonthZhi())
    day = _pillar(ec.getDayGan(), ec.getDayZhi())
    time_pillar = _pillar(ec.getTimeGan(), ec.getTimeZhi())

    year["nayin"] = ec.getYearNaYin()
    month["nayin"] = ec.getMonthNaYin()
    day["nayin"] = ec.getDayNaYin()
    time_pillar["nayin"] = ec.getTimeNaYin()

    pillars = {"year": year, "month": month, "day": day, "hour": time_pillar}
    # Zodiac from the year pillar's branch so it always agrees with the year
    # pillar (both use the lichun boundary). The lunar-new-year zodiac is kept
    # separately for auditability; the two disagree between lichun and lunar
    # new year.
    year_branch = ec.getYearZhi()
    sx = BRANCH_SHENGXIAO[year_branch]
    lunar_sx = lunar.getYearShengXiao()
    inputs_payload = {
        "datetime": dt.isoformat(timespec="seconds"),
        "timezone": timezone,
        "true_solar_time": true_solar,
    }
    if timezone_note:
        inputs_payload["timezone_override_note"] = timezone_note
    return {
        "system": "bazi",
        "accuracy": "traditional-lunar-calendar",
        "engine": "lunar-python",
        "inputs": inputs_payload,
        "lunar_date": {
            "year": int(lunar.getYear()),
            "month": int(lunar.getMonth()),
            "day": int(lunar.getDay()),
            "label": lunar.toString(),
        },
        "shengxiao": {
            "char": sx,
            "english": SHENGXIAO_EN.get(sx, sx),
            "zodiac_basis": "bazi-year-pillar",
        },
        "lunar_year_zodiac": {
            "char": lunar_sx,
            "english": SHENGXIAO_EN.get(lunar_sx, lunar_sx),
            "zodiac_basis": "lunar-new-year",
            "note": "Zodiac by lunar new year boundary; differs from shengxiao above for births between lichun and lunar new year.",
        },
        "day_master": {
            "stem": day["stem"]["char"],
            "pinyin": day["stem"]["pinyin"],
            "element": day["stem"]["element"],
            "polarity": day["stem"]["polarity"],
        },
        "pillars": pillars,
        "five_elements_tally": _element_tally(pillars),
        "notes": [
            "Bazi requires the exact birth hour; results are unreliable without it.",
            "The host MUST NOT invent stems, branches, or wuxing. Interpret only this JSON.",
        ],
    }


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Cast a bazi (Four Pillars) chart for AI agent interpretation."
    )
    parser.add_argument(
        "--datetime",
        required=False,
        help="Gregorian ISO 8601 birth datetime, e.g. 1990-05-20T14:30:00",
    )
    parser.add_argument(
        "--timezone",
        help="IANA timezone name for the birth time, e.g. Asia/Shanghai.",
    )
    parser.add_argument(
        "--longitude",
        type=float,
        help="Birth longitude in degrees East; enables true-solar-time correction. Requires --timezone.",
    )
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    try:
        result = cast(args.datetime, timezone=args.timezone, longitude=args.longitude)
    except (ImportError, ValueError) as exc:
        print(str(exc), file=sys.stderr)
        return 2
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
