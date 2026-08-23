(function () {
  "use strict";

  var LANGS = ["zh", "en", "ja", "pt", "ko", "es"];

  const translations = {
    zh: {
      "meta.title": "OracleBone 卜骨 — 让 AI 用可审计的随机性占卜",
      "meta.description": "给 AI agent 使用的直接、实用占卜技能集：周易、八字、塔罗、小六壬。脚本计算，零幻觉。",
      "nav.skills": "技能",
      "nav.rigor": "方法",
      "nav.connect": "接入",
      "nav.safety": "边界",
      "hero.title": "让 AI 用可审计的随机性起卦、排盘、抽塔罗",
      "hero.copy": "蓍草概率、八字历法、64 卦全文——全部脚本计算，零幻觉。一次安装，Claude、Cursor、Gemini 都能用。",
      "hero.note": "PyPI 已发布 · CI 全绿 · Docker 支持",
      "hero.jsonLabel": "hexagram.cast() 输出示例",
      "intro.label": "为什么做这个",
      "intro.title": "模型不应该自己编出占卜结果。",
      "intro.copy": "本项目把抽取与解释分开：本地脚本用系统随机或传统概率生成牌面、卦象或四柱，AI 只基于这个具体结果进行解读。",
      "rigor.label": "方法论严谨性",
      "rigor.title": "随机过程和 AI 解读清楚分开。",
      "rigor.item1": "塔罗使用显式 Fisher-Yates 洗牌。",
      "rigor.item2": "易经支持三枚硬币法与蓍草等价概率（6:1/16 · 7:5/16 · 8:7/16 · 9:3/16）。",
      "rigor.item3": "小六壬缺参数时报错会点名缺失字段；近似模式必带 warning。",
      "rigor.item4": "seed 只用于测试和可复现 demo，正常占卜走系统随机。",
      "skills.label": "已包含技能",
      "skills.title": "四个实用模块。",
      "skills.iching.title": "周易",
      "skills.iching.copy": "蓍草法起卦，输出本卦、变爻与之卦，附 64 卦全文。",
      "skills.bazi.title": "八字",
      "skills.bazi.copy": "真太阳时排四柱、五行、纳音；生肖按年柱口径，另附农历口径对照。",
      "skills.tarot.title": "塔罗",
      "skills.tarot.copy": "大阿卡纳，牌阵可选，支持逆位，Fisher-Yates 洗牌。",
      "skills.xiaoliuren.title": "小六壬",
      "skills.xiaoliuren.copy": "农历数字或公历时间双起卦法，缺参报错直接指出缺什么。",
      "mcp.label": "30 秒接入",
      "mcp.title": "把 MCP server 接到你的 Agent。",
      "mcp.claude": "Claude Code / Desktop",
      "mcp.cursorHint": "Settings → MCP → 粘贴 JSON 配置",
      "mcp.others": "Codex / 其他",
      "mcp.othersHint": "stdio JSON-RPC · 标准 MCP 协议",
      "cli.label": "或者直接用 CLI",
      "install.label": "一键安装",
      "install.title": "把一句话发给你的 AI agent。",
      "install.copy": "agent 会读取远程安装说明，把 tarot、iching、xiaoliuren、bazi 复制到 skill 目录，并验证脚本。",
      "install.shellCopy": "也可以直接装到 Claude 风格的本地 skills 目录：",
      "install.target": "默认目标：~/.claude/skills。设置 AI_SKILLS_DIR 可安装到其他 agent 的 skill 目录。",
      "safety.label": "安全边界",
      "safety.title": "象征性反思，不是确定性预言。",
      "safety.item1": "不要把解读用作医疗、法律、金融或危机处置建议。",
      "safety.item2": "每个主要解释都要回到脚本生成的具体结果。",
      "safety.item3": "保留用户自主性，并给出小而可逆的下一步。",
      "footer.ethics": "伦理说明"
    },
    en: {
      "meta.title": "OracleBone — Auditable randomness for AI divination",
      "meta.description": "An auditable divination MCP server for AI agents: I Ching, Bazi, Tarot, Xiao Liuren. Computed by script, zero hallucination.",
      "nav.skills": "Skills",
      "nav.rigor": "Method",
      "nav.connect": "Connect",
      "nav.safety": "Safety",
      "hero.title": "Auditable randomness for AI divination — I Ching, Bazi, Tarot, Xiao Liuren",
      "hero.copy": "Yarrow-stalk probabilities, Bazi calendars, full 64-hexagram texts — all computed by script, zero hallucination. Install once, works with Claude, Cursor, and Gemini.",
      "hero.note": "Published on PyPI · CI green · Docker support",
      "hero.jsonLabel": "hexagram.cast() sample output",
      "intro.label": "Why this exists",
      "intro.title": "Models should not invent divination results.",
      "intro.copy": "This project separates drawing from interpretation: local scripts generate cards, hexagrams, or four pillars using system randomness or traditional probabilities, and the AI only interprets that concrete result.",
      "rigor.label": "Methodological rigor",
      "rigor.title": "Random process and AI interpretation, clearly separated.",
      "rigor.item1": "Tarot uses an explicit Fisher-Yates shuffle.",
      "rigor.item2": "I Ching supports the three-coin method and yarrow-stalk equivalent probabilities (6:1/16 · 7:5/16 · 8:7/16 · 9:3/16).",
      "rigor.item3": "Xiao Liuen errors name the exact missing fields; approximate modes always carry a warning.",
      "rigor.item4": "Seeds are for tests and reproducible demos only; real casts use system randomness.",
      "skills.label": "Included skills",
      "skills.title": "Four practical modules.",
      "skills.iching.title": "I Ching",
      "skills.iching.copy": "Yarrow-stalk casting with original hexagram, changing lines, and derived hexagram, plus full 64-hexagram texts.",
      "skills.bazi.title": "Bazi",
      "skills.bazi.copy": "Four pillars, elements, and Nayin with true solar time; zodiac follows the year pillar, with a lunar-new-year comparison.",
      "skills.tarot.title": "Tarot",
      "skills.tarot.copy": "Major Arcana with selectable spreads, reversals supported, Fisher-Yates shuffle.",
      "skills.xiaoliuren.title": "Xiao Liuren",
      "skills.xiaoliuren.copy": "Dual casting by lunar-style numbers or clock time; missing-parameter errors name what is missing.",
      "mcp.label": "Connect in 30 seconds",
      "mcp.title": "Plug the MCP server into your agent.",
      "mcp.claude": "Claude Code / Desktop",
      "mcp.cursorHint": "Settings → MCP → paste JSON config",
      "mcp.others": "Codex / others",
      "mcp.othersHint": "stdio JSON-RPC · standard MCP protocol",
      "cli.label": "Or use the CLI directly",
      "install.label": "One-line install",
      "install.title": "Paste one line into your AI agent",
      "install.copy": "The agent reads the remote install runbook, copies tarot, iching, xiaoliuren, and bazi into its skill directory, and verifies the scripts.",
      "install.shellCopy": "Or install directly into a Claude-style local skills directory:",
      "install.target": "Default target: ~/.claude/skills. Set AI_SKILLS_DIR to target another agent's skill directory.",
      "safety.label": "Safety boundaries",
      "safety.title": "Symbolic reflection, not deterministic prophecy.",
      "safety.item1": "Do not use interpretations as medical, legal, financial, or crisis advice.",
      "safety.item2": "Anchor every major interpretation to the concrete script-generated result.",
      "safety.item3": "Preserve user agency and suggest small, reversible next steps.",
      "footer.ethics": "Ethics"
    },
    ja: {
      "meta.title": "OracleBone 卜骨 — AI に監査可能なランダム性で占わせる",
      "meta.description": "AI エージェント向けの監査可能な占い MCP サーバー：周易・八字・タロット・小六壬。スクリプト計算、幻覚ゼロ。",
      "nav.skills": "スキル",
      "nav.rigor": "手法",
      "nav.connect": "接続",
      "nav.safety": "安全",
      "hero.title": "AI に監査可能なランダム性で起卦・命式・タロットを",
      "hero.copy": "蓍草法の確率、八字暦、64卦全文——すべてスクリプトが計算し、幻覚はゼロ。一度のインストールで Claude・Cursor・Gemini に対応。",
      "hero.note": "PyPI 公開済み · CI 全緑 · Docker 対応",
      "hero.jsonLabel": "hexagram.cast() の出力例",
      "intro.label": "なぜ作ったか",
      "intro.title": "モデルが占い結果をでっち上げるべきではない。",
      "intro.copy": "このプロジェクトは抽選と解釈を分離します：ローカルのスクリプトがシステム乱数または伝統的確率でカード・卦・四柱を生成し、AI はその具体的结果のみを解釈します。",
      "rigor.label": "手法の厳格さ",
      "rigor.title": "乱数過程と AI 解釈を明確に分離。",
      "rigor.item1": "タロットは明示的な Fisher-Yates シャッフルを使用。",
      "rigor.item2": "周易は三枚コイン法と蓍草法等価確率に対応（6:1/16 · 7:5/16 · 8:7/16 · 9:3/16）。",
      "rigor.item3": "小六壬は欠落パラメータをエラーが明示。近似モードには必ず warning を付与。",
      "rigor.item4": "seed はテストと再現デモ専用。通常の占いはシステム乱数を使用。",
      "skills.label": "収録スキル",
      "skills.title": "4 つの実用モジュール。",
      "skills.iching.title": "周易",
      "skills.iching.copy": "蓍草法で起卦し、本卦・変爻・之卦を出力。64卦全文を収録。",
      "skills.bazi.title": "八字",
      "skills.bazi.copy": "真太陽時で四柱・五行・納音を排出。生肖は年柱基準、旧暦基準の対照も付属。",
      "skills.tarot.title": "タロット",
      "skills.tarot.copy": "大アルカナ、スプレッド選択可、逆位置対応、Fisher-Yates シャッフル。",
      "skills.xiaoliuren.title": "小六壬",
      "skills.xiaoliuren.copy": "旧暦式数字と時計時刻の二元起課。欠損パラメータはエラーが直接指摘。",
      "mcp.label": "30 秒で接続",
      "mcp.title": "MCP サーバーをエージェントに接続。",
      "mcp.claude": "Claude Code / Desktop",
      "mcp.cursorHint": "Settings → MCP → JSON 設定を貼り付け",
      "mcp.others": "Codex / その他",
      "mcp.othersHint": "stdio JSON-RPC · 標準 MCP プロトコル",
      "cli.label": "または CLI を直接使用",
      "install.label": "ワンライン導入",
      "install.title": "AI エージェントに一言貼り付けるだけ",
      "install.copy": "エージェントはリモートのインストール手順を読み込み、tarot・iching・xiaoliuren・bazi を skill ディレクトリにコピーして検証します。",
      "install.shellCopy": "Claude 方式のローカル skills ディレクトリに直接インストールもできます：",
      "install.target": "既定の配置先：~/.claude/skills。別のエージェント用ディレクトリには AI_SKILLS_DIR を設定してください。",
      "safety.label": "安全の境界",
      "safety.title": "象徴的な内省であり、確定的な預言ではない。",
      "safety.item1": "解釈を医療・法律・金融・危機対応の助言として使わない。",
      "safety.item2": "主な解釈はすべてスクリプトが生成した具体的结果に根ざす。",
      "safety.item3": "ユーザーの自律性を保ち、小さく可逆な次の一手を提案する。",
      "footer.ethics": "倫理ポリシー"
    },
    pt: {
      "meta.title": "OracleBone — Aleatoriedade auditável para adivinhação com IA",
      "meta.description": "Servidor MCP de adivinhação auditável para agentes de IA: I Ching, Bazi, Tarô, Xiao Liuren. Calculado por script, zero alucinação.",
      "nav.skills": "Habilidades",
      "nav.rigor": "Método",
      "nav.connect": "Conectar",
      "nav.safety": "Segurança",
      "hero.title": "Aleatoriedade auditável para adivinhação por IA — I Ching, Bazi, Tarô, Xiao Liuren",
      "hero.copy": "Probabilidades de mile-folhas, calendários Bazi, textos completos dos 64 hexagramas — tudo calculado por script, zero alucinação. Instale uma vez, funciona com Claude, Cursor e Gemini.",
      "hero.note": "Publicado no PyPI · CI verde · Suporte a Docker",
      "hero.jsonLabel": "exemplo de saída de hexagram.cast()",
      "intro.label": "Por que isto existe",
      "intro.title": "Modelos não deveriam inventar resultados de adivinhação.",
      "intro.copy": "Este projeto separa a extração da interpretação: scripts locais geram cartas, hexagramas ou quatro pilares com aleatoriedade do sistema ou probabilidades tradicionais, e a IA interpreta apenas esse resultado concreto.",
      "rigor.label": "Rigor metodológico",
      "rigor.title": "Processo aleatório e interpretação por IA, claramente separados.",
      "rigor.item1": "O tarô usa embaralhamento Fisher-Yates explícito.",
      "rigor.item2": "O I Ching suporta o método das três moedas e probabilidades equivalentes ao mile-folhas (6:1/16 · 7:5/16 · 8:7/16 · 9:3/16).",
      "rigor.item3": "Erros do Xiao Liuren nomeiam os campos ausentes; modos aproximados sempre trazem um aviso.",
      "rigor.item4": "Seeds são só para testes e demos reproduzíveis; castings reais usam aleatoriedade do sistema.",
      "skills.label": "Habilidades incluídas",
      "skills.title": "Quatro módulos práticos.",
      "skills.iching.title": "I Ching",
      "skills.iching.copy": "Extração pelo método mile-folhas com hexagrama original, linhas mutantes e hexagrama derivado, mais os textos completos dos 64 hexagramas.",
      "skills.bazi.title": "Bazi",
      "skills.bazi.copy": "Quatro pilares, elementos e Nayin com hora solar verdadeira; zodíaco segue o pilar do ano, com comparação pelo ano lunar novo.",
      "skills.tarot.title": "Tarô",
      "skills.tarot.copy": "Arcanos maiores com tiragens selecionáveis, reversões suportadas, embaralhamento Fisher-Yates.",
      "skills.xiaoliuren.title": "Xiao Liuren",
      "skills.xiaoliuren.copy": "Extração dupla por números ao estilo lunar ou por horário; erros de parâmetro ausente indicam o que falta.",
      "mcp.label": "Conecte em 30 segundos",
      "mcp.title": "Ligue o servidor MCP ao seu agente.",
      "mcp.claude": "Claude Code / Desktop",
      "mcp.cursorHint": "Settings → MCP → cole a configuração JSON",
      "mcp.others": "Codex / outros",
      "mcp.othersHint": "stdio JSON-RPC · protocolo MCP padrão",
      "cli.label": "Ou use a CLI diretamente",
      "install.label": "Instalação em uma linha",
      "install.title": "Cole uma linha no seu agente de IA",
      "install.copy": "O agente lê o guia remoto de instalação, copia tarot, iching, xiaoliuren e bazi para o diretório de skills e verifica os scripts.",
      "install.shellCopy": "Ou instale diretamente em um diretório de skills local estilo Claude:",
      "install.target": "Destino padrão: ~/.claude/skills. Defina AI_SKILLS_DIR para mirar o diretório de skills de outro agente.",
      "safety.label": "Limites de segurança",
      "safety.title": "Reflexão simbólica, não profecia determinística.",
      "safety.item1": "Não use interpretações como aconselhamento médico, jurídico, financeiro ou de crise.",
      "safety.item2": "Ancore cada interpretação principal no resultado concreto gerado pelo script.",
      "safety.item3": "Preserve a autonomia do usuário e sugira próximos passos pequenos e reversíveis.",
      "footer.ethics": "Ética"
    },
    ko: {
      "meta.title": "OracleBone 卜骨 — AI에게 감사 가능한 무작위성으로 점을 치게 하다",
      "meta.description": "AI 에이전트를 위한 감사 가능한 점술 MCP 서버: 주역,八字, 타로, 소육임. 스크립트 계산, 환각 없음.",
      "nav.skills": "기술",
      "nav.rigor": "방법론",
      "nav.connect": "연결",
      "nav.safety": "안전",
      "hero.title": "감사 가능한 무작위성으로 AI가 괘를 뽑고 사주를 세우고 타로를 뽑게 하다",
      "hero.copy": "효죽 확률,八字 역법, 64괘 전문 — 모두 스크립트가 계산하여 환각이 없습니다. 한 번 설치하면 Claude·Cursor·Gemini에서 사용할 수 있습니다.",
      "hero.note": "PyPI 출시 · CI 전부 통과 · Docker 지원",
      "hero.jsonLabel": "hexagram.cast() 출력 예시",
      "intro.label": "왜 만들었나",
      "intro.title": "모델이 점술 결과를 지어내서는 안 됩니다.",
      "intro.copy": "이 프로젝트는 추출과 해석을 분리합니다. 로컬 스크립트가 시스템 난수 또는 전통적 확률로 카드·괘·사주를 생성하고, AI는 그 구체적인 결과만 해석합니다.",
      "rigor.label": "방법론적 엄격함",
      "rigor.title": "난수 과정과 AI 해석을 명확히 분리.",
      "rigor.item1": "타로는 명시적 Fisher-Yates 셔플을 사용합니다.",
      "rigor.item2": "주역은 동전 세 개 방식과 효죽 등가 확률을 지원합니다(6:1/16 · 7:5/16 · 8:7/16 · 9:3/16).",
      "rigor.item3": "소육임은 누락된 매개변수를 오류에 명시하고, 근사 모드에는 항상 경고를 붙입니다.",
      "rigor.item4": "seed는 테스트와 재현 데모 전용이며, 실제 점은 시스템 난수를 사용합니다.",
      "skills.label": "포함된 기술",
      "skills.title": "네 가지 실용 모듈.",
      "skills.iching.title": "주역",
      "skills.iching.copy": "효죽법으로 괘를 뽑아 본괘·변효·지괘를 출력하고 64괘 전문을 수록.",
      "skills.bazi.title": "八字",
      "skills.bazi.copy": "진태양시로 사주·오행·납음을 계산. 띠는 년주 기준이며 음력 기준 대조도 제공.",
      "skills.tarot.title": "타로",
      "skills.tarot.copy": "메이저 아르카나, 스프레드 선택 가능, 역방향 지원, Fisher-Yates 셔플.",
      "skills.xiaoliuren.title": "소육임",
      "skills.xiaoliuren.copy": "음력식 숫자와 시계 시각 이중 기점. 누락 매개변수는 오류가 직접 지목.",
      "mcp.label": "30초 연결",
      "mcp.title": "MCP 서버를 에이전트에 연결하세요.",
      "mcp.claude": "Claude Code / Desktop",
      "mcp.cursorHint": "Settings → MCP → JSON 설정 붙여넣기",
      "mcp.others": "Codex / 기타",
      "mcp.othersHint": "stdio JSON-RPC · 표준 MCP 프로토콜",
      "cli.label": "또는 CLI를 직접 사용",
      "install.label": "한 줄 설치",
      "install.title": "AI 에이전트에 한 줄만 붙여넣으세요",
      "install.copy": "에이전트가 원격 설치 지침을 읽어 tarot·iching·xiaoliuren·bazi를 skill 디렉터리에 복사하고 스크립트를 검증합니다.",
      "install.shellCopy": "또는 Claude 스타일 로컬 skills 디렉터리에 바로 설치할 수 있습니다:",
      "install.target": "기본 대상: ~/.claude/skills. 다른 에이전트의 skill 디렉터리에는 AI_SKILLS_DIR를 설정하세요.",
      "safety.label": "안전 경계",
      "safety.title": "상징적 성찰이지 결정론적 예언이 아닙니다.",
      "safety.item1": "해석을 의료·법률·금융·위기 대처 조언으로 사용하지 마십시오.",
      "safety.item2": "모든 주요 해석은 스크립트가 생성한 구체적 결과에 근거해야 합니다.",
      "safety.item3": "사용자의 자율성을 존중하고 작고 되돌릴 수 있는 다음 단계를 제안합니다.",
      "footer.ethics": "윤리"
    },
    es: {
      "meta.title": "OracleBone — Aleatoriedad auditable para adivinación con IA",
      "meta.description": "Servidor MCP de adivinación auditable para agentes de IA: I Ching, Bazi, Tarot, Xiao Liuren. Calculado por script, cero alucinación.",
      "nav.skills": "Habilidades",
      "nav.rigor": "Método",
      "nav.connect": "Conectar",
      "nav.safety": "Seguridad",
      "hero.title": "Aleatoriedad auditable para adivinación con IA — I Ching, Bazi, Tarot, Xiao Liuren",
      "hero.copy": "Probabilidades de mil hojas, calendarios Bazi, textos completos de los 64 hexagramas — todo calculado por script, cero alucinación. Instala una vez, funciona con Claude, Cursor y Gemini.",
      "hero.note": "Publicado en PyPI · CI en verde · Soporte Docker",
      "hero.jsonLabel": "ejemplo de salida de hexagram.cast()",
      "intro.label": "Por qué existe",
      "intro.title": "Los modelos no deberían inventar resultados de adivinación.",
      "intro.copy": "Este proyecto separa la extracción de la interpretación: los scripts locales generan cartas, hexagramas o cuatro pilares con aleatoriedad del sistema o probabilidades tradicionales, y la IA interpreta solo ese resultado concreto.",
      "rigor.label": "Rigor metodológico",
      "rigor.title": "Proceso aleatorio e interpretación por IA, claramente separados.",
      "rigor.item1": "El tarot usa barajado Fisher-Yates explícito.",
      "rigor.item2": "El I Ching admite el método de tres monedas y probabilidades equivalentes al método de mil hojas (6:1/16 · 7:5/16 · 8:7/16 · 9:3/16).",
      "rigor.item3": "Los errores de Xiao Liuren nombran los campos faltantes; los modos aproximados siempre incluyen un aviso.",
      "rigor.item4": "Las seeds son solo para pruebas y demos reproducibles; los lanzamientos reales usan aleatoriedad del sistema.",
      "skills.label": "Habilidades incluidas",
      "skills.title": "Cuatro módulos prácticos.",
      "skills.iching.title": "I Ching",
      "skills.iching.copy": "Lanzamiento por mil hojas con hexagrama original, líneas mutantes y hexagrama derivado, más los textos completos de los 64 hexagramas.",
      "skills.bazi.title": "Bazi",
      "skills.bazi.copy": "Cuatro pilares, elementos y Nayin con hora solar verdadera; el zodiaco sigue el pilar del año, con comparación por año lunar nuevo.",
      "skills.tarot.title": "Tarot",
      "skills.tarot.copy": "Arcanos mayores con tiradas seleccionables, inversiones soportadas, barajado Fisher-Yates.",
      "skills.xiaoliuren.title": "Xiao Liuren",
      "skills.xiaoliuren.copy": "Lanzamiento doble por números estilo lunar o por hora del reloj; los errores de parámetros faltantes indican qué falta.",
      "mcp.label": "Conecta en 30 segundos",
      "mcp.title": "Conecta el servidor MCP a tu agente.",
      "mcp.claude": "Claude Code / Desktop",
      "mcp.cursorHint": "Settings → MCP → pega la configuración JSON",
      "mcp.others": "Codex / otros",
      "mcp.othersHint": "stdio JSON-RPC · protocolo MCP estándar",
      "cli.label": "O usa la CLI directamente",
      "install.label": "Instalación en una línea",
      "install.title": "Pega una línea en tu agente de IA",
      "install.copy": "El agente lee la guía remota de instalación, copia tarot, iching, xiaoliuren y bazi en su directorio de skills y verifica los scripts.",
      "install.shellCopy": "O instala directamente en un directorio de skills local estilo Claude:",
      "install.target": "Destino por defecto: ~/.claude/skills. Define AI_SKILLS_DIR para apuntar al directorio de skills de otro agente.",
      "safety.label": "Límites de seguridad",
      "safety.title": "Reflexión simbólica, no profecía determinista.",
      "safety.item1": "No uses las interpretaciones como consejo médico, legal, financiero o de crisis.",
      "safety.item2": "Ancla cada interpretación principal al resultado concreto generado por el script.",
      "safety.item3": "Preserva la autonomía del usuario y sugiere pasos siguientes pequeños y reversibles.",
      "footer.ethics": "Ética"
    }
  };

  function detectLang() {
    var urlLang = new URLSearchParams(window.location.search).get("lang");
    if (urlLang && LANGS.indexOf(urlLang) !== -1) return urlLang;
    var stored = null;
    try { stored = localStorage.getItem("ob-lang"); } catch (e) {}
    if (stored && LANGS.indexOf(stored) !== -1) return stored;
    var prefs = (navigator.languages && navigator.languages.length)
      ? navigator.languages
      : [navigator.language || "en"];
    for (var p = 0; p < prefs.length; p++) {
      var pref = String(prefs[p] || "").toLowerCase();
      if (!pref) continue;
      for (var i = 0; i < LANGS.length; i++) {
        if (pref.indexOf(LANGS[i]) === 0) return LANGS[i];
      }
    }
    return "en";
  }

  function apply(lang) {
    var dict = translations[lang];
    if (!dict) return;
    document.documentElement.lang = lang === "zh" ? "zh-CN" : lang;
    document.title = dict["meta.title"];
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", dict["meta.description"]);
    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute("data-i18n");
      if (dict[key] !== undefined) nodes[i].textContent = dict[key];
    }
    var pills = document.querySelectorAll(".lang-switcher a");
    for (var j = 0; j < pills.length; j++) {
      pills[j].setAttribute("aria-pressed", pills[j].getAttribute("data-lang") === lang ? "true" : "false");
    }
    try { localStorage.setItem("ob-lang", lang); } catch (e) {}
  }

  var current = detectLang();
  apply(current);

  var links = document.querySelectorAll(".lang-switcher a");
  for (var k = 0; k < links.length; k++) {
    links[k].addEventListener("click", function (ev) {
      ev.preventDefault();
      var lang = this.getAttribute("data-lang");
      apply(lang);
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", "?lang=" + lang + window.location.hash);
      }
    });
  }
})();

