import json
import subprocess
import sys
import unittest

from oraclebone import bazi


try:
    bazi.load_solar()
    HAVE_LUNAR = True
except ImportError:
    HAVE_LUNAR = False


@unittest.skipUnless(HAVE_LUNAR, "lunar-python not installed")
class BaziCastTests(unittest.TestCase):
    """The bazi engine is a thin wrapper over lunar-python.

    These tests pin the canonical 1990-05-20 14:30 chart so any future
    refactor (or accidental engine swap) is caught immediately.
    """

    def test_canonical_chart_1990_05_20(self):
        result = bazi.cast("1990-05-20T14:30:00")

        self.assertEqual(result["system"], "bazi")
        self.assertEqual(result["engine"], "lunar-python")
        self.assertEqual(result["shengxiao"]["char"], "马")
        self.assertEqual(result["shengxiao"]["english"], "Horse")

        self.assertEqual(result["pillars"]["year"]["ganzhi"], "庚午")
        self.assertEqual(result["pillars"]["month"]["ganzhi"], "辛巳")
        self.assertEqual(result["pillars"]["day"]["ganzhi"], "乙酉")
        self.assertEqual(result["pillars"]["hour"]["ganzhi"], "癸未")

        self.assertEqual(result["day_master"]["element"], "wood")
        self.assertEqual(result["day_master"]["polarity"], "yin")

        tally = result["five_elements_tally"]
        self.assertEqual(sum(tally.values()), 8)
        self.assertEqual(tally["metal"], 3)
        self.assertEqual(tally["fire"], 2)

    def test_pillar_elements_match_stem_branch_lookup(self):
        result = bazi.cast("2000-01-01T00:00:00")

        for pillar in result["pillars"].values():
            self.assertIn(pillar["stem"]["element"], {"wood", "fire", "earth", "metal", "water"})
            self.assertIn(pillar["branch"]["element"], {"wood", "fire", "earth", "metal", "water"})
            self.assertIn(pillar["stem"]["polarity"], {"yin", "yang"})

    def test_timezone_recorded_in_inputs(self):
        # 1990-01-20: winter date, outside the 1986-1991 China DST period
        result = bazi.cast("1990-01-20T14:30:00", timezone="Asia/Shanghai")
        self.assertEqual(result["inputs"]["timezone"], "Asia/Shanghai")
        self.assertIsNone(result["inputs"]["true_solar_time"])
        self.assertIn("+08:00", result["inputs"]["datetime"])

    def test_true_solar_time_correction(self):
        # Urumqi (87.6E) in Asia/Shanghai (meridian 120E): correction = (87.6-120)*4 = -129.6 min
        result = bazi.cast("1990-01-20T14:30:00", timezone="Asia/Shanghai", longitude=87.6)
        tst = result["inputs"]["true_solar_time"]
        self.assertEqual(tst["longitude_east"], 87.6)
        self.assertEqual(tst["standard_meridian_east"], 120.0)
        self.assertAlmostEqual(tst["correction_minutes"], -129.6, places=1)
        self.assertIn("12:20", result["inputs"]["datetime"])  # 14:30 - 129.6 min = 12:20:24

    def test_longitude_requires_timezone(self):
        with self.assertRaises(ValueError):
            bazi.cast("1990-05-20T14:30:00", longitude=87.6)

    def test_unknown_timezone_rejected(self):
        with self.assertRaises(ValueError):
            bazi.cast("1990-05-20T14:30:00", timezone="Mars/Olympus")

    def test_missing_datetime_raises(self):
        with self.assertRaises(ValueError):
            bazi.cast(None)

    def test_notes_warn_about_hour_pillar(self):
        result = bazi.cast("1990-05-20T14:30:00")
        joined = " ".join(result["notes"]).lower()
        self.assertIn("hour", joined)
        self.assertIn("invent", joined)

    def test_shengxiao_agrees_with_year_pillar_between_lichun_and_lunar_new_year(self):
        # 2026: lichun ~Feb 4 (year pillar -> 丙午/Horse), lunar new year Feb 17
        # (lunar year zodiac stays Snake until then). The two conventions
        # disagree in this window; the reported shengxiao must follow the year
        # pillar.
        result = bazi.cast("2026-02-10T12:00:00", timezone="Asia/Shanghai")
        self.assertEqual(result["pillars"]["year"]["ganzhi"], "丙午")
        self.assertEqual(result["shengxiao"]["char"], "马")
        self.assertEqual(result["shengxiao"]["english"], "Horse")
        self.assertEqual(result["shengxiao"]["zodiac_basis"], "bazi-year-pillar")
        # Lunar-new-year zodiac preserved separately for auditability.
        self.assertEqual(result["lunar_year_zodiac"]["char"], "蛇")
        self.assertEqual(result["lunar_year_zodiac"]["english"], "Snake")
        self.assertEqual(result["lunar_year_zodiac"]["zodiac_basis"], "lunar-new-year")

    def test_shengxiao_matches_year_branch_after_lunar_new_year(self):
        result = bazi.cast("1990-05-20T14:30:00")
        self.assertEqual(result["shengxiao"]["char"], "马")
        self.assertEqual(result["lunar_year_zodiac"]["char"], "马")

    def test_timezone_override_note_recorded_on_conflict(self):
        # Input carries +09:00 but --timezone says Shanghai (+08:00 in winter,
        # outside the 1986-1991 China DST window): the override must be
        # recorded, not applied silently.
        result = bazi.cast("1990-01-20T14:30:00+09:00", timezone="Asia/Shanghai")
        note = result["inputs"].get("timezone_override_note")
        self.assertIsNotNone(note)
        self.assertIn("9:00:00", note)
        self.assertIn("Asia/Shanghai", note)

    def test_no_timezone_override_note_when_offsets_match(self):
        # May 1990 falls inside China's DST period (+09:00), so an explicit
        # +09:00 input matches Asia/Shanghai and no note should appear.
        result = bazi.cast("1990-05-20T14:30:00+09:00", timezone="Asia/Shanghai")
        self.assertNotIn("timezone_override_note", result["inputs"])

    def test_no_timezone_override_note_when_consistent(self):
        result = bazi.cast("1990-05-20T14:30:00", timezone="Asia/Shanghai")
        self.assertNotIn("timezone_override_note", result["inputs"])


