# Changelog

All notable changes to this project are documented here.
For human-readable release announcements, see `RELEASE_NOTES.md` and [GitHub Releases](https://github.com/sapuyou45-bit/ai-divination-skills/releases).

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [8.2.0] - 2026-08-23

### Fixed — correctness audit findings
- **Bazi shengxiao now always agrees with the year pillar** — the zodiac is derived from the year pillar's earthly branch (lichun boundary) instead of the lunar-new-year year. Previously, births between lichun and lunar new year produced contradictory output (e.g. 2026-02-10: year pillar 丙午 "Horse" vs shengxiao "Snake"). `shengxiao` gains a `zodiac_basis: "bazi-year-pillar"` field; the lunar-new-year zodiac is preserved in a new `lunar_year_zodiac` object so both conventions remain auditable.
- **MCP `xiaoliuren_cast` missing-argument errors are now actionable** — `method=numbers` without month/day/hour returns a human-readable error listing exactly what is missing (previously a bare `KeyError`). The tool's inputSchema now conditionally requires month/day/hour via `allOf/if-then`.

### Changed
- Bazi: when the input ISO string carries an explicit UTC offset that conflicts with `--timezone`, the override is recorded as `inputs.timezone_override_note` instead of being applied silently.
- Xiao Liu Ren `time` fallback: clamping day 31 to 30 is now flagged with `day_clamped: true` and an explicit warning instead of happening silently.
- Docstrings updated from the legacy `ai-divination` name to `oraclebone` / `oraclebone-mcp`.
- `shared/response-contract.md`: Chinese section headings translated (结果/象征解读/情境映射/隐藏变量/可行指引/边界).

## [8.1.0] - 2026-08-13

### Added — data layer: the model now interprets data, not memory
- **Tarot meanings in output** — every drawn card carries a `meanings` object: major arcana get `keywords_upright` + `shadow` (reversed cue) + `question`; minor arcana get composed suit-themes × rank-theme; `reading_cue` honors orientation. Structured from `skills/tarot/references/cards.md`.
- **I Ching classical texts in output** — primary and resulting hexagrams now include the Zhou Yi judgment and line texts (卦辭/爻辭, public domain, via Chinese Wikisource), plus a `changing_line_texts` convenience array for the moving lines actually read.
- **Bazi timezone + true solar time** — `--timezone` (IANA, stdlib zoneinfo) and `--longitude` (true-solar-time correction, 4 minutes per degree off the standard meridian; correction reported in output). MCP `bazi_cast` exposes both.
- Output schemas updated for all three systems (root `schemas/` + packaged copies).

### Notes
- Data provenance: Zhou Yi classical text is public domain; Wilhelm-Bayes was deliberately avoided (still under copyright).


## [8.0.0] - 2026-08-13

### Changed — Rebrand
- **The project is now Oraclebone.** The bone cracks; the model reads. New name, same audited-divination discipline.
- PyPI package renamed to `oraclebone` (`pip install oraclebone`). The old `ai-divination-skills` package is frozen at 0.7.1 with a deprecation notice.
- Python package renamed: `oraclebone` (was `ai_divination_skills`).
- CLI renamed: `oraclebone` / `oraclebone-mcp`. The old `ai-divination` / `ai-divination-mcp` entry points still work and print a deprecation warning.
- MCP server name is now `oraclebone`; MCP Registry listing moves to `io.github.sapuyou45-bit/oraclebone`.
- Environment variable renamed to `ORACLEBONE_DISABLE_LUNAR_PYTHON` (the old `AI_DIVINATION_DISABLE_LUNAR_PYTHON` is still honored).
- Version jumps to 8.0.0 — eight is the number of the trigrams; the version is part of the brand.


## [0.7.1] - 2026-08-13

### Fixed
- **Xiao Liu Ren casting formula off-by-one** — the three-step count now follows the traditional method (month from Da An, day from the month palace, hour from the day palace, each step counting its starting palace as one): `((month + day + hour - 3) % 6) + 1`. Previously every cast landed one palace too late (e.g. lunar month 1 / day 1 / hour Zi wrongly returned Liu Lian instead of Da An). Added anchored test cases against known traditional results.
- MCP `xiaoliuren_cast` input schema: `day` maximum corrected from 31 to 30 to match the validated lunar-day range.

### Changed
- **MCP tool names are now spec-compliant** (`^[a-zA-Z0-9_-]{1,64}$`): `tarot_draw`, `iching_cast`, `xiaoliuren_cast`, `bazi_cast`. The old dotted names (`tarot.draw`, etc.) keep working as deprecated aliases and return `_meta.deprecated` with the successor name.
- **MCP protocol upgraded to 2025-06-18** with version negotiation — clients requesting 2024-11-05 or 2025-03-26 are still accepted.
- Tool results now include `structuredContent`, and all four casting tools declare an `outputSchema` loaded from the canonical JSON Schemas (now also shipped as package data under `ai_divination_skills/schemas/`).
- Updated client setup docs, READMEs (EN/中文/日本語), and the Docker smoke workflow to the new tool names.


## [0.7.0] - 2026-06-09

### Added
- **Bazi (八字 / Four Pillars) divination skill** — Gregorian birth datetime → year/month/day/hour pillars (天干地支), NaYin (纳音), day master (日主), and Five Elements (五行) tally. Backed by the audited `lunar-python` engine; the model never invents pillars, stems, branches, or wuxing.
- New CLI: `ai-divination bazi --datetime 1990-05-20T14:30:00`.
- New MCP tool: `bazi.cast` (5 tools total now).
- New skill folder: `skills/bazi/` with SKILL.md, references, agent adapters (OpenAI / Claude / Gemini / Cursor), and standalone wrapper.
- New interpretation template: `ai-divination template bazi`.
- New client-config docs: `docs/clients/{claude-desktop,codex,cursor,continue}.md` — copy-paste JSON snippets for the four most common MCP hosts, plus install steps and example tool calls.
- README (EN / 中文 / 日本語) now links to the per-client setup pages.
- Demo SVG/PNG at the top of all three READMEs (`docs/assets/demo.svg`).

### Notes
- `lunar-python` is required for the bazi skill; install with `pip install 'ai-divination-skills[lunar]'`.
- Closes #11.

## [0.6.2] - 2026-06-09

### Added
- MCP Registry support: `server.json` with PyPI package metadata + `mcp-name` ownership token in READMEs, ready for publishing to https://registry.modelcontextprotocol.io/.

## [0.6.1] - 2026-06-09

### Added
- PyPI version and monthly-downloads badges on all three READMEs.
- README (zh-CN + ja) now have the same "Use it from Claude Desktop / Codex / any MCP host" section as the English README.
- Repo description updated to lead with "MCP server + Python CLI" so it surfaces in MCP search.
- Repo topics: `mcp`, `mcp-server`, `model-context-protocol`, `claude`, `claude-desktop`, `anthropic` added.

### Changed
- README install blocks (all three languages) now lead with `pip install ai-divination-skills` and keep the editable install as a secondary option.
- `docs/` site Quick Start now shows the PyPI install and mentions the MCP server.


## [0.6.0] - 2026-06-09

### Added
- **MCP server** (`ai-divination-mcp`): a zero-dependency Model Context Protocol server (JSON-RPC 2.0 over stdio) exposing four tools — `tarot.draw`, `iching.cast`, `xiaoliuren.cast`, `interpretation_template` — for Claude Desktop, Codex, Continue, Cursor, and any other MCP-aware host.
- Console entry point `ai-divination-mcp` registered in `pyproject.toml` and `setup.py`.
- README section "Use it from Claude Desktop / Codex / any MCP host" with full claude_desktop_config.json snippet.
- `tests/test_mcp_server.py` — 12 tests (61 total) covering initialize, tools/list, tools/call for all 4 tools, JSON-RPC error mapping, invalid-JSON recovery, and the full stdio handshake.


## [0.5.4] - 2026-06-09

### Added
- Safety / Ethics Concern issue template (`.github/ISSUE_TEMPLATE/safety_concern.yml`) with structured repro fields.
- `.github/ISSUE_TEMPLATE/config.yml` updated: direct link to GitHub private vulnerability reporting.
- `.github/copilot-instructions.md`: explicit project shape + non-negotiable rules for AI code generators.
- Dependabot grouping: GitHub Actions and pip updates each create a single monthly PR instead of several.
- `.github/PULL_REQUEST_TEMPLATE.md` now referenced from root; UI picker shows it.

### Changed
- Repo settings hardened: squash-merge only (no merge commit, no rebase), auto-merge enabled, update-branch enabled, delete-branch-on-merge.
- Wiki and Projects disabled (no content; solo repo).
- Dependabot security updates enabled, automated security fixes enabled (were off).
- Secret scanning validity checks and non-provider patterns remain off (opt-in by GitHub).


## [0.5.3] - 2026-06-09

### Added
- CodeQL static-analysis workflow (`.github/workflows/codeql.yml`) on push, PR, and weekly cron.
- Markdown link-check workflow (`.github/workflows/link-check.yml`) on markdown PRs and weekly cron, using lychee.
- "📚 Docs / Translation" issue template (`.github/ISSUE_TEMPLATE/docs.yml`).
- README now documents the four per-host adapters (OpenAI / Claude / Gemini / Cursor) and links to Discussions, Roadmap, Security.
- Simplified Chinese and Japanese READMEs now also show the same status badges as the English README.


## [0.5.2] - 2026-06-09

### Added
- Per-skill Claude (`claude.yaml`), Gemini (`gemini.yaml`), and Cursor (`cursor.mdc`) adapters for tarot / I Ching / Xiao Liu Ren. Every adapter routes through the existing audited CLI so the agent never invents a draw.
- `ROADMAP.md` linking the open issues that drive the next releases.
- New `tests/test_agent_adapters.py` (5 tests, 49 total) covering presence, CLI routing, frontmatter, and a "no invented draws" lint.

### Changed
- `main` branch is now protected: linear history, no force-pushes, no deletions, required conversation resolution, and all four `unittest (3.9|3.10|3.11|3.12)` checks must pass before merge.


## [0.5.1] - 2026-06-09

### Added
- Issue templates (bug, feature, new-skill) and PR template with methodology checklist.
- `CODEOWNERS`, `FUNDING.yml`, and `dependabot.yml` (pip + GitHub Actions, monthly).
- Tag-triggered release workflow that builds sdist + wheel and attaches them to a generated GitHub Release.
- CI matrix on Python 3.9 / 3.10 / 3.11 / 3.12 with a CLI smoke test for tarot / iching / xiaoliuren.
- Social preview image (`.github/social-preview-1280x640.png`).
- GitHub Discussions enabled and linked from the issue chooser.

### Changed
- `actions/checkout` → v6, `actions/setup-python` → v6, `actions/upload-artifact` → v7, `softprops/action-gh-release` → v3.

## [0.5.0] - Skill Spec Hardening

See `RELEASE_NOTES.md`.

## [0.4.0] - Installable Package Runtime

See `RELEASE_NOTES.md`.

## [0.3.0] - Unified CLI and Agent Interpretation Templates

See `RELEASE_NOTES.md`.

## [0.2.0] and earlier

See `RELEASE_NOTES.md` and `git log`.

[Unreleased]: https://github.com/sapuyou45-bit/ai-divination-skills/compare/v0.6.2...HEAD
[0.6.2]: https://github.com/sapuyou45-bit/ai-divination-skills/compare/v0.6.1...v0.6.2
[0.6.1]: https://github.com/sapuyou45-bit/ai-divination-skills/compare/v0.6.0...v0.6.1
[0.6.0]: https://github.com/sapuyou45-bit/ai-divination-skills/compare/v0.5.4...v0.6.0
[0.5.4]: https://github.com/sapuyou45-bit/ai-divination-skills/compare/v0.5.3...v0.5.4
[0.5.3]: https://github.com/sapuyou45-bit/ai-divination-skills/compare/v0.5.2...v0.5.3
[0.5.2]: https://github.com/sapuyou45-bit/ai-divination-skills/compare/v0.5.1...v0.5.2
[0.5.1]: https://github.com/sapuyou45-bit/ai-divination-skills/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/sapuyou45-bit/ai-divination-skills/releases/tag/v0.5.0