/* ---- scroll reveal & parallax glow (skipped when reduced motion) ---- */
(function () {
  "use strict";
  var motionOK = true;
  try {
    motionOK = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) {}
  if (!motionOK) return;

  var targets = document.querySelectorAll(
    ".intro, #rigor, .skill-grid, .mcp-grid, .command-list, #install, #safety"
  );
  for (var i = 0; i < targets.length; i++) targets[i].classList.add("reveal-init");

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      for (var j = 0; j < entries.length; j++) {
        if (entries[j].isIntersecting) {
          entries[j].target.classList.add("reveal-in");
          io.unobserve(entries[j].target);
        }
      }
    }, { threshold: 0.12 });
    for (var k = 0; k < targets.length; k++) io.observe(targets[k]);
  } else {
    for (var m = 0; m < targets.length; m++) targets[m].classList.add("reveal-in");
  }

  if (window.matchMedia("(hover: hover)").matches) {
    var raf = null;
    window.addEventListener("mousemove", function (ev) {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = null;
        var dx = ev.clientX / window.innerWidth - 0.5;
        var dy = ev.clientY / window.innerHeight - 0.5;
        document.body.style.setProperty("--gx", dx.toFixed(3));
        document.body.style.setProperty("--gy", dy.toFixed(3));
      });
    });
  }
})();
