"""I Ching casting logic for package and CLI use."""

from __future__ import annotations

import argparse
import json
import random
from pathlib import Path
from typing import Any
# ---------------------------------------------------------------------------
# Data layer: hexagram numbering and classical texts live in
# oraclebone/data/hexagrams.json (single source of truth). Standalone skill
# copies fall back to a hexagrams.json sitting next to this file.
# ---------------------------------------------------------------------------

def _load_hexagram_data() -> dict[str, Any]:
    try:
        from importlib import resources

        raw = resources.files("oraclebone.data").joinpath("hexagrams.json").read_text(encoding="utf-8")
    except (ModuleNotFoundError, FileNotFoundError, NotADirectoryError):
        fallback = Path(__file__).with_name("hexagrams.json")
        raw = fallback.read_text(encoding="utf-8")
    return json.loads(raw)


_HEXAGRAM_DATA = _load_hexagram_data()

TRIGRAM_BITS: dict[str, str] = dict(_HEXAGRAM_DATA["trigram_bits"])

HEXAGRAMS: dict[tuple[str, str], tuple[int, str]] = {
    (entry["upper"], entry["lower"]): (entry["number"], entry["name"])
    for entry in _HEXAGRAM_DATA["hexagrams"]
}

HEXAGRAM_BY_BINARY = {
    TRIGRAM_BITS[lower] + TRIGRAM_BITS[upper]: {"number": number, "name": name, "upper": upper, "lower": lower}
    for (upper, lower), (number, name) in HEXAGRAMS.items()
}

HEXAGRAM_TEXTS = _HEXAGRAM_DATA["texts"]


def make_rng(seed: str | None) -> random.Random | random.SystemRandom:
    if seed is not None:
        return random.Random(seed)
    return random.SystemRandom()


def coin_line_record(index: int, rng: random.Random | random.SystemRandom) -> dict[str, Any]:
    tosses = [rng.choice(["heads", "tails"]) for _ in range(3)]
    values = [3 if toss == "heads" else 2 for toss in tosses]
    record = line_record(index, sum(values))
    record["coin_tosses"] = tosses
    record["coin_values"] = values
    return record


def yarrow_line_value(rng: random.Random | random.SystemRandom) -> int:
    roll = rng.randrange(16)
    if roll == 0:
        return 6
    if roll <= 5:
        return 7
    if roll <= 12:
        return 8
    return 9


def parse_manual_lines(raw: str) -> list[int]:
    values = [int(part.strip()) for part in raw.split(",") if part.strip()]
    if len(values) != 6:
        raise ValueError("--lines must contain exactly six comma-separated values")
    if any(value not in [6, 7, 8, 9] for value in values):
        raise ValueError("line values must be 6, 7, 8, or 9")
    return values


def line_record(index: int, value: int) -> dict[str, Any]:
    labels = {
        6: ("old yin", "yin", True),
        7: ("young yang", "yang", False),
        8: ("young yin", "yin", False),
        9: ("old yang", "yang", True),
    }
    line_type, polarity, changing = labels[value]
    return {
        "line": index,
        "value": value,
        "type": line_type,
        "polarity": polarity,
        "changing": changing,
    }


def hexagram_for_binary(binary: str, with_texts: bool = True) -> dict[str, Any]:
    data = HEXAGRAM_BY_BINARY[binary]
    result = {
        "number": data["number"],
        "name": data["name"],
        "binary": binary,
        "upper_trigram": data["upper"],
        "lower_trigram": data["lower"],
    }
    if with_texts:
        texts = HEXAGRAM_TEXTS[binary]
        result["texts"] = {
            "judgment": texts["judgment"],
            "line_labels": texts["line_labels"],
            "line_texts": texts["lines"],
            "source": "Zhou Yi (public domain), via Chinese Wikisource",
        }
    return result


def cast(method: str, seed: str | None, manual_lines: str | None) -> dict[str, Any]:
    requested_method = method
    warning = None
    if method == "random":
        method = "coins"
        warning = "Compatibility alias: --method random now uses the three-coin method. Use --method coins or --method yarrow for explicit traditional casting."

    if method == "manual":
        if not manual_lines:
            raise ValueError("--lines is required for manual casts")
        values = parse_manual_lines(manual_lines)
        randomness = "manual"
        lines = [line_record(index, value) for index, value in enumerate(values, start=1)]
        method_details = {"name": "manual", "line_order": "bottom-to-top"}
        line_probabilities = {}
    elif method == "yarrow":
        rng = make_rng(seed)
        values = [yarrow_line_value(rng) for _ in range(6)]
        randomness = "seeded" if seed is not None else "system"
        lines = [line_record(index, value) for index, value in enumerate(values, start=1)]
        method_details = {
            "name": "digital yarrow equivalent",
            "probability_model": "digital-yarrow-equivalent",
            "note": "Uses the traditional yarrow-stalk line probability distribution without simulating physical stalk manipulation.",
        }
        line_probabilities = {"6": "1/16", "7": "5/16", "8": "7/16", "9": "3/16"}
    else:
        rng = make_rng(seed)
        lines = [coin_line_record(index, rng) for index in range(1, 7)]
        values = [line["value"] for line in lines]
        randomness = "seeded" if seed is not None else "system"
        method_details = {
            "name": "three coins",
            "coin_value_map": {"heads": 3, "tails": 2},
            "line_order": "bottom-to-top",
        }
        line_probabilities = {"6": "1/8", "7": "3/8", "8": "3/8", "9": "1/8"}

    primary_bits = "".join("1" if value in [7, 9] else "0" for value in values)
    resulting_bits = "".join(
        "0" if value == 9 else "1" if value in (6, 7) else "0"
        for value in values
    )
    changing_lines = [line["line"] for line in lines if line["changing"]]
    primary_texts = HEXAGRAM_TEXTS[primary_bits]
    changing_line_texts = [
        {
            "line": line_no,
            "label": primary_texts["line_labels"][line_no - 1],
            "text": primary_texts["lines"][line_no - 1],
        }
        for line_no in changing_lines
    ]
    result = {
        "system": "iching",
        "method": method,
        "requested_method": requested_method,
        "randomness": randomness,
        "line_order": "bottom-to-top",
        "method_details": method_details,
        "line_probabilities": line_probabilities,
        "lines": lines,
        "changing_lines": changing_lines,
        "changing_line_texts": changing_line_texts,
        "primary_hexagram": hexagram_for_binary(primary_bits),
        "resulting_hexagram": hexagram_for_binary(resulting_bits),
    }
    if warning:
        result["warning"] = warning
    return result


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Cast an I Ching hexagram for AI agent interpretation.")
    parser.add_argument("--method", choices=["random", "coins", "yarrow", "manual"], default="coins")
    parser.add_argument("--seed", help="Optional deterministic seed for tests and reproducible demos.")
    parser.add_argument("--lines", help="Manual bottom-to-top line values, for example: 6,7,8,9,7,8")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    result = cast(args.method, args.seed, args.lines)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0
