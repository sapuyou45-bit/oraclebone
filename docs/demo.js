(function () {
  "use strict";

  var LANGS = ["zh", "en", "ja", "pt", "ko", "es"];

  var translations = {
    zh: {
      "meta.title": "OracleBone 在线试玩 — 浏览器里直接起卦",
      "demo.back": "← 返回主页",
      "demo.badge": "在线试玩 · 与 PyPI 包同源数据 · 纯浏览器计算",
      "demo.title": "先起一卦，看看「脚本出结果」是什么感觉。",
      "demo.copy": "下面所有占法都在你的浏览器本地运行，随机数来自系统熵池，结果以 JSON 输出——复制给任何 AI，让它只解读、不编造。",
      "tab.iching": "周易起卦", "tab.tarot": "塔罗抽牌", "tab.xlr": "小六壬",
      "iching.methodLabel": "起卦方法",
      "iching.coins": "三枚硬币法", "iching.yarrow": "蓍草等价概率",
      "iching.cast": "起卦",
      "tarot.reversals": "允许逆位", "tarot.cast": "抽三张牌（过去·现在·未来）",
      "xlr.numbersLabel": "三个数字（月·日·时 或 随意三数）", "xlr.cast": "起课",
      "common.hint": "把上面的 JSON 复制给你的 AI，让它基于这个结果解读——而不是让它自己编。",
      "common.hint2": "Fisher-Yates 洗牌 · 系统随机 · 结果可复现审计",
      "vs.label": "对比一下", "vs.title": "AI 瞎编 vs 脚本起卦",
      "vs.badTag": "常见做法",
      "vs.badCopy": "直接问 AI「帮我抽一张塔罗」——它会在几毫秒内“想”出一张牌，概率不受控、无法复现、每次答案都可能是编的。",
      "vs.goodTag": "OracleBone 的做法",
      "vs.goodCopy": "系统熵池出随机数 → 传统概率模型定卦象 → JSON 带完整方法元数据 → AI 只负责解读既定结果。每一步都可审计。",
      "footer.home": "项目主页"
    },
    en: {
      "meta.title": "OracleBone Playground — cast right in your browser",
      "demo.back": "← Back to homepage",
      "demo.badge": "Live playground · Same data as the PyPI package · Runs fully in-browser",
      "demo.title": "Cast once, and see what “the script decides” feels like.",
      "demo.copy": "Every method below runs locally in your browser using system entropy and outputs JSON — hand it to any AI so it interprets instead of inventing.",
      "tab.iching": "I Ching", "tab.tarot": "Tarot", "tab.xlr": "Xiao Liuren",
      "iching.methodLabel": "Casting method",
      "iching.coins": "Three-coin method", "iching.yarrow": "Yarrow-stalk probabilities",
      "iching.cast": "Cast",
      "tarot.reversals": "Allow reversals", "tarot.cast": "Draw three cards (past · present · future)",
      "xlr.numbersLabel": "Three numbers (month · day · hour, or any three)", "xlr.cast": "Cast",
      "common.hint": "Copy the JSON above to your AI and let it interpret the given result — not make one up.",
      "common.hint2": "Fisher-Yates shuffle · System randomness · Auditable results",
      "vs.label": "Compare", "vs.title": "AI improvising vs script casting",
      "vs.badTag": "The usual way",
      "vs.badCopy": "Ask an AI “draw me a tarot card” and it will think one up in milliseconds: uncontrolled odds, no reproducibility, possibly invented every time.",
      "vs.goodTag": "The OracleBone way",
      "vs.goodCopy": "System entropy rolls the randomness → traditional probability models fix the result → JSON carries full method metadata → the AI only interprets what it is given. Every step auditable.",
      "footer.home": "Homepage"
    },
    ja: {
      "meta.title": "OracleBone お試し — ブラウザで直接占う",
      "demo.back": "← ホームへ戻る",
      "demo.badge": "お試し実装 · PyPI 版と同一データ · 完全ブラウザ計算",
      "demo.title": "まず一卦立てて、「スクリプトが決める」感覚を体験。",
      "demo.copy": "以下の占法はすべてブラウザ内で動作し、乱数はシステムエントロピーから。結果は JSON 出力——任意の AI に渡して、捏造ではなく解釈させましょう。",
      "tab.iching": "周易", "tab.tarot": "タロット", "tab.xlr": "小六壬",
      "iching.methodLabel": "起卦法",
      "iching.coins": "三枚コイン法", "iching.yarrow": "蓍草法等価確率",
      "iching.cast": "起卦する",
      "tarot.reversals": "逆位置を許可", "tarot.cast": "3 枚引く（過去・現在・未来）",
      "xlr.numbersLabel": "3 つの数字（月・日・時 または任意）", "xlr.cast": "起課する",
      "common.hint": "上の JSON を AI に渡せば、AI は自分で作らず与えられた結果を解釈します。",
      "common.hint2": "Fisher-Yates シャッフル · システム乱数 · 監査可能な結果",
      "vs.label": "比較", "vs.title": "AI のでっち上げ vs スクリプト起卦",
      "vs.badTag": "よくあるやり方",
      "vs.badCopy": "AI に「タロットを 1 枚引いて」と頼むと、数ミリ秒で一枚“考え出します”。確率は制御できず、再現性もなく、毎回嘘かもしれません。",
      "vs.goodTag": "OracleBone のやり方",
      "vs.goodCopy": "システムエントロピーが乱数を生成 → 伝統的確率モデルが卦を確定 → JSON が手法メタデータを保持 → AI は与えられた結果だけを解釈。全工程が監査可能です。",
      "footer.home": "ホームページ"
    },
    pt: {
      "meta.title": "OracleBone Playground — lance direto no navegador",
      "demo.back": "← Voltar à página inicial",
      "demo.badge": "Playground ao vivo · Mesmos dados do pacote PyPI · Roda no navegador",
      "demo.title": "Faça um lançamento e sinta o que é “o script decidir”.",
      "demo.copy": "Todos os métodos abaixo rodam localmente no seu navegador com entropia do sistema e saem em JSON — entregue a qualquer IA para interpretar, não inventar.",
      "tab.iching": "I Ching", "tab.tarot": "Tarô", "tab.xlr": "Xiao Liuren",
      "iching.methodLabel": "Método de extração",
      "iching.coins": "Método das três moedas", "iching.yarrow": "Probabilidades de mile-folhas",
      "iching.cast": "Lançar",
      "tarot.reversals": "Permitir reversões", "tarot.cast": "Tire três cartas (passado · presente · futuro)",
      "xlr.numbersLabel": "Três números (mês · dia · hora, ou quaisquer)", "xlr.cast": "Lançar",
      "common.hint": "Copie o JSON acima para sua IA e deixe-a interpretar o resultado dado — não inventar um.",
      "common.hint2": "Embaralhamento Fisher-Yates · Aleatoriedade do sistema · Resultados auditáveis",
      "vs.label": "Compare", "vs.title": "IA improvisando vs script lançando",
      "vs.badTag": "O jeito comum",
      "vs.badCopy": "Peça a uma IA “tire uma carta de tarô” e ela pensará uma em milissegundos: chances fora de controle, sem reprodutibilidade, possivelmente inventada toda vez.",
      "vs.goodTag": "O jeito OracleBone",
      "vs.goodCopy": "A entropia do sistema gera o aleatório → modelos probabilísticos tradicionais fixam o resultado → o JSON carrega metadados do método → a IA só interpreta o que recebe. Cada etapa auditável.",
      "footer.home": "Página inicial"
    },
    ko: {
      "meta.title": "OracleBone 체험 — 브라우저에서 바로 점 치기",
      "demo.back": "← 홈으로 돌아가기",
      "demo.badge": "체험판 · PyPI 패키지와 동일 데이터 · 전부 브라우저 계산",
      "demo.title": "먼저 한 ꘘ认 뽑고, '스크립트가 결정한다'는 감각을 느껴 보세요.",
      "demo.copy": "아래 모든 점법은 브라우저에서 로컬로 실행되며, 난수는 시스템 엔트로피에서 나오고 결과는 JSON 출력 — 어떤 AI든 주면 해석만 하게 됩니다.",
      "tab.iching": "주역", "tab.tarot": "타로", "tab.xlr": "소육임",
      "iching.methodLabel": "기점 방식",
      "iching.coins": "동전 세 개 방식", "iching.yarrow": "효죽 등가 확률",
      "iching.cast": "점 치기",
      "tarot.reversals": "역방향 허용", "tarot.cast": "세 장 뽑기 (과거·현재·미래)",
      "xlr.numbersLabel": "세 숫자 (월·일·시 또는 아무 수)", "xlr.cast": "기점하기",
      "common.hint": "위 JSON을 AI에게 주면, AI는 스스로 만들지 않고 주어진 결과를 해석합니다.",
      "common.hint2": "Fisher-Yates 셔플 · 시스템 난수 · 감사 가능한 결과",
      "vs.label": "비교", "vs.title": "AI 지어내기 vs 스크립트 기점",
      "vs.badTag": "흔한 방식",
      "vs.badCopy": "AI에게 \"타로 한 장 뽑아줘\"라고 하면 몇 밀리초 만에 한 장을 \"생각해 냅니다\". 확률 통제 불가, 재현 불가, 매번 거짓일 수 있습니다.",
      "vs.goodTag": "OracleBone 방식",
      "vs.goodCopy": "시스템 엔트로피가 난수 생성 → 전통적 확률 모델이 괘 확정 → JSON이 기법 메타데이터 유지 → AI는 주어진 결과만 해석. 모든 단계가 감사 가능합니다.",
      "footer.home": "홈페이지"
    },
    es: {
      "meta.title": "OracleBone Playground — lanza directo en tu navegador",
      "demo.back": "← Volver al inicio",
      "demo.badge": "Playground en vivo · Mismos datos del paquete PyPI · Corre en el navegador",
      "demo.title": "Haz un lanzamiento y siente lo que es «el script decide».",
      "demo.copy": "Todos los métodos corren localmente en tu navegador con entropía del sistema y salen en JSON — dáselo a cualquier IA para que interprete, no invente.",
      "tab.iching": "I Ching", "tab.tarot": "Tarot", "tab.xlr": "Xiao Liuren",
      "iching.methodLabel": "Método de lanzamiento",
      "iching.coins": "Método de tres monedas", "iching.yarrow": "Probabilidades de mil hojas",
      "iching.cast": "Lanzar",
      "tarot.reversals": "Permitir inversiones", "tarot.cast": "Saca tres cartas (pasado · presente · futuro)",
      "xlr.numbersLabel": "Tres números (mes · día · hora, o cualesquiera)", "xlr.cast": "Lanzar",
      "common.hint": "Copia el JSON anterior a tu IA y deja que interprete el resultado dado — no uno inventado.",
      "common.hint2": "Barajado Fisher-Yates · Aleatoriedad del sistema · Resultados auditables",
      "vs.label": "Compara", "vs.title": "IA improvisando vs script lanzando",
      "vs.badTag": "La forma habitual",
      "vs.badCopy": "Pídele a una IA «saca una carta de tarot» y la pensará en milisegundos: probabilidades incontroladas, sin reproducibilidad, posiblemente inventada cada vez.",
      "vs.goodTag": "La forma OracleBone",
      "vs.goodCopy": "La entropía del sistema genera el azar → modelos probabilísticos tradicionales fijan el resultado → el JSON lleva metadatos del método → la IA solo interpreta lo recibido. Cada paso auditable.",
      "footer.home": "Página principal"
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

  var LANG = detectLang();
  apply(LANG);

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

  /* ---------- tabs ---------- */
  var tabs = document.querySelectorAll(".tab");
  for (var t = 0; t < tabs.length; t++) {
    tabs[t].addEventListener("click", function () {
      for (var x = 0; x < tabs.length; x++) {
        tabs[x].setAttribute("aria-selected", "false");
        document.getElementById(tabs[x].getAttribute("data-panel")).classList.remove("active");
      }
      this.setAttribute("aria-selected", "true");
      document.getElementById(this.getAttribute("data-panel")).classList.add("active");
    });
  }

  /* ---------- shared helpers ---------- */
  function rand() {
    var buf = new Uint32Array(1);
    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(buf);
      return buf[0] / 4294967296;
    }
    return Math.random();
  }

  function $(id) { return document.getElementById(id); }

  var T = translations[LANG] || translations.en;

  /* ---------- I Ching ---------- */
  var HX_ZH = ["乾","坤","屯","蒙","需","訟","師","比","小畜","履","泰","否","同人","大有","謙","豫","隨","蠱","臨","觀","噬嗑","賁","剝","復","无妄","大畜","頤","大過","坎","離","咸","恒","遯","大壯","晉","明夷","家人","睽","蹇","解","損","益","夬","姤","萃","升","困","井","革","鼎","震","艮","漸","歸妹","豐","旅","巽","兌","渙","節","中孚","小過","既濟","未濟"];
  var TRIGRAM_BITS = { Heaven:"111", Lake:"110", Fire:"101", Thunder:"100", Wind:"011", Water:"010", Mountain:"001", Earth:"000" };
  var HEX_DATA = null;

  fetch("https://raw.githubusercontent.com/sapuyou45-bit/oraclebone/main/oraclebone/data/hexagrams.json")
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var byBits = {};
      for (var i = 0; i < d.hexagrams.length; i++) {
        var h = d.hexagrams[i];
        byBits[TRIGRAM_BITS[h.lower] + TRIGRAM_BITS[h.upper]] = h;
      }
      HEX_DATA = { byBits: byBits, texts: d.texts };
    })
    .catch(function () { HEX_DATA = null; });

  function coinLine() {
    var sum = 0;
    for (var i = 0; i < 3; i++) sum += rand() < 0.5 ? 2 : 3;
    return sum;
  }
  function yarrowLine() {
    var r = rand();
    if (r < 1 / 16) return 6;
    if (r < 1 / 16 + 5 / 16) return 7;
    if (r < 1 / 16 + 5 / 16 + 7 / 16) return 8;
    return 9;
  }
  function hxSymbol(n) { return String.fromCodePoint(0x4DC0 + n - 1); }
  function hxName(h) {
    return h.number + " · " + (HX_ZH[h.number - 1] || "") + " " + h.name;
  }

  $("ic-cast").addEventListener("click", function () {
    if (!HEX_DATA) {
      $("ic-out").hidden = false;
      $("ic-pre").textContent = "// " + (T["common.hint"] ? "" : "") + "loading hexagram data failed — check network and retry";
      return;
    }
    var method = $("ic-method").value;
    var vals = [], bits = "", changing = [];
    for (var i = 0; i < 6; i++) {
      var v = method === "coins" ? coinLine() : yarrowLine();
      vals.push(v);
      bits += (v === 7 || v === 9) ? "1" : "0";
      if (v === 6 || v === 9) changing.push(i);
    }
    var h = HEX_DATA.byBits[bits];
    var txt = HEX_DATA.texts[bits] || {};
    var tBits = bits;
    for (var c = 0; c < changing.length; c++) {
      var pos = changing[c];
      tBits = tBits.slice(0, pos) + (tBits[pos] === "1" ? "0" : "1") + tBits.slice(pos + 1);
    }
    var th = HEX_DATA.byBits[tBits], ttxt = HEX_DATA.texts[tBits] || {};
    var out = {
      tool: "iching_cast",
      method: method,
      lines: vals,
      hexagram: { symbol: hxSymbol(h.number), king_wen: h.number, name_zh: HX_ZH[h.number - 1], name: h.name },
      judgment: txt.judgment || "",
      changing_lines: changing.map(function (p) {
        return { position: p + 1, label: (txt.line_labels || [])[p] || "", text: (txt.lines || [])[p] || "" };
      }),
      transformed: changing.length ? { symbol: hxSymbol(th.number), king_wen: th.number, name_zh: HX_ZH[th.number - 1], name: th.name, judgment: ttxt.judgment || "" } : null,
      randomness: "browser system entropy (crypto.getRandomValues)",
      note: "Demo runs the same probability models as oraclebone-mcp; interpretation is left to your AI."
    };
    $("ic-out").hidden = false;
    $("ic-pre").innerHTML =
      '<span class="hx-display">' + hxSymbol(h.number) + "</span>" +
      "<strong>" + hxName(h) + "</strong>" + "\n" +
      escapeHtml(JSON.stringify(out, null, 2));
  });

  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  }

  /* ---------- Tarot ---------- */
  var ARCANA = [
    ["愚者", "The Fool"], ["魔術師", "The Magician"], ["女祭司", "The High Priestess"],
    ["女帝", "The Empress"], ["皇帝", "The Emperor"], ["教皇", "The Hierophant"],
    ["戀人", "The Lovers"], ["戰車", "The Chariot"], ["力量", "Strength"],
    ["隱者", "The Hermit"], ["命運之輪", "Wheel of Fortune"], ["正義", "Justice"],
    ["吊人", "The Hanged Man"], ["死神", "Death"], ["節制", "Temperance"],
    ["惡魔", "The Devil"], ["高塔", "The Tower"], ["星星", "The Star"],
    ["月亮", "The Moon"], ["太陽", "The Sun"], ["審判", "Judgement"], ["世界", "The World"]
  ];
  var POS_LABELS = { zh: ["过去", "现在", "未来"], en: ["past", "present", "future"], ja: ["過去", "現在", "未来"], pt: ["passado", "presente", "futuro"], ko: ["과거", "현재", "미래"], es: ["pasado", "presente", "futuro"] };

  $("tt-cast").addEventListener("click", function () {
    var deck = [];
    for (var i = 0; i < 22; i++) deck.push(i);
    for (var s = 21; s > 0; s--) {
      var buf = new Uint32Array(1);
      window.crypto.getRandomValues(buf);
      var jj = buf[0] % (s + 1);
      var tmp = deck[s]; deck[s] = deck[jj]; deck[jj] = tmp;
    }
    var allowReverse = $("tt-reverse").checked;
    var drawn = deck.slice(0, 3).map(function (cardIdx, idx) {
      return {
        position: POS_LABELS[LANG] ? POS_LABELS[LANG][idx] : POS_LABELS.en[idx],
        card: ARCANA[cardIdx][1],
        name_zh: ARCANA[cardIdx][0],
        reversed: allowReverse ? rand() < 0.5 : false
      };
    });
    var out = { tool: "tarot_draw", deck: "major", spread: "three-card", cards: drawn, shuffle: "Fisher-Yates (crypto.getRandomValues)" };
    $("tt-out").hidden = false;
    $("tt-pre").innerHTML =
      '<span class="hx-display">' + drawn.map(function (c) { return c.name_zh.split("").length > 2 ? "🂠" : "🂠"; }).join("") + "</span>" +
      "<strong>" + drawn.map(function (c) { return (c.reversed ? "逆 " : "") + c.card; }).join(" / ") + "</strong>\n" +
      escapeHtml(JSON.stringify(out, null, 2));
  });

  /* ---------- Xiao Liu Ren ---------- */
  var PALACES = {
    zh: [["大安","诸事皆宜，安稳吉庆"],["留连","暗昧不明，事情拖延"],["速喜","喜讯将至，行动要快"],["赤口","口舌是非，谨慎言语"],["小吉","小有好运，贵人相助"],["空亡","落空难成，宜守不宜进"]],
    en: [["Da'an","All is well; stable and auspicious"],["Liulian","Murky and slow; things drag on"],["Suxi","Good news nears; act quickly"],["Chikou","Disputes ahead; watch your words"],["Xiaoji","Small luck; helpful people appear"],["Kongwang","Empty and unfulfilled; hold, don't advance"]],
    ja: [["大安","万事が穏やかで吉"],["留連","暗くて進まない"],["速喜","吉報が近い、素早く動く"],["赤口","口論に注意"],["小吉","小さな幸運、助け人が現れる"],["空亡","成就しにくい、守るが得"]],
    pt: null, ko: null, es: null
  };
  PALACES.pt = [["Da'an","Tudo favorável; estável e auspicioso"],["Liulian","Turvo e lento; as coisas se arrastam"],["Suxi","Boas notícias próximas; aja rápido"],["Chikou","Discussões à frente; cuide as palavras"],["Xiaoji","Pequena sorte; pessoas úteis aparecem"],["Kongwang","Vazio e não realizado; espere, não avance"]];
  PALACES.ko = [["대안","모든 일 순조롭고 길함"],["류련","어둡고 더디다; 일이 늘어짐"],["속희","기쁜 소식이 가깝다; 서두르라"],["적구","구설 조심; 말을 삼가라"],["소길","작은 행운; 귀인이 나타남"],["공망","이루기 어렵다; 지키는 것이 낫다"]];
  PALACES.es = [["Da'an","Todo favorable; estable y auspicioso"],["Liulian","Turbio y lento; las cosas se arrastran"],["Suxi","Buenas noticias cerca; actúa rápido"],["Chikou","Disputas ahead; cuida tus palabras"],["Xiaoji","Pequeña suerte; aparecen personas útiles"],["Kongwang","Vacío y sin cumplir; espera, no avances"]];

  $("xlr-cast").addEventListener("click", function () {
    var nums = [$("xlr-n1").value.trim(), $("xlr-n2").value.trim(), $("xlr-n3").value.trim()];
    var parsed = [];
    for (var i = 0; i < 3; i++) {
      var v = parseInt(nums[i], 10);
      if (isNaN(v) || v <= 0) {
        $("xlr-out").hidden = false;
        $("xlr-pre").textContent = JSON.stringify({ error: "missing_or_invalid_parameter", parameter: "number #" + (i + 1), hint: "provide three positive integers" }, null, 2);
        return;
      }
      parsed.push(v);
    }
    var pos = 0;
    var steps = [];
    for (var s = 0; s < 3; s++) {
      pos = (pos + parsed[s] - 1) % 6;
      steps.push({ input: parsed[s], palace: PALACES[LANG] ? PALACES[LANG][pos][0] : PALACES.en[pos][0] });
    }
    var pal = (PALACES[LANG] || PALACES.en)[pos];
    var out = {
      tool: "xiaoliuren_cast",
      method: "numbers",
      inputs: { first: parsed[0], second: parsed[1], third: parsed[2] },
      steps: steps,
      result: { palace: pal[0], meaning: pal[1] },
      randomness: "deterministic counting on user-provided numbers"
    };
    $("xlr-out").hidden = false;
    $("xlr-pre").innerHTML = '<span class="hx-display">' + pal[0] + "</span><strong>" + pal[1] + "</strong>\n" + escapeHtml(JSON.stringify(out, null, 2));
  });
})();
