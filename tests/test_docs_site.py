import os
import re
import subprocess
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class DocsSiteTests(unittest.TestCase):
    def test_docs_site_has_six_language_switcher_links(self):
        html = (ROOT / "docs" / "index.html").read_text(encoding="utf-8")

        for lang in ["en", "zh", "ja", "pt", "ko", "es"]:
            with self.subTest(lang=lang):
                self.assertIn(f'data-lang="{lang}"', html)
                self.assertIn(f'href="?lang={lang}"', html)
        self.assertIn('aria-label="Language selector"', html)

    def test_docs_site_static_default_is_chinese(self):
        html = (ROOT / "docs" / "index.html").read_text(encoding="utf-8")

        self.assertIn('<html lang="zh-CN">', html)
        self.assertIn("<title>OracleBone 卜骨", html)
        self.assertIn("给 AI agent 使用的直接、实用占卜技能集", html)
        self.assertIn('data-lang="zh" aria-pressed="true"', html)
        self.assertIn("让 AI 用可审计的随机性起卦、排盘、抽塔罗", html)

    def test_docs_site_detects_browser_language_with_english_fallback(self):
        js = (ROOT / "docs" / "app.js").read_text(encoding="utf-8")

        self.assertIn("navigator.language", js)
        self.assertRegex(js, re.compile(r'return "en";', re.S))
        self.assertIn('localStorage.setItem("ob-lang", lang)', js)

    def test_docs_site_local_assets_exist_and_are_non_empty(self):
        html = (ROOT / "docs" / "index.html").read_text(encoding="utf-8")

        for asset in ["styles.css", "app.js"]:
            with self.subTest(asset=asset):
                self.assertIn(f'./{asset}', html)
                path = ROOT / "docs" / asset
                self.assertTrue(path.exists(), f"{asset} should exist")
                self.assertGreater(path.stat().st_size, 0, f"{asset} should not be empty")

    def test_docs_stylesheet_contains_core_layout_and_accessibility_rules(self):
        css = (ROOT / "docs" / "styles.css").read_text(encoding="utf-8")

        for selector in [".site-header", ".hero", ".skill-grid"]:
            with self.subTest(selector=selector):
                self.assertIn(selector, css)
        self.assertIn(":focus-visible", css)
        self.assertIn("prefers-reduced-motion", css)
        self.assertIn("scroll-behavior: auto", css)

    def test_app_js_persists_language_choice(self):
        js = (ROOT / "docs" / "app.js").read_text(encoding="utf-8")

        self.assertIn("ob-lang", js)
        self.assertIn("history.replaceState", js)

    def test_translation_dictionary_contains_six_languages(self):
        js = (ROOT / "docs" / "app.js").read_text(encoding="utf-8")

        self.assertIn("const translations = {", js)
        for lang in ["zh", "en", "ja", "pt", "ko", "es"]:
            with self.subTest(lang=lang):
                self.assertRegex(js, re.compile(r"const translations = \{.*\b%s:" % lang, re.S))

    def test_translation_dictionary_covers_every_i18n_key_in_all_languages(self):
        html = (ROOT / "docs" / "index.html").read_text(encoding="utf-8")
        js = (ROOT / "docs" / "app.js").read_text(encoding="utf-8")

        keys = set(re.findall(r'data-i18n="([^"]+)"', html))
        self.assertTrue(keys)

        match = re.search(r"const translations = \{(.*?)\n  \};", js, re.S)
        self.assertIsNotNone(match)
        block = match.group(1)
        lang_blocks = re.split(r"\n    (?:zh|en|ja|pt|ko|es): \{", block)
        dicts = []
        for lang_block in lang_blocks[1:]:
            pairs = dict(re.findall(r'"([a-zA-Z0-9.]+)": "((?:[^"\\]|\\.)*)"', lang_block))
            dicts.append(pairs)
        self.assertEqual(len(dicts), 6)
        for key in keys:
            for i, d in enumerate(dicts):
                with self.subTest(key=key, lang=["zh", "en", "ja", "pt", "ko", "es"][i]):
                    self.assertIn(key, d)

    def test_readme_points_to_published_pages_url(self):
        readme = (ROOT / "README.md").read_text(encoding="utf-8")

        self.assertIn("https://sapuyou45-bit.github.io/oraclebone/", readme)

    def test_readmes_point_agents_to_remote_install_runbook(self):
        install_url = "https://raw.githubusercontent.com/sapuyou45-bit/oraclebone/main/docs/install.md"
        for path in [ROOT / "README.md", ROOT / "README.zh-CN.md", ROOT / "README.ja.md"]:
            readme = path.read_text(encoding="utf-8")
            with self.subTest(path=path.name):
                self.assertIn(install_url, readme)
                self.assertIn("install.sh", readme)
                self.assertIn("AI_SKILLS_DIR", readme)

    def test_install_runbook_is_agent_facing_and_bounded(self):
        runbook = (ROOT / "docs" / "install.md").read_text(encoding="utf-8")

        self.assertIn("For Humans", runbook)
        self.assertIn("For AI Agents", runbook)
        self.assertIn("~/.claude/skills", runbook)
        self.assertIn("AI_SKILLS_DIR", runbook)
        self.assertIn("Do not use `sudo`", runbook)
        self.assertIn("Do not install Python packages", runbook)
        for skill in ["tarot", "iching", "xiaoliuren"]:
            self.assertIn(skill, runbook)

    def test_install_script_is_minimal_and_skill_only(self):
        installer = (ROOT / "install.sh").read_text(encoding="utf-8")

        self.assertIn("AI_SKILLS_DIR", installer)
        self.assertIn("--dry-run", installer)
        self.assertIn("Refusing unsafe AI_SKILLS_DIR", installer)
        self.assertIn(".ai-divination-backups", installer)
        self.assertIn("verified tarot, iching, xiaoliuren", installer)
        for skill in ["tarot", "iching", "xiaoliuren"]:
            self.assertIn(skill, installer)
        for forbidden in ["sudo", "pip install", ".bashrc", ".zshrc", ".profile"]:
            self.assertNotIn(forbidden, installer)

    def test_install_script_rejects_obviously_unsafe_targets(self):
        installer = ROOT / "install.sh"

        for target in ["/", ".", str(Path.home())]:
            with self.subTest(target=target):
                completed = subprocess.run(
                    ["bash", str(installer), "--dry-run"],
                    env={**os.environ, "AI_SKILLS_DIR": target},
                    check=False,
                    capture_output=True,
                    text=True,
                )
                self.assertNotEqual(completed.returncode, 0)
                self.assertIn("Refusing unsafe AI_SKILLS_DIR", completed.stderr + completed.stdout)

    def test_docs_site_surfaces_one_line_agent_install(self):
        html = (ROOT / "docs" / "index.html").read_text(encoding="utf-8")
        js = (ROOT / "docs" / "app.js").read_text(encoding="utf-8")

        self.assertIn("docs/install.md", html)
        self.assertIn("install.sh", html)
        self.assertIn("AI_SKILLS_DIR", html)
        self.assertIn("Paste one line into your AI agent", js)

    def test_readme_language_switcher_links_to_localized_readmes(self):
        readme = (ROOT / "README.md").read_text(encoding="utf-8")

        self.assertIn("[English](README.md)", readme)
        self.assertIn("[简体中文](README.zh-CN.md)", readme)
        self.assertIn("[日本語](README.ja.md)", readme)
        self.assertTrue((ROOT / "README.zh-CN.md").exists())
        self.assertTrue((ROOT / "README.ja.md").exists())

    def test_readmes_do_not_repeat_docs_language_switcher(self):
        for path in [ROOT / "README.md", ROOT / "README.zh-CN.md", ROOT / "README.ja.md"]:
            readme = path.read_text(encoding="utf-8")
            with self.subTest(path=path.name):
                self.assertNotIn("?lang=en", readme)
                self.assertNotIn("?lang=zh", readme)
                self.assertNotIn("?lang=ja", readme)

    def test_readmes_use_emoji_section_headings(self):
        for path in [ROOT / "README.md", ROOT / "README.zh-CN.md", ROOT / "README.ja.md"]:
            readme = path.read_text(encoding="utf-8")
            with self.subTest(path=path.name):
                for heading in ["## ✨", "## 🧭", "## 🚀", "## 🧩", "## 🛡️", "## 🗺️", "## 📄"]:
                    self.assertIn(heading, readme)


if __name__ == "__main__":
    unittest.main()
