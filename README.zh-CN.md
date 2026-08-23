# Oraclebone（甲骨）

<div align="center">
  <img src="docs/assets/icon.svg" alt="Oraclebone 图标：甲骨裂纹末端接 JSON 花括号" width="140">
  <h3><b>骨自裂，模型读之。</b></h3>
  <p>
    <a href="https://pypi.org/project/oraclebone/"><code>uvx oraclebone-mcp</code></a> ·
    <a href="https://sapuyou45-bit.github.io/oraclebone/">主页</a> ·
    <a href="https://github.com/sapuyou45-bit/oraclebone/releases/tag/v8.2.0">v8.2.0</a>
  </p>
</div>

> 三千年前，商王将占卜刻于甲骨之上——那是人类最早可审计的神谕档案。Oraclebone 把同样的纪律带给 AI agent：由可审计的脚本起卦、抽牌、排盘，模型只负责解读既定结果，绝不自己编造。

<!-- mcp-name: io.github.sapuyou45-bit/oraclebone -->

[English](README.md) | [简体中文](README.zh-CN.md) | [日本語](README.ja.md)

<details>
<summary>演示</summary>
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

✨ 给 AI agent 使用的开源占卜技能集：工具负责随机、抽牌和起课，**AI 只负责解读**具体结果。

`oraclebone` 是一个实用的 skill 集合，覆盖塔罗、易经、小六壬，以及后续更多象征系统。它面向 agent 工作流，强调可审计的随机过程、清晰的方法边界，以及可复用的解读模板。

本项目将占卜视为象征推理与反思工具，而不是确定性预言。

## ⚡ 给 AI Agent 一键安装

把这句话发给你的 AI agent：

```text
请帮我安装 AI Divination Skills：https://raw.githubusercontent.com/sapuyou45-bit/oraclebone/main/docs/install.md
```

也可以直接安装到 Claude 风格的本地 skills 目录：

```bash
curl -fsSL https://raw.githubusercontent.com/sapuyou45-bit/oraclebone/main/install.sh | bash
```

默认安装到 `~/.claude/skills`。如需安装到其他 agent 的 skill 目录，请设置 `AI_SKILLS_DIR`。

## ✨ 项目概览

很多 AI 占卜 prompt 会让模型自己编出结果。本项目把两件事分开：

1. 本地脚本生成牌面、卦象或小六壬位置。
2. AI agent 基于具体结果，在安全边界内进行解释。

这样读法更容易测试、复现、审计，也更适合在不同 agent 中复用。

## 🧭 方法论严谨性

核心规则很简单：脚本或用户提供的实体占卜结果负责生成牌面、卦象或位置；AI 只解释这个已经生成的结果，不负责生成占卜结果本身。

这不是在证明占卜具有科学有效性，而是让象征推理工作流更严格：

- 真实 reading 默认使用系统随机
- seed 只用于测试和可复现 demo
- 每个 skill 都记录传统方法和限制
- JSON 输出包含可审计的方法元数据
- 近似模式必须输出 warning，不能伪装成传统准确起法

## 🌐 多语言文档

GitHub Pages 根页面现在默认显示简体中文；如果要切到 English 或 日本語，直接用页面顶部的语言切换即可。

