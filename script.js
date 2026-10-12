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

function createGame({ mode, category, questions, rng, isRetry = false }) {
  return {
    mode: mode,
    category: category,
    questions: prepareRound(questions, rng),
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

// ---- UI ----

const MODE_LABELS = { practice: "연습 모드", speed: "스피드 모드", hint: "힌트 모드" };
const MODE_DESCRIPTIONS = {
  practice: "시간 제한 없이 풀며 해설을 읽어요.",
  speed: "문제마다 " + SPEED_SECONDS + "초 안에 답해야 해요.",
  hint: "보기 2개를 지우는 힌트를 쓸 수 있어요. 힌트를 쓰고 맞히면 0.5점이에요."
};
const ROUND_SIZE = 10;

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

function startApp(root, options) {
  const opts = options || {};
  const questions = opts.questions || [];
  const rng = opts.rng || Math.random;
  const confirmFn = opts.confirm || window.confirm.bind(window);

  const now = opts.now || Date.now;

  let screen = "start";
  let state = null;
  let message = "";
  let selectedMode = null;
  let timer = null;

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
    timer.start();
  }

  function updateTimerText(left) {
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
  }

  function render() {
    root.innerHTML = "";
    if (screen === "start") renderStart();
    else if (screen === "category") renderCategory();
    else if (screen === "quiz") renderQuiz();
    else if (screen === "result") renderResult();
  }

  function renderStart() {
    const card = el("div", { className: "card" });
    card.appendChild(el("h1", null, "4지선다 퀴즈"));
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
    root.appendChild(card);
  }

  function chooseMode(mode) {
    selectedMode = mode;
    message = "";
    setScreen("category");
  }

  function renderCategory() {
    const card = el("div", { className: "card" });
    const h1 = el("h1", null, "4지선다 퀴즈");
    h1.appendChild(el("span", { className: "mode-badge" }, MODE_LABELS[selectedMode]));
    card.appendChild(h1);
    card.appendChild(el("p", null, "카테고리를 골라 주세요."));
    const list = el("div", { className: "category-list" });
    CATEGORIES.forEach(name => {
      const b = el("button", { type: "button", "data-category": name }, name);
      b.addEventListener("click", () => startRound(name));
      list.appendChild(b);
    });
    card.appendChild(list);
    if (selectedMode === "practice") card.appendChild(el("p", { className: "no-record" }, "연습 모드는 순위표에 기록되지 않음"));
    if (message) card.appendChild(el("p", { className: "empty-msg" }, message));
    const back = el("button", { type: "button", id: "back-btn" }, "뒤로");
    back.addEventListener("click", goHome);
    card.appendChild(back);
    root.appendChild(card);
  }

  function startRound(category) {
    const pool = questions.filter(q => q.category === category);
    if (pool.length === 0) {
      message = "이 카테고리에는 아직 문제가 없어요.";
      state = null;
      setScreen("category");
      return;
    }
    message = "";
    state = createGame({ mode: selectedMode, category: category, questions: pool, rng: rng });
    state.questions = state.questions.slice(0, ROUND_SIZE);
    beginQuestion();
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
    if (state.mode === "speed") {
      const timerWrap = el("span", null, "남은 시간 ");
      const left = state.answered || !timer ? "" : String(timer.remaining());
      timerWrap.appendChild(el("span", { id: "timer" }, left));
      timerWrap.appendChild(document.createTextNode(left === "" ? "" : "초"));
      meta.appendChild(timerWrap);
    }
    const quit = el("button", { type: "button", id: "quit-btn" }, "그만하기");
    quit.addEventListener("click", onQuit);
    meta.appendChild(quit);
    card.appendChild(meta);

    card.appendChild(el("p", { className: "quiz-question" }, q.question));

    const last = state.results[state.results.length - 1];
    const choices = el("div", { className: "choices" });
    q.choices.forEach((text, i) => {
      const b = el("button", { type: "button", "data-choice": String(i) }, text);
      if (state.answered) {
        b.disabled = true;
        if (i === q.answer) b.classList.add("correct");
        else if (last && i === last.chosen) b.classList.add("wrong");
      } else {
        b.addEventListener("click", () => onChoose(i));
      }
      choices.appendChild(b);
    });
    card.appendChild(choices);

    if (state.answered) {
      const fb = el("div", { id: "feedback" });
      const verdict = last.correct ? "정답!" : (last.timedOut ? "시간 초과" : "오답");
      fb.appendChild(el("p", { className: "verdict " + (last.correct ? "ok" : "ng") }, verdict));
      fb.appendChild(el("p", null, q.explanation));
      const src = el("p", null);
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
        const src = el("p", null);
        src.appendChild(sourceNode(r.question.source));
        item.appendChild(src);
        card.appendChild(item);
      });
    }

    const actions = el("div", { className: "actions" });
    const again = el("button", { type: "button", id: "again-btn" }, "같은 카테고리 다시 하기");
    again.addEventListener("click", () => startRound(state.category));
    const home = el("button", { type: "button", id: "home-btn" }, "처음으로");
    home.addEventListener("click", goHome);
    actions.appendChild(again);
    actions.appendChild(home);
    card.appendChild(actions);
    if (state.mode === "practice") card.appendChild(el("p", { className: "no-record" }, "연습 모드는 순위표에 기록되지 않음"));
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
