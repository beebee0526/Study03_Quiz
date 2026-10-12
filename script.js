// ---- 순수 로직 ----

function shuffle(array, rng = Math.random) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function prepareRound(questions, rng) {
  return shuffle(questions, rng).map(q => {
    const correctText = q.choices[q.answer];
    const choices = shuffle(q.choices, rng);
    return Object.assign({}, q, { choices: choices, answer: choices.indexOf(correctText) });
  });
}

function createGame({ mode, category, questions, rng, isRetry = false, limit }) {
  const round = prepareRound(questions, rng);
  return {
    mode: mode,
    category: category,
    questions: limit === undefined ? round : round.slice(0, limit),
    index: 0,
    results: [],
    answered: false,
    hintUsed: false,
    removed: [],
    isRetry: isRetry
  };
}

function currentQuestion(state) {
  return state.questions[state.index];
}

function scoreFor(correct, hintUsed) {
  if (!correct) return 0;
  return hintUsed ? 0.5 : 1;
}

function answerQuestion(state, choiceIndex) {
  const q = currentQuestion(state);
  if (!q || state.answered) return null;
  if (choiceIndex !== null && state.removed.includes(choiceIndex)) return null;
  const correct = choiceIndex !== null && choiceIndex === q.answer;
  const result = {
    question: q,
    chosen: choiceIndex,
    correct: correct,
    points: scoreFor(correct, state.hintUsed),
    hintUsed: state.hintUsed,
    timedOut: choiceIndex === null
  };
  state.results.push(result);
  state.answered = true;
  return result;
}

function useHint(state, rng = Math.random) {
  const q = currentQuestion(state);
  if (state.mode !== "hint" || !q || state.hintUsed || state.answered) return [];
  const wrongIndexes = [0, 1, 2, 3].filter(i => i !== q.answer);
  const removed = shuffle(wrongIndexes, rng).slice(0, 2);
  state.removed = removed;
  state.hintUsed = true;
  return removed;
}

function nextQuestion(state) {
  state.index++;
  state.answered = false;
  state.hintUsed = false;
  state.removed = [];
  return state.index < state.questions.length;
}

function isFinished(state) {
  return state.index >= state.questions.length;
}

function totalScore(state) {
  return state.results.reduce((sum, r) => sum + r.points, 0);
}

function wrongResults(state) {
  return state.results.filter(r => !r.correct);
}

function createRetryGame(state, rng) {
  return createGame({
    mode: "practice",
    category: state.category,
    questions: wrongResults(state).map(r => r.question),
    rng: rng,
    isRetry: true
  });
}

function formatScore(score, max) {
  return score + " / " + max;
}

const SPEED_SECONDS = 15;

function createTimer({ seconds, now, onTick, onExpire }) {
  let deadline = 0;
  let running = false;
  let handle = null;

  function remaining() {
    return Math.max(0, Math.ceil((deadline - now()) / 1000));
  }

  function stop() {
    running = false;
    if (handle !== null) {
      clearInterval(handle);
      handle = null;
    }
  }

  function check() {
    if (!running) return;
    const left = remaining();
    onTick(left);
    if (left === 0) {
      stop();
      onExpire();
    }
  }

  function start() {
    stop();
    deadline = now() + seconds * 1000;
    running = true;
    handle = setInterval(check, 250);
  }

  return { start: start, stop: stop, remaining: remaining, check: check };
}

// ---- 순위표 저장 ----

const BOARD_KEY = "quiz.leaderboard.v1";
const BOARD_SIZE = 10;

function getStorage() {
  try {
    const storage = window.localStorage;
    const probe = "__quiz_probe__";
    storage.setItem(probe, "1");
    storage.removeItem(probe);
    return storage;
  } catch (e) {
    return null;
  }
}

function isEntry(value) {
  return value !== null && typeof value === "object" && typeof value.score === "number";
}

function readBoardAll(storage) {
  if (!storage) return {};
  try {
    const raw = storage.getItem(BOARD_KEY);
    if (raw === null) return {};
    const data = JSON.parse(raw);
    return data !== null && typeof data === "object" && !Array.isArray(data) ? data : {};
  } catch (e) {
    return {};
  }
}

function boardKey(category, mode) {
  return category + "|" + mode;
}

