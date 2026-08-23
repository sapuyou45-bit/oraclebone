# Oraclebone

<div align="center">
  <img src="docs/assets/icon.svg" alt="Oraclebone icon: oracle-bone crack joined with JSON braces" width="140">
  <h3><b>The bone cracks. The model reads.</b></h3>
  <p>
    <a href="https://pypi.org/project/oraclebone/"><code>uvx oraclebone-mcp</code></a> ·
    <a href="https://sapuyou45-bit.github.io/oraclebone/">Homepage</a> ·
    <a href="https://github.com/sapuyou45-bit/oraclebone/releases/tag/v8.2.0">v8.2.0</a>
  </p>
</div>

> Three thousand years ago, Shang kings carved their divinations into bone — the first auditable record of an oracle at work. Oraclebone brings the same discipline to AI agents: audited scripts produce the draw, the hexagram, the pillars; the model only interprets what it is given. It never invents the result.

<!-- mcp-name: io.github.sapuyou45-bit/oraclebone -->

[English](README.md) | [简体中文](README.zh-CN.md) | [日本語](README.ja.md)

<details>
<summary>Demo</summary>
<p align="center">
  <a href="https://pypi.org/project/oraclebone/">
    <img src="docs/assets/demo.svg" alt="oraclebone demo: pip install, tarot draw, I Ching cast, MCP server stdio" width="100%">
  </a>
</p>
</details>