[打开线上页面](https://sapuyou45-bit.github.io/oraclebone/)

本地预览：

```bash
python3 -m http.server 8000 -d docs
```

线上页面：

```text
https://sapuyou45-bit.github.io/oraclebone/
```

## 🧩 已包含 Skills

| Skill | 作用 | 脚本 |
| --- | --- | --- |
| `tarot` | 用于反思、决策、创作卡点和项目复盘的塔罗抽牌。 | `skills/tarot/scripts/draw.py` |
| `iching` | 生成六爻易经卦象，输出本卦与之卦。 | `skills/iching/scripts/cast.py` |
| `xiaoliuren` | 使用农历式数字或轻量公历时间 fallback 起小六壬。 | `skills/xiaoliuren/scripts/cast.py` |
| `bazi` | 根据公历出生日期时间起八字（四柱）盘，需要可选的 `lunar-python` 依赖。 | `skills/bazi/scripts/cast.py` |

## 🚀 快速开始

从 PyPI 安装：

```bash
pip install oraclebone
```

或者从本地 checkout 安装：

```bash
pip install .
```

开发时可以用 editable 模式：

```bash
pip install -e .
```

三个体系使用同一个入口：

```bash
ai-divination tarot --deck major --spread three-card --reversals
ai-divination iching --method yarrow
ai-divination xiaoliuren --method numbers --month 3 --day 12 --hour 7
```

查看给 agent 使用的解读模板：

```bash
ai-divination template tarot
```

也可以直接用 Python API：

```python
from oraclebone.tarot import draw
from oraclebone.iching import cast
from oraclebone.xiaoliuren import cast_numbers
```

也可以继续直接运行底层脚本：

```bash
python3 skills/tarot/scripts/draw.py --deck major --spread three-card --reversals
python3 skills/iching/scripts/cast.py --method coins
python3 skills/iching/scripts/cast.py --method yarrow
python3 skills/xiaoliuren/scripts/cast.py --method numbers --month 3 --day 12 --hour 7
```

需要可复现 demo 时使用 seed：

```bash
python3 skills/tarot/scripts/draw.py --spread decision --seed demo
python3 skills/iching/scripts/cast.py --method yarrow --seed demo
```

所有脚本都会输出 JSON。

## 📦 安装为 Agent Skills

让 AI agent 自己按远程安装说明完成 setup：

```text
请帮我安装 AI Divination Skills：https://raw.githubusercontent.com/sapuyou45-bit/oraclebone/main/docs/install.md
```

也可以直接用 shell 安装：

```bash
curl -fsSL https://raw.githubusercontent.com/sapuyou45-bit/oraclebone/main/install.sh | bash
```

安装脚本默认把 `tarot`、`iching`、`xiaoliuren` 复制到 `~/.claude/skills`。如果要安装到其他 agent 的 skill 目录，请先设置 `AI_SKILLS_DIR`。

手动安装也只是把需要的 skill 文件夹复制到 agent 的 skill 目录：

```bash
mkdir -p ~/.claude/skills
cp -R skills/tarot ~/.claude/skills/tarot
cp -R skills/iching ~/.claude/skills/iching
cp -R skills/xiaoliuren ~/.claude/skills/xiaoliuren
```

每个 skill 都是自包含目录：

```text
skills/name/
  SKILL.md
  agents/openai.yaml
  scripts/
  references/
```

如果只需要某个 skill，复制对应单个文件夹即可。

每个 skill 脚本也支持单文件夹模式。如果已经安装 Python package，脚本会调用包内 runtime；如果只复制了 skill 文件夹，脚本会退回到该 skill 自带的 standalone 脚本。

## 🧠 在 Claude Desktop / Codex 等 MCP 宿主里使用

`oraclebone` 自带 **MCP server**（`ai-divination-mcp`）。任何支持
[Model Context Protocol](https://modelcontextprotocol.io/) 的宿主 —— Claude Desktop、Codex、
Continue、Cursor —— 都能用一行配置挂载它，模型会得到 4 个工具：
`tarot_draw`、`iching_cast`、`xiaoliuren_cast`、`bazi_cast`、`interpretation_template`。

模型永远不会自己编造结果；server 在本地运行经过审计的脚本。

### Claude Desktop 配置

```bash
pip install oraclebone
```

然后编辑 `~/Library/Application Support/Claude/claude_desktop_config.json`（macOS）或
`%APPDATA%\Claude\claude_desktop_config.json`（Windows）：

```json
{
  "mcpServers": {
    "divination": {
      "command": "ai-divination-mcp"
    }
  }
}
```

重启 Claude Desktop。之后对它说"帮我抽三张塔罗看一下今天的决策"即可。

### 各客户端配置教程

复制即用的 JSON 配置和示例 prompt：

- [Claude Desktop](docs/clients/claude-desktop.md)
- [Codex CLI](docs/clients/codex.md)
- [Cursor](docs/clients/cursor.md)
- [Continue](docs/clients/continue.md)

## 🤖 Agent 行为

每个 skill 都要求 agent：

- 生成或接受一个具体的抽取/起卦结果
- 只在需要时读取简洁参考资料
- 使用共享响应协议解释
- 避免确定性、宿命论和专业建议

共享规范位于：

- `shared/methodology.md`
- `shared/interpretation-protocol.md`
- `shared/response-contract.md`
- `shared/randomness-protocol.md`
- `shared/safety-policy.md`
- `shared/interpretation-style.md`

## 🧪 示例

- `examples/tarot-decision.md`
- `examples/iching-strategy.md`
- `examples/xiaoliuren-daily.md`

## 🛡️ 安全边界

这些 skills 不用于医疗、法律、金融或危机处置建议。

好的解读应该：

- 将结果表述为象征性反思
- 将主要判断连接到脚本生成的结果
- 保留用户自主性
- 给出小而可逆的下一步
- 清楚说明不确定性

完整立场见 `ETHICS.md`。

## 🛠️ 开发

除 Python 3 外没有运行依赖。

运行测试：

```bash
python3 -m unittest discover -s tests
```

## 🗺️ 路线图

近期：

- 增加正式发布 Python package 的 workflow。
- 继续扩展 CI 中的自动 skill validation。
- 为 MVP skills 增加更丰富的参考资料。
- 增加更多示例解读。
- 增加更多 agent 集成例子。

后续：

- `meihua`
- `liuyao`
- `runes`
- `numerology`
- `astrology`

## 📄 License

MIT
