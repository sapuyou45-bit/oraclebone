"""Xiao Liu Ren casting logic for package and CLI use."""

from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime
from typing import Any


POSITIONS = [
    {
        "index": 1,
        "name_pinyin": "Da An",
        "name_en": "Great Peace",
        "keywords": ["stable", "slow", "safe", "settled"],
    },
    {
        "index": 2,
        "name_pinyin": "Liu Lian",
        "name_en": "Lingering Delay",
        "keywords": ["delay", "entanglement", "waiting", "unclear"],
    },
    {
        "index": 3,
        "name_pinyin": "Su Xi",
        "name_en": "Swift Joy",
        "keywords": ["quick news", "opening", "pleasant movement", "timely help"],
    },
    {
        "index": 4,
        "name_pinyin": "Chi Kou",
        "name_en": "Red Mouth",
        "keywords": ["conflict", "argument", "friction", "caution with speech"],
    },
    {
        "index": 5,
        "name_pinyin": "Xiao Ji",
        "name_en": "Small Fortune",
        "keywords": ["modest gain", "small help", "manageable progress", "partial success"],
    },
    {
        "index": 6,
        "name_pinyin": "Kong Wang",
        "name_en": "Empty Void",
        "keywords": ["absence", "uncertainty", "pause", "low traction"],
    },
]


def chinese_hour_index(dt: datetime) -> int:
    hour = dt.hour
    if hour == 23 or hour == 0:
        return 1
    return ((hour + 1) // 2) + 1


def position_for(month: int, day: int, hour: int) -> dict[str, Any]:
    for label, value, lower, upper in [("month", month, 1, 12), ("day", day, 1, 30), ("hour", hour, 1, 12)]:
        if value < lower or value > upper:
            raise ValueError(f"{label} must be between {lower} and {upper}")
    # Traditional three-step count: start the month at Da An, then count the day
    # from the month palace, then the hour from the day palace — each step counts
    # its starting palace as one. Anchor: lunar month 1, day 1, hour 1 (Zi) -> Da An.
    index = ((month + day + hour - 3) % 6) + 1
    return POSITIONS[index - 1]


def cast_numbers(month: int, day: int, hour: int) -> dict[str, Any]:
    position = position_for(month, day, hour)
    return {
        "system": "xiaoliuren",
        "method": "numbers",
        "accuracy": "traditional-input",
        "inputs": {"month": month, "day": day, "hour": hour},
        "formula": "((month + day + hour - 3) % 6) + 1",
        "position": position,
    }


def cast_time(raw_datetime: str | None) -> dict[str, Any]:
    dt = datetime.fromisoformat(raw_datetime) if raw_datetime else datetime.now()
    month = dt.month
    day = min(dt.day, 30)
    hour = chinese_hour_index(dt)
    result = cast_numbers(month, day, hour)
    result["method"] = "time"
    result["accuracy"] = "gregorian-fallback"
    result["datetime"] = dt.isoformat(timespec="seconds")
    result["calendar_note"] = "Uses Gregorian month/day as a lightweight fallback. For traditional lunar casting, pass lunar numbers with --method numbers."
    if dt.day > day:
        result["day_clamped"] = True
        result["warning"] = (
            "This is not a traditional lunar calculation. Use --method numbers with lunar inputs "
            "or --method lunar-time with lunar_python installed. "
            f"Input day {dt.day} was clamped to 30 because Xiao Liu Ren counts cap at 30."
        )
    else:
        result["warning"] = "This is not a traditional lunar calculation. Use --method numbers with lunar inputs or --method lunar-time with lunar_python installed."
    return result


def load_lunar_solar():
    if os.environ.get("ORACLEBONE_DISABLE_LUNAR_PYTHON") or os.environ.get("AI_DIVINATION_DISABLE_LUNAR_PYTHON"):
        raise ImportError("lunar_python is required for --method lunar-time. Install with: pip install '.[lunar]'")
    try:
        from lunar_python import Solar
    except ImportError as exc:
        raise ImportError("lunar_python is required for --method lunar-time. Install with: pip install '.[lunar]'") from exc
    return Solar


def cast_lunar_time(raw_datetime: str | None) -> dict[str, Any]:
    if not raw_datetime:
        raise ValueError("--datetime is required for --method lunar-time")
    dt = datetime.fromisoformat(raw_datetime)
    Solar = load_lunar_solar()
    lunar = Solar.fromYmdHms(dt.year, dt.month, dt.day, dt.hour, dt.minute, dt.second).getLunar()
    lunar_month = int(lunar.getMonth())
    if lunar_month < 0:
        raise ValueError("Leap lunar month detected. Pass traditional inputs explicitly with --method numbers to avoid false precision.")
    lunar_day = int(lunar.getDay())
    hour = chinese_hour_index(dt)
    result = cast_numbers(lunar_month, lunar_day, hour)
    result["method"] = "lunar-time"
    result["accuracy"] = "traditional-lunar-calendar"
    result["datetime"] = dt.isoformat(timespec="seconds")
    result["lunar_date"] = {
        "month": lunar_month,
        "day": lunar_day,
        "month_chinese": lunar.getMonthInChinese(),
        "day_chinese": lunar.getDayInChinese(),
        "is_leap_month": False,
    }
    return result


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Cast Xiao Liu Ren for AI agent interpretation.")
    parser.add_argument("--method", choices=["numbers", "time", "lunar-time"], default="time")
    parser.add_argument("--month", type=int, help="Lunar month number, 1-12, for --method numbers.")
    parser.add_argument("--day", type=int, help="Lunar day number, 1-30, for --method numbers.")
    parser.add_argument("--hour", type=int, help="Chinese hour branch index, 1-12, for --method numbers.")
    parser.add_argument("--datetime", help="ISO datetime for time fallback, for example 2026-05-29T14:30:00.")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    if args.method == "numbers":
        missing = [name for name in ["month", "day", "hour"] if getattr(args, name) is None]
        if missing:
            print(f"Missing required arguments for --method numbers: {', '.join('--' + name for name in missing)}", file=sys.stderr)
            return 1
        result = cast_numbers(args.month, args.day, args.hour)
    elif args.method == "lunar-time":
        try:
            result = cast_lunar_time(args.datetime)
        except (ImportError, ValueError) as exc:
            print(str(exc), file=sys.stderr)
            return 1
    else:
        result = cast_time(args.datetime)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0