[![tests](https://github.com/sapuyou45-bit/oraclebone/actions/workflows/tests.yml/badge.svg)](https://github.com/sapuyou45-bit/oraclebone/actions/workflows/tests.yml)
[![release](https://github.com/sapuyou45-bit/oraclebone/actions/workflows/release.yml/badge.svg)](https://github.com/sapuyou45-bit/oraclebone/actions/workflows/release.yml)
[![PyPI](https://img.shields.io/pypi/v/oraclebone?color=blue)](https://pypi.org/project/oraclebone/)
[![PyPI Downloads](https://img.shields.io/pypi/dm/oraclebone)](https://pypi.org/project/oraclebone/)
[![Latest release](https://img.shields.io/github/v/release/sapuyou45-bit/oraclebone?sort=semver)](https://github.com/sapuyou45-bit/oraclebone/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/python-3.9%20%7C%203.10%20%7C%203.11%20%7C%203.12-blue)](https://github.com/sapuyou45-bit/oraclebone/actions/workflows/tests.yml)
[![GitHub Discussions](https://img.shields.io/github/discussions/sapuyou45-bit/oraclebone)](https://github.com/sapuyou45-bit/oraclebone/discussions)

🔮 Open-source divination toolkit for AI agents, formerly known as **ai-divination-skills** (renamed in v8.0.0 — the old PyPI package is frozen; install `oraclebone` instead).

`oraclebone` is a practical skill collection for tarot, I Ching, Xiao Liu Ren, and future symbolic systems. It is built for agent workflows that need auditable randomness, clear method boundaries, and reusable interpretation templates.

This project treats divination as symbolic reasoning and reflection, not deterministic prediction.

## ⚡ One-line Install for AI Agents

Paste this into your AI agent:

```text
Install Oraclebone for this agent: https://raw.githubusercontent.com/sapuyou45-bit/oraclebone/main/docs/install.md
```

Or install directly for Claude-style local skills:

```bash
curl -fsSL https://raw.githubusercontent.com/sapuyou45-bit/oraclebone/main/install.sh | bash
```

The default target is `~/.claude/skills`. Set `AI_SKILLS_DIR` for another agent skill directory.

## ✨ Overview

Most AI divination prompts let the model invent the result. This repo separates the two jobs:

1. A local script produces the card draw, hexagram, or Xiao Liu Ren position.
2. The AI agent interprets that generated result with clear safety boundaries.

That makes readings easier to test, reproduce, audit, and reuse across agents.

## 🧭 Methodological Rigor

The core rule is simple: scripts or user-provided physical casts generate the divination result; AI interprets that result and does not generate the divination result.

This is not scientific proof of divination efficacy. It is a stricter workflow for symbolic reasoning:

- real readings use system randomness by default
- seeded mode is only for tests and reproducible demos
- traditional methods and limitations are documented per skill
- JSON outputs include enough metadata to audit the method
- approximate modes emit warnings instead of pretending to be traditional

## 🌐 Multilingual Docs

The GitHub Pages site ships a six-language switcher — 简体中文, English, 日本語, Português, 한국어, Español. It follows your browser language by default and remembers your manual choice.

[Open the published site](https://sapuyou45-bit.github.io/oraclebone/)

Local preview:

```bash
python3 -m http.server 8000 -d docs
```

Published site:

```text
https://sapuyou45-bit.github.io/oraclebone/
```

## 🧩 Included Skills

| Skill | What it does | Script |
| --- | --- | --- |
| `tarot` | Draws tarot cards for reflection, decisions, creative blocks, and project reframing. | `skills/tarot/scripts/draw.py` |
| `iching` | Casts six-line I Ching hexagrams with primary and resulting hexagrams. | `skills/iching/scripts/cast.py` |
| `xiaoliuren` | Casts Xiao Liu Ren from lunar-style numbers or a Gregorian time fallback. | `skills/xiaoliuren/scripts/cast.py` |
| `bazi` | Casts a Bazi (Four Pillars / 八字) chart from a Gregorian birth datetime. Requires the optional `lunar-python` extra. | `skills/bazi/scripts/cast.py` |

## 🚀 Quick Start

Install from PyPI:

```bash
pip install oraclebone
```

Or from a checkout:

```bash
pip install .
```

Use editable mode while developing:

```bash
pip install -e .
```

Use one command for every system:

```bash
ai-divination tarot --deck major --spread three-card --reversals
ai-divination iching --method yarrow
ai-divination xiaoliuren --method numbers --month 3 --day 12 --hour 7
```

Ask for an agent interpretation template:

```bash
ai-divination template tarot
```

Use the Python API directly:

```python
from oraclebone.tarot import draw
from oraclebone.iching import cast
from oraclebone.xiaoliuren import cast_numbers
```

You can still run the underlying scripts directly:

```bash
python3 skills/tarot/scripts/draw.py --deck major --spread three-card --reversals
python3 skills/iching/scripts/cast.py --method coins
python3 skills/iching/scripts/cast.py --method yarrow
python3 skills/xiaoliuren/scripts/cast.py --method numbers --month 3 --day 12 --hour 7
```

Use a seed for reproducible demos:

```bash
python3 skills/tarot/scripts/draw.py --spread decision --seed demo
python3 skills/iching/scripts/cast.py --method yarrow --seed demo
```

All scripts output JSON.

## 📦 Install as Agent Skills

For AI-agent-guided setup, use the remote install runbook:

```text
Install Oraclebone for this agent: https://raw.githubusercontent.com/sapuyou45-bit/oraclebone/main/docs/install.md
```

For direct shell install:

```bash
curl -fsSL https://raw.githubusercontent.com/sapuyou45-bit/oraclebone/main/install.sh | bash
```

The installer copies `tarot`, `iching`, and `xiaoliuren` into `~/.claude/skills` by default. To target another agent, set `AI_SKILLS_DIR` before running it.

Manual install is just copying the folders you want into your agent's skill directory:

```bash
mkdir -p ~/.claude/skills
cp -R skills/tarot ~/.claude/skills/tarot
cp -R skills/iching ~/.claude/skills/iching
cp -R skills/xiaoliuren ~/.claude/skills/xiaoliuren
```

Each skill is self-contained:

```text
skills/name/
  SKILL.md
  agents/openai.yaml
  scripts/
  references/
```

Install individual folders, not the entire repository, when you only want one skill.

Each skill script also works in single-folder mode. If the Python package is installed, the script delegates to the package runtime. If only the skill folder is copied, it falls back to the bundled standalone script in that skill.


### Per-host adapters

Every skill ships four adapter files in `skills/<skill>/agents/`:

| Host | File | How it is invoked |
|---|---|---|
| OpenAI / Codex skills | `openai.yaml` | Skill metadata + brand icons. |
| Claude Desktop / claude.ai project skills | `claude.yaml` | Tool spec that runs `ai-divination <skill>`. |
| Gemini CLI / Gemini Extensions | `gemini.yaml` | Extension manifest that runs the same CLI. |
| Cursor | `cursor.mdc` | Rule file with hard "never invent the draw" guard. |

All four adapters route through the same audited `ai-divination <skill>` CLI, so the agent host never invents the result.

## 🧠 Use it from Claude Desktop / Codex / any MCP host

`oraclebone` ships a built-in **MCP server** (`ai-divination-mcp`). Any
[Model Context Protocol](https://modelcontextprotocol.io/) host — Claude Desktop, Codex,
Continue, Cursor — can mount it with a single config line, and the model gets five tools:
`tarot_draw`, `iching_cast`, `xiaoliuren_cast`, `bazi_cast`, and `interpretation_template`.

The model never invents the draw; the server runs the audited scripts locally.

### Claude Desktop

Install the package once:

```bash
pip install oraclebone
```

Then edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or
`%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "divination": {
      "command": "ai-divination-mcp"
    }
  }
}
```

Restart Claude Desktop. Ask "draw three tarot cards for my decision" — Claude will call
`tarot_draw` and interpret the JSON output.

### Codex / Continue / Cursor

Any MCP-aware host follows the same pattern. The server speaks JSON-RPC 2.0 over stdio
with no third-party dependencies.

### Per-client setup guides

Copy-paste JSON configs and example prompts for each host:

- [Claude Desktop](docs/clients/claude-desktop.md)
- [Codex CLI](docs/clients/codex.md)
- [Cursor](docs/clients/cursor.md)
- [Continue](docs/clients/continue.md)

## 🤖 Agent Behavior

Each skill instructs the agent to:

- generate or accept a concrete draw/cast result
- read concise reference material only when needed
- interpret with the shared response contract
- avoid certainty, fatalism, and professional advice

Shared guidance lives in:

- `shared/methodology.md`
- `shared/interpretation-protocol.md`
- `shared/response-contract.md`
- `shared/randomness-protocol.md`
- `shared/safety-policy.md`
- `shared/interpretation-style.md`

## 🧪 Examples

- `examples/tarot-decision.md`
- `examples/iching-strategy.md`
- `examples/xiaoliuren-daily.md`

## 🛡️ Safety Boundaries

These skills are not for medical, legal, financial, or crisis guidance.

Good readings should:

- frame the result as symbolic reflection
- connect claims to the generated result
- preserve user agency
- offer small, reversible next steps
- state uncertainty clearly

See `ETHICS.md` for the full project stance.

## 🛠️ Development

No runtime dependencies are required beyond Python 3.

Run tests:

```bash
python3 -m unittest discover -s tests
```

Current coverage checks:

- unified CLI routing
- package-only CLI execution
- importable Python APIs
- single-folder skill execution
- skill metadata and asset contracts
- interpretation protocol templates
- tarot spread output
- I Ching cast structure and manual lines
- Xiao Liu Ren number and time fallback behavior

## 💬 Community

- Releases: <https://github.com/sapuyou45-bit/oraclebone/releases>
- Roadmap: [`ROADMAP.md`](./ROADMAP.md)
- Discussions: <https://github.com/sapuyou45-bit/oraclebone/discussions>
- Issues: pick a [`good first issue`](https://github.com/sapuyou45-bit/oraclebone/labels/good%20first%20issue) or propose a [`new-skill`](https://github.com/sapuyou45-bit/oraclebone/labels/new-skill)
- Security: see [`SECURITY.md`](./SECURITY.md) for private vulnerability reporting

## 🗺️ Roadmap

Near-term:

- Add a published package workflow.
- Expand automated skill validation in CI.
- Add richer reference material for each MVP skill.
- Add more example readings.
- Add more agent integration examples.

Later:

- `meihua`
- `liuyao`
- `runes`
- `numerology`
- `astrology`

## 📄 License

MIT