@unittest.skipUnless(HAVE_LUNAR, "lunar-python not installed")
class BaziCliTests(unittest.TestCase):
    def test_cli_subcommand(self):
        completed = subprocess.run(
            [sys.executable, "-m", "oraclebone.cli", "bazi",
             "--datetime", "1990-05-20T14:30:00"],
            check=True, capture_output=True, text=True,
        )
        result = json.loads(completed.stdout)
        self.assertEqual(result["pillars"]["day"]["ganzhi"], "乙酉")

    def test_cli_missing_datetime_exits_nonzero(self):
        completed = subprocess.run(
            [sys.executable, "-m", "oraclebone.cli", "bazi"],
            capture_output=True, text=True,
        )
        self.assertNotEqual(completed.returncode, 0)

    def test_template_bazi_is_available(self):
        completed = subprocess.run(
            [sys.executable, "-m", "oraclebone.cli", "template", "bazi"],
            check=True, capture_output=True, text=True,
        )
        self.assertIn("Bazi", completed.stdout)
        self.assertIn("day_master", completed.stdout)


@unittest.skipUnless(HAVE_LUNAR, "lunar-python not installed")
class BaziMcpTests(unittest.TestCase):
    def test_mcp_tool_registered(self):
        from oraclebone import mcp_server
        names = [t["name"] for t in mcp_server.TOOLS]
        self.assertIn("bazi_cast", names)

    def test_mcp_call_returns_chart(self):
        from oraclebone import mcp_server
        resp = mcp_server.handle({
            "jsonrpc": "2.0", "id": 1, "method": "tools/call",
            "params": {"name": "bazi.cast",
                       "arguments": {"datetime": "1990-05-20T14:30:00"}},
        })
        text = resp["result"]["content"][0]["text"]
        payload = json.loads(text)
        self.assertEqual(payload["pillars"]["year"]["ganzhi"], "庚午")


if __name__ == "__main__":
    unittest.main()