function boardOf(all, category, mode) {
  const list = all[boardKey(category, mode)];
  return Array.isArray(list) ? list.filter(isEntry) : [];
}

function getBoard(storage, category, mode) {
  return boardOf(readBoardAll(storage), category, mode);
}

function qualifies(entries, score) {
  return entries.length < BOARD_SIZE || score > entries[BOARD_SIZE - 1].score;
}

function insertEntry(entries, entry) {
  const list = entries.slice();
  let at = list.findIndex(e => e.score < entry.score);
  if (at === -1) at = list.length;
  list.splice(at, 0, entry);
  return list.slice(0, BOARD_SIZE);
}

function saveEntry(storage, category, mode, entry) {
  if (!storage) return { saved: false, reason: "unavailable" };
  const all = readBoardAll(storage);
  const current = boardOf(all, category, mode);
  if (!qualifies(current, entry.score)) return { saved: false, reason: "not-qualified" };
  const next = insertEntry(current, entry);
  all[boardKey(category, mode)] = next;
  try {
    storage.setItem(BOARD_KEY, JSON.stringify(all));
  } catch (e) {
    return { saved: false, reason: "unavailable" };
  }
  return { saved: true, rank: next.indexOf(entry) + 1 };
}

function normalizeName(raw) {
  const name = (raw === null || raw === undefined ? "" : String(raw)).trim();
  if (name === "") return "익명";
  return Array.from(name).slice(0, 10).join("");
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + d;
}

// ---- UI ----

const MODE_LABELS = { practice: "연습 모드", speed: "스피드 모드", hint: "힌트 모드" };
const MODE_DESCRIPTIONS = {
  practice: "시간 제한 없이 풀며 해설을 읽어요.",
  speed: "문제마다 " + SPEED_SECONDS + "초 안에 답해야 해요.",
  hint: "보기 2개를 지우는 힌트를 쓸 수 있어요. 힌트를 쓰고 맞히면 0.5점이에요."
};
const ROUND_SIZE = 10;
const UNAVAILABLE_MSG = "이 브라우저에서는 기록을 저장할 수 없어요";

function el(tag, props, text) {
  const node = document.createElement(tag);
  if (props) {
    for (const key of Object.keys(props)) {
      if (key === "className") node.className = props[key];
      else node.setAttribute(key, props[key]);
    }
  }
  if (text !== undefined) node.textContent = text;
  return node;
}

function sourceNode(source, id) {
  const wrap = el("span", null);
  wrap.appendChild(document.createTextNode("출처: "));
  if (source && source.url) {
    const a = el("a", { href: source.url, target: "_blank", rel: "noopener" }, source.name);
    if (id) a.id = id;
    wrap.appendChild(a);
  } else {
    wrap.appendChild(document.createTextNode(source ? source.name : ""));
  }
  return wrap;
}

function appendPracticeNotice(card, mode) {
  if (mode === "practice") card.appendChild(el("p", { className: "no-record" }, "연습 모드는 순위표에 기록되지 않음"));
}

function startApp(root, options) {
  const opts = options || {};
  const questions = opts.questions || [];
  const rng = opts.rng || Math.random;
  const confirmFn = opts.confirm || window.confirm.bind(window);

  const now = opts.now || Date.now;
  // 저장소는 시작할 때 한 번만 정한다. 테스트가 storage: null을 일부러 넘기므로 키 존재 여부로 판단한다.
  const storage = "storage" in opts ? opts.storage : getStorage();

  let boardCategory = CATEGORIES[0];
  let boardMode = "speed";
  let screen = "start";
  let state = null;
  let message = "";
  let selectedMode = null;
  let selectedCategory = null;
  let timer = null;
  // 답한 뒤에도 멈춘 시각의 남은 초를 보여 주기 위해 마지막 값을 기억한다.
  let lastLeft = SPEED_SECONDS;

  function stopTimer() {
    if (timer) {
      timer.stop();
      timer = null;
    }
  }

  function startTimer() {
    stopTimer();
    timer = createTimer({
      seconds: SPEED_SECONDS,
      now: now,
      onTick: updateTimerText,
      onExpire: onTimeout
    });
    lastLeft = SPEED_SECONDS;
    timer.start();
  }

  function updateTimerText(left) {
    lastLeft = left;
    const node = root.querySelector("#timer");
    if (node) {
      node.textContent = String(left);
      node.classList.toggle("low", left <= 5);
    }
  }

  function onTimeout() {
    if (answerQuestion(state, null)) render();
  }

  function setScreen(name) {
    screen = name;
    render();
    window.scrollTo(0, 0);
  }

  function render() {
    root.innerHTML = "";
    if (screen === "start") renderStart();
    else if (screen === "mode") renderMode();
    else if (screen === "quiz") renderQuiz();
    else if (screen === "result") renderResult();
    else if (screen === "board") renderBoard();
  }

  function renderStart() {
    const card = el("div", { className: "card" });
    card.appendChild(el("h1", null, "4지선다 퀴즈"));
    card.appendChild(el("p", null, "카테고리를 골라 주세요."));
    const list = el("div", { className: "category-list" });
    CATEGORIES.forEach(name => {
      const b = el("button", { type: "button", "data-category": name }, name);
      b.addEventListener("click", () => chooseCategory(name));
      list.appendChild(b);
    });
    card.appendChild(list);
    if (message) card.appendChild(el("p", { className: "empty-msg" }, message));
    const boardBtn = el("button", { type: "button", id: "board-btn", className: "board-link" }, "순위표 보기");
    boardBtn.addEventListener("click", () => setScreen("board"));
    card.appendChild(boardBtn);
    root.appendChild(card);
  }

  function renderBoard() {
    const card = el("div", { className: "card" });
    card.appendChild(el("h1", null, "순위표"));

    const cats = el("div", { className: "board-tabs" });
    CATEGORIES.forEach(name => {
      const b = el("button", { type: "button", "data-board-category": name }, name);
      if (name === boardCategory) b.classList.add("active");
      b.addEventListener("click", () => { boardCategory = name; render(); });
      cats.appendChild(b);
    });
    card.appendChild(cats);

    const modes = el("div", { className: "board-tabs" });
    [["speed", "스피드"], ["hint", "힌트"]].forEach(([mode, label]) => {
      const b = el("button", { type: "button", "data-board-mode": mode }, label);
      if (mode === boardMode) b.classList.add("active");
      b.addEventListener("click", () => { boardMode = mode; render(); });
      modes.appendChild(b);
    });
    card.appendChild(modes);

    const entries = getBoard(storage, boardCategory, boardMode);
    if (!storage) {
      card.appendChild(el("p", { className: "empty-msg" }, UNAVAILABLE_MSG));
    } else if (entries.length === 0) {
      card.appendChild(el("p", { className: "empty-msg" }, "아직 기록이 없어요"));
    } else {
      const list = el("div", { className: "board-list" });
      entries.forEach((entry, i) => {
        const row = el("div", { className: "board-row" });
        row.appendChild(el("span", { className: "board-rank" }, (i + 1) + "위"));
        row.appendChild(el("span", { className: "board-name" }, String(entry.name)));
        row.appendChild(el("span", { className: "board-score" }, String(entry.score)));
        row.appendChild(el("span", { className: "board-date" }, String(entry.date)));
        list.appendChild(row);
      });
      card.appendChild(list);
    }

    const actions = el("div", { className: "actions" });
    const home = el("button", { type: "button", id: "home-btn" }, "처음으로");
    home.addEventListener("click", goHome);
    actions.appendChild(home);
    card.appendChild(actions);
    root.appendChild(card);
  }

  function chooseCategory(name) {
    if (!questions.some(q => q.category === name)) {
      message = "이 카테고리에는 아직 문제가 없어요.";
      setScreen("start");
      return;
    }
    selectedCategory = name;
    message = "";
    setScreen("mode");
  }

  function renderMode() {
    const card = el("div", { className: "card" });
    const h1 = el("h1", null, "4지선다 퀴즈");
    h1.appendChild(el("span", { className: "mode-badge" }, selectedCategory));
    card.appendChild(h1);
    card.appendChild(el("p", null, "모드를 골라 주세요."));
    ["practice", "speed", "hint"].forEach(mode => {
      const row = el("div", { className: "mode-row" });
      const b = el("button", { type: "button", "data-mode": mode }, MODE_LABELS[mode]);
      b.addEventListener("click", () => chooseMode(mode));
      row.appendChild(b);
      if (mode === "practice") row.appendChild(el("span", { className: "no-record" }, "순위표에 기록되지 않음"));
      row.appendChild(el("p", { className: "mode-desc" }, MODE_DESCRIPTIONS[mode]));
      card.appendChild(row);
    });
    const back = el("button", { type: "button", id: "back-btn" }, "뒤로");
    back.addEventListener("click", goHome);
    card.appendChild(back);
    root.appendChild(card);
  }

  function chooseMode(mode) {
    selectedMode = mode;
    startRound(selectedCategory);
  }

  function startRound(category) {
    const pool = questions.filter(q => q.category === category);
    state = createGame({ mode: selectedMode, category: category, questions: pool, rng: rng, limit: ROUND_SIZE });
    beginQuestion();
  }

  function startRetry() {
    state = createRetryGame(state, rng);
    beginQuestion();
  }

  function onHint() {
    if (useHint(state, rng).length > 0) render();
  }

  function beginQuestion() {
    if (state.mode === "speed") startTimer();
    else stopTimer();
    setScreen("quiz");
  }

  function renderQuiz() {
    const q = currentQuestion(state);
    const card = el("div", { className: "card" });

    const meta = el("div", { className: "quiz-meta" });
    meta.appendChild(el("span", { className: "quiz-category" }, state.category));
    meta.appendChild(el("span", { className: "mode-badge" }, MODE_LABELS[state.mode]));
    meta.appendChild(el("span", { id: "progress" }, (state.index + 1) + " / " + state.questions.length));
    const scoreWrap = el("span", null, "점수 ");
    scoreWrap.appendChild(el("span", { id: "current-score" }, String(totalScore(state))));
    meta.appendChild(scoreWrap);
    const quit = el("button", { type: "button", id: "quit-btn" }, "그만하기");
    quit.addEventListener("click", onQuit);
    meta.appendChild(quit);
    card.appendChild(meta);

    if (state.mode === "speed") {
      const left = state.answered || !timer ? lastLeft : timer.remaining();
      const timerBox = el("div", { className: "timer-box" });
      timerBox.appendChild(el("span", { className: "timer-label" }, "남은 시간"));
      const timerNode = el("span", { id: "timer" }, String(left));
      if (left <= 5) timerNode.classList.add("low");
      timerBox.appendChild(timerNode);
      timerBox.appendChild(el("span", { className: "timer-unit" }, "초"));
      card.appendChild(timerBox);
    }

    card.appendChild(el("p", { className: "quiz-question" }, q.question));

    const last = state.results[state.results.length - 1];
    const choices = el("div", { className: "choices" });
    q.choices.forEach((text, i) => {
      const b = el("button", { type: "button", "data-choice": String(i) }, text);
      if (state.removed.includes(i)) {
        b.classList.add("removed");
        b.disabled = true;
      }
      if (state.answered) {
        b.disabled = true;
        if (i === q.answer) b.classList.add("correct");
        else if (last && i === last.chosen) b.classList.add("wrong");
      } else if (!b.disabled) {
        b.addEventListener("click", () => onChoose(i));
      }
      choices.appendChild(b);
    });
    card.appendChild(choices);

    if (state.mode === "hint") {
      const hint = el("button", { type: "button", id: "hint-btn" }, "힌트 (보기 2개 지우기)");
      hint.disabled = state.hintUsed || state.answered;
      hint.addEventListener("click", onHint);
      card.appendChild(hint);
    }

    if (state.answered) {
      const fb = el("div", { id: "feedback" });
      const verdict = last.correct ? "정답!" : (last.timedOut ? "시간 초과" : "오답");
      fb.appendChild(el("p", { className: "verdict " + (last.correct ? "ok" : "ng") }, verdict));
      fb.appendChild(el("p", null, q.explanation));
      const src = el("p", { className: "source" });
      src.appendChild(sourceNode(q.source, "source-link"));
      fb.appendChild(src);
      card.appendChild(fb);

      const actions = el("div", { className: "actions" });
      const isLast = state.index === state.questions.length - 1;
      const next = el("button", { type: "button", id: "next-btn" }, isLast ? "결과 보기" : "다음 문제");
      next.addEventListener("click", onNext);
      actions.appendChild(next);
      card.appendChild(actions);
    }
    root.appendChild(card);
  }

  function onChoose(i) {
    if (timer) {
      timer.check();
      if (state.answered) return;
    }
    if (answerQuestion(state, i)) {
      stopTimer();
      render();
    }
  }

  function onNext() {
    if (nextQuestion(state)) beginQuestion();
    else {
      stopTimer();
      setScreen("result");
    }
  }

  function onQuit() {
    if (confirmFn("그만하고 처음으로 돌아갈까요? 이 판은 기록되지 않아요.")) goHome();
  }

  function goHome() {
    stopTimer();
    state = null;
    message = "";
    setScreen("start");
  }

  function appendRecordBox(card) {
    const box = el("div", { className: "record-box" });
    const msg = el("p", { id: "record-msg", className: "record-msg" });
    if (!storage) {
      msg.textContent = UNAVAILABLE_MSG;
      box.appendChild(msg);
      card.appendChild(box);
      return;
    }
    const input = el("input", {
      type: "text", id: "name-input", maxlength: "10", placeholder: "이름 (비우면 익명)", autocomplete: "off"
    });
    const btn = el("button", { type: "button", id: "record-btn" }, "순위표에 기록하기");
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      btn.disabled = true;
      input.disabled = true;
      const outcome = saveEntry(storage, state.category, state.mode, {
        name: normalizeName(input.value),
        score: totalScore(state),
        date: formatDate(new Date(now()))
      });
      if (outcome.saved) msg.textContent = outcome.rank + "위로 기록했어요";
      else if (outcome.reason === "not-qualified") msg.textContent = "상위 10위 안에 들지 못했어요";
      else msg.textContent = UNAVAILABLE_MSG;
    });
    box.appendChild(input);
    box.appendChild(btn);
    box.appendChild(msg);
    card.appendChild(box);
  }

  function renderResult() {
    const card = el("div", { className: "card" });
    card.appendChild(el("h1", null, state.category + " 결과"));
    card.appendChild(el("div", { id: "score-text" }, formatScore(totalScore(state), state.questions.length)));

    const wrongs = wrongResults(state);
    if (wrongs.length > 0) {
      card.appendChild(el("h2", null, "틀린 문제"));
      wrongs.forEach(r => {
        const item = el("div", { className: "wrong-item" });
        item.appendChild(el("p", { className: "q" }, r.question.question));
        const mine = r.chosen === null ? "시간 초과" : r.question.choices[r.chosen];
        item.appendChild(el("p", null, "내가 고른 답: " + mine));
        item.appendChild(el("p", null, "정답: " + r.question.choices[r.question.answer]));
        item.appendChild(el("p", null, r.question.explanation));
        const src = el("p", { className: "source" });
        src.appendChild(sourceNode(r.question.source));
        item.appendChild(src);
        card.appendChild(item);
      });
    }

    if (state.isRetry && wrongs.length === 0) {
      card.appendChild(el("p", { id: "all-clear" }, "틀린 문제를 모두 맞혔어요"));
    }

    if (state.mode !== "practice") appendRecordBox(card);

    const actions = el("div", { className: "actions" });
    if (state.mode === "practice" && wrongs.length > 0) {
      const retry = el("button", { type: "button", id: "retry-btn" }, "틀린 문제 다시 풀기");
      retry.addEventListener("click", startRetry);
      actions.appendChild(retry);
    }
    if (!state.isRetry) {
      const again = el("button", { type: "button", id: "again-btn" }, "같은 카테고리 다시 하기");
      again.addEventListener("click", () => startRound(state.category));
      actions.appendChild(again);
    }
    const home = el("button", { type: "button", id: "home-btn" }, "처음으로");
    home.addEventListener("click", goHome);
    actions.appendChild(home);
    card.appendChild(actions);
    appendPracticeNotice(card, state.mode);
    root.appendChild(card);
  }

  render();

  return {
    getState: () => state,
    getScreen: () => screen,
    checkTimer: () => { if (timer) timer.check(); }
  };
}

if (!window.__QUIZ_TEST__) startApp(document.getElementById("app"), { questions: QUESTIONS });
