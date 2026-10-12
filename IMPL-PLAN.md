# 상식 퀴즈 웹 앱 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 브라우저에서 `index.html`을 열면 동작하는 4지선다 상식 퀴즈(4개 카테고리 × 10문제, 연습·스피드·힌트 모드, localStorage 순위표)를 만든다.

**Architecture:** 앱은 4개 파일로만 구성한다. `questions.js`는 전역 `QUESTIONS`/`CATEGORIES`를 정의하는 데이터이고, `script.js`는 앞부분에 DOM과 무관한 순수 로직(라운드 준비, 채점, 힌트, 타이머, 순위표)을, 뒷부분에 `startApp(root, options)`이 `#app` 안에 화면을 그리는 UI 컨트롤러를 둔다. 시계·난수·저장소·확인창은 `options`로 주입해서 테스트에서 바꿔 끼운다.

**Tech Stack:** 순수 HTML/CSS/JavaScript(ES2017, 일반 `<script>`), 테스트는 직접 만든 작은 브라우저 테스트 러너 + Edge headless(`--dump-dom`), 버전 관리는 git.

**Spec:** `PRD.md` (프로젝트 루트). 문항 작성 규칙은 `CLAUDE.md`

## Global Constraints

- 앱 파일은 `index.html`, `style.css`, `script.js`, `questions.js` 4개뿐. `docs/`는 문서이며 앱 동작에 필요 없다.
- 테스트 코드는 프로젝트 **밖** 옆 폴더 `Study03_Quiz_tests`(경로: `C:\Users\USER\OneDrive\바탕 화면\Study03_Quiz_tests\`, 프로젝트 기준 `../Study03_Quiz_tests/`)에 둔다. 프로젝트 폴더 안에는 테스트 파일을 만들지 않는다.
- git 저장소는 프로젝트 폴더(`Study03_Quiz`)에만 만들고, Task마다 프로젝트 파일만 커밋한다. 테스트 폴더는 커밋 대상이 아니다.
- 모든 명령은 프로젝트 폴더(`Study03_Quiz`)를 현재 위치로 하고 실행한다.
- `index.html`을 더블클릭(`file://`)해서 열면 동작해야 함. `<script type="module">`, `fetch`, 외부 라이브러리/CDN, 빌드 도구, 패키지 설치 금지.
- `index.html`은 `questions.js` → `script.js` 순서로 일반 `<script>` 태그로 불러온다.
- 화면 문구는 모두 한국어. 고정 문구(그대로 사용): `순위표에 기록되지 않음`, `정답!`, `오답`, `시간 초과`, `틀린 문제를 모두 맞혔어요`, `이 브라우저에서는 기록을 저장할 수 없어요`, `상위 10위 안에 들지 못했어요`, `익명`.
- 모드 식별자: `"practice"`(연습), `"speed"`(스피드), `"hint"`(힌트). 카테고리: `"한국사"`, `"세계지리"`, `"과학"`, `"예술과 문화"`.
- 점수: 맞힘 1점, 힌트 쓰고 맞힘 0.5점, 틀림/시간 초과 0점. 표시 형식 `"7.5 / 10"`, 정수면 `"8 / 10"`.
- 스피드 제한 시간 15초. 순위표 키 `"quiz.leaderboard.v1"`, 순위표당 상위 10개.
- 사용자·문항 문자열은 항상 `textContent`로 넣는다(`innerHTML`에 데이터 금지).
- 대상: 최신 Chrome/Edge, 가로 360px 이상 화면에서 가로 스크롤 없음.
- 소리·애니메이션·순위표 초기화 기능은 넣지 않는다.

## Review Focus

1. **보기를 빠르게 두 번 누름** → 첫 클릭만 채점되고 두 번째는 무시된다. (Task 1 `answerQuestion` 이중 호출 테스트)
2. **스피드에서 시간 만료와 클릭이 겹침** → 결과는 하나만 기록된다. 만료 후 클릭은 무시, 답한 뒤 만료 처리도 무시. (Task 7 테스트)
3. **스피드 도중 다른 탭에 갔다 옴** → 남은 시간은 시각 차이로 계산되어, 15초가 넘게 지났으면 돌아오자마자 시간 초과가 된다. (Task 7 `createTimer` 테스트)
4. **localStorage가 없거나 저장된 JSON이 깨짐** → 앱이 멈추지 않고 순위표를 빈 것으로 본다. 저장 실패는 안내 문구로 알린다. (Task 9 테스트)
5. **이름에 `<b>` 같은 문자가 들어감** → 태그로 해석되지 않고 글자 그대로 보인다. (Task 10 테스트)

---

## 파일 구조

| 파일 | 책임 |
|------|------|
| `index.html` | `<div id="app"></div>`와 스크립트/스타일 연결만 |
| `style.css` | 전체 화면 스타일, 반응형 |
| `questions.js` | `CATEGORIES`, `QUESTIONS` 전역 상수 (데이터만) |
| `script.js` | 상단: 순수 로직 함수 / 하단: `startApp` UI 컨트롤러 / 맨 끝: 자동 시작 |
| `../Study03_Quiz_tests/harness.js` | `test`, `assert`, `assertEqual`, `assertDeepEqual`, `runTests` |
| `../Study03_Quiz_tests/test.html` | `window.__QUIZ_TEST__ = true` 설정 후 `../Study03_Quiz/questions.js`, `../Study03_Quiz/script.js`, harness, 각 테스트 파일 로드 → `runTests()` |
| `../Study03_Quiz_tests/run.sh` | Edge headless로 `test.html`을 열어 `FAIL…`/`RESULT…` 줄만 출력 |
| `../Study03_Quiz_tests/logic.test.js`, `../Study03_Quiz_tests/questions.test.js`, `../Study03_Quiz_tests/ui.test.js`, `../Study03_Quiz_tests/timer.test.js`, `../Study03_Quiz_tests/board.test.js` | 영역별 테스트 |

## 공통 타입 (모든 Task가 이 이름을 쓴다)

```js
// Question (questions.js) / RoundQuestion (choices를 섞고 answer를 다시 계산한 사본)
{ id: "kh-01", category: "한국사", question: "…", choices: ["…","…","…","…"], answer: 1,
  explanation: "한 문장.", source: { name: "…", url: "https://…" /* 선택 */ } }

// Result
{ question: RoundQuestion, chosen: number|null /* null = 시간 초과 */, correct: boolean,
  points: 0|0.5|1, hintUsed: boolean, timedOut: boolean }

// GameState
{ mode, category, questions: RoundQuestion[], index: number, results: Result[],
  answered: boolean, hintUsed: boolean, removed: number[], isRetry: boolean }
```

## UI 테스트용 선택자 (모든 UI Task 공통)

`#app` 루트 · 시작 화면 `[data-mode="practice|speed|hint"]`, `#board-btn` · 카테고리 `[data-category="한국사"]` · 퀴즈 `#progress`(예: `3 / 10`), `#current-score`, `[data-choice="0".."3"]`(클래스 `correct`/`wrong`/`removed`, 잠기면 `disabled`), `#feedback`, `#source-link`(`target="_blank"`), `#next-btn`(마지막 문항이면 글자 `결과 보기`), `#hint-btn`, `#timer`, `#quit-btn` · 결과 `#score-text`, `.wrong-item`, `#retry-btn`, `#again-btn`, `#home-btn`, `#all-clear` · 기록 `#name-input`(`maxlength="10"`), `#record-btn`, `#record-msg` · 순위표 `[data-board-category]`, `[data-board-mode]`, `.board-row` · 공통 안내 `.no-record`(글자 `순위표에 기록되지 않음`)

---

### Task 1: 테스트 환경과 게임 핵심 로직 (연습 모드 채점)

**Files:**
- Create: `../Study03_Quiz_tests/harness.js`, `../Study03_Quiz_tests/test.html`, `../Study03_Quiz_tests/run.sh`, `../Study03_Quiz_tests/logic.test.js`, `script.js`, `questions.js`

**Interfaces:**
- Consumes: 없음
- Produces (`script.js`):
  - `shuffle(array, rng = Math.random) -> Array` — 원본을 바꾸지 않는 Fisher–Yates
  - `prepareRound(questions, rng) -> RoundQuestion[]` — 문항 순서와 각 문항 보기 순서를 섞고, 정답을 **원래 정답 문자열로 다시 찾아** `answer`를 갱신
  - `createGame({ mode, category, questions, rng, isRetry = false }) -> GameState` — `questions`는 이미 걸러진 원본 문항, 내부에서 `prepareRound` 호출
  - `currentQuestion(state) -> RoundQuestion | undefined`
  - `scoreFor(correct, hintUsed) -> 0 | 0.5 | 1`
  - `answerQuestion(state, choiceIndex /* number | null */) -> Result | null` — 이미 답했거나 `removed`에 있는 보기면 `null`, 아니면 `results`에 추가하고 `answered = true`
  - `nextQuestion(state) -> boolean` — `index++`, `answered/hintUsed/removed` 초기화, 남은 문항이 있으면 `true`
  - `isFinished(state) -> boolean`, `totalScore(state) -> number`, `wrongResults(state) -> Result[]`
  - `formatScore(score, max) -> string`
- Produces (`questions.js`): `const CATEGORIES = ["한국사","세계지리","과학","예술과 문화"]; const QUESTIONS = [];`
- Produces (`../Study03_Quiz_tests/harness.js`): `test(name, fn)`, `assert(cond, msg)`, `assertEqual(actual, expected, msg)`, `assertDeepEqual(actual, expected, msg)`, `runTests()` — 각 테스트를 try/catch로 실행해 `PASS 이름`/`FAIL 이름: 메시지` 줄을 `#results`에, `RESULT {p} passed, {f} failed`를 `#summary`에 쓴다. 테스트 파일 공용 도우미도 여기에 둔다.
  - `makeQuestions(category, n)`: 가짜 문항 n개. i번째(1부터)는 `id: "t-" + i`, `choices: ["정답"+i, "오답"+i+"a", "오답"+i+"b", "오답"+i+"c"]`, `answer: 0`, 해설과 `source: { name: "테스트", url: "https://example.com" }`을 가진다.
  - `seqRng(values)`: 값을 차례로 돌려주고 끝나면 처음부터 반복하는 난수
  - `click(el)`: `el.click()`
  - `memoryStorage()`: Map 기반 `getItem/setItem/removeItem`. Task 2에서 추가해도 된다.

- [ ] **Step 1: 프로젝트 폴더에 git 저장소를 만들고, 옆 폴더에 테스트 러너를 준비한다**

```bash
git init
mkdir -p ../Study03_Quiz_tests
```

`../Study03_Quiz_tests/run.sh` (그대로 사용):

```bash
#!/usr/bin/env bash
cd "$(dirname "$0")"
URL="file:///$(cygpath -m "$PWD/test.html")"
"/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --headless=new --disable-gpu --dump-dom "$URL" 2>/dev/null \
  | grep -oE '(FAIL [^<]*|RESULT [^<]*)'
```

`../Study03_Quiz_tests/test.html`은 `<div id="results"></div><div id="summary"></div><div id="sandbox"></div>`를 두고, `window.__QUIZ_TEST__ = true` → `../Study03_Quiz/questions.js` → `../Study03_Quiz/script.js` → `harness.js` → `*.test.js` → `runTests()` 순서로 로드한다. 아직 없는 테스트 파일은 그 파일을 만드는 Task에서 `<script>`를 추가한다.

- [ ] **Step 2: 실패하는 테스트를 쓴다** (`../Study03_Quiz_tests/logic.test.js`)

```js
test("shuffle은 원본을 바꾸지 않고 같은 원소를 돌려준다", () => {
  const a = [1, 2, 3, 4];
  const b = shuffle(a, seqRng([0.9, 0.1, 0.5]));
  assertDeepEqual(a, [1, 2, 3, 4]);
  assertDeepEqual(b.slice().sort(), [1, 2, 3, 4]);
});
test("prepareRound 후에도 answer는 원래 정답 문자열을 가리킨다", () => {
  const round = prepareRound(makeQuestions("한국사", 10), Math.random);
  assertEqual(round.length, 10);
  round.forEach(q => assertEqual(q.choices[q.answer], "정답" + q.id.split("-")[1]));
});
test("맞히면 1점, 틀리면 0점, 힌트 쓰고 맞히면 0.5점", () => {
  assertEqual(scoreFor(true, false), 1);
  assertEqual(scoreFor(false, false), 0);
  assertEqual(scoreFor(true, true), 0.5);
  assertEqual(scoreFor(false, true), 0);
});
test("한 판을 끝까지 풀면 점수와 오답 목록이 맞다", () => {
  const s = createGame({ mode: "practice", category: "한국사", questions: makeQuestions("한국사", 10), rng: Math.random });
  for (let i = 0; i < 10; i++) {
    const q = currentQuestion(s);
    answerQuestion(s, i < 7 ? q.answer : (q.answer + 1) % 4);
    nextQuestion(s);
  }
  assert(isFinished(s));
  assertEqual(totalScore(s), 7);
  assertEqual(wrongResults(s).length, 3);
});
test("같은 문항에 두 번 답하면 두 번째는 무시된다", () => {   // Review Focus 1
  const s = createGame({ mode: "practice", category: "한국사", questions: makeQuestions("한국사", 10), rng: Math.random });
  const q = currentQuestion(s);
  assert(answerQuestion(s, q.answer) !== null);
  assertEqual(answerQuestion(s, (q.answer + 1) % 4), null);
  assertEqual(s.results.length, 1);
  assertEqual(s.results[0].correct, true);
});
test("formatScore는 정수면 소수점 없이, 반 점이면 .5로 표시한다", () => {
  assertEqual(formatScore(8, 10), "8 / 10");
  assertEqual(formatScore(7.5, 10), "7.5 / 10");
  assertEqual(formatScore(0, 10), "0 / 10");
  assertEqual(formatScore(0.5 + 0.5 + 0.5, 10), "1.5 / 10");
});
```

- [ ] **Step 3: 실패를 확인한다**

Run: `bash ../Study03_Quiz_tests/run.sh`
Expected: `FAIL …: shuffle is not defined` 같은 줄들과 `RESULT 0 passed, 6 failed`

- [ ] **Step 4: Interfaces의 함수들을 `script.js` 상단에 구현하고 `questions.js` 골격을 만든다**

`script.js` 맨 끝의 자동 시작 코드는 Task 2에서 추가한다.

- [ ] **Step 5: 통과를 확인한다**

Run: `bash ../Study03_Quiz_tests/run.sh`
Expected: `FAIL` 줄 없음, `RESULT 6 passed, 0 failed`

- [ ] **Step 6: Commit**

```bash
git add PRD.md docs script.js questions.js
git commit -m "feat: 테스트 환경과 퀴즈 핵심 로직"
```

---

### Task 2: 1단계 화면 (카테고리 선택 → 퀴즈 → 결과)

**Files:**
- Create: `index.html`, `style.css`, `../Study03_Quiz_tests/ui.test.js`
- Modify: `script.js` (하단에 UI 추가), `../Study03_Quiz_tests/test.html` (ui.test.js 로드)

**Interfaces:**
- Consumes: Task 1의 로직 함수 전부
- Produces:
  - `startApp(root, options) -> App` — `options = { questions, rng = Math.random, now = Date.now, storage /* 키가 없으면 getStorage() */, confirm = window.confirm.bind(window) }`
  - `App = { getState() -> GameState | null, getScreen() -> "start"|"category"|"quiz"|"result"|"board", checkTimer() -> void /* Task 7 전까지 빈 함수 */ }`
  - `script.js` 맨 끝: `if (!window.__QUIZ_TEST__) startApp(document.getElementById("app"), { questions: QUESTIONS });`

1단계 화면 동작:
- 시작 화면 = 카테고리 선택 화면(`getScreen() === "category"`). 카테고리 버튼 4개와 `.no-record` 안내, 제목 옆에 "연습 모드" 표시.
- 퀴즈 화면: 카테고리, 모드, `#progress`, `#current-score`, 문제, 보기 4개, `#quit-btn`. 보기를 누르면 보기를 모두 `disabled`로 바꾸고, 정답에 `correct`, 고른 오답에 `wrong` 클래스를 붙인다. `#feedback`에 `정답!`/`오답`, 해설, `출처: 이름`을 표시한다. URL이 있으면 `#source-link`(`target="_blank" rel="noopener"`)를 쓰고, 없으면 글자만 쓴다. 그다음 `#next-btn`을 보여 준다.
- `#quit-btn` → `confirm("그만하고 처음으로 돌아갈까요? 이 판은 기록되지 않아요.")`가 `true`면 시작 화면으로 간다.
- 결과 화면: `#score-text`(formatScore), `.wrong-item`마다 문제, 내가 고른 답(시간 초과면 `시간 초과`), 정답, 해설, 출처. 그 밖에 `#again-btn`(같은 카테고리 새 판), `#home-btn`, 연습이면 `.no-record`를 둔다.
- 스타일: 단순한 카드형 레이아웃, 보기 버튼은 손가락으로 누르기 쉬운 크기, `correct` 초록 / `wrong` 빨강 / `removed` 회색. 360px 폭에서 가로 스크롤 없음.

- [ ] **Step 1: 실패하는 테스트를 쓴다** (`../Study03_Quiz_tests/ui.test.js`)

도우미: `freshApp(opts)` — `#sandbox`를 비우고 그 안에 `div`를 만들어 `startApp(div, { questions: makeQuestions("한국사", 10), rng: Math.random, storage: memoryStorage(), confirm: () => true, ...opts })`을 돌려준다. `memoryStorage()`(Map 기반 `getItem/setItem/removeItem`)는 harness.js에 둔다. `click(el)` = `el.click()`.

```js
test("시작 화면에 카테고리 4개와 '순위표에 기록되지 않음'", () => {
  const { root } = freshApp();
  assertEqual(root.querySelectorAll("[data-category]").length, 4);
  assert(root.querySelector(".no-record").textContent.includes("순위표에 기록되지 않음"));
});
test("카테고리를 고르면 1 / 10 문제가 나온다", () => {
  const { root, app } = freshApp();
  click(root.querySelector('[data-category="한국사"]'));
  assertEqual(app.getScreen(), "quiz");
  assertEqual(root.querySelector("#progress").textContent, "1 / 10");
});
test("답을 고르면 보기가 잠기고 정답 여부·해설·출처가 나온다", () => {
  const { root, app } = freshApp();
  click(root.querySelector('[data-category="한국사"]'));
  const wrong = (app.getState().questions[0].answer + 1) % 4;
  click(root.querySelector(`[data-choice="${wrong}"]`));
  root.querySelectorAll("[data-choice]").forEach(b => assert(b.disabled));
  assert(root.querySelector(`[data-choice="${wrong}"]`).classList.contains("wrong"));
  assert(root.querySelector(`[data-choice="${app.getState().questions[0].answer}"]`).classList.contains("correct"));
  assert(root.querySelector("#feedback").textContent.includes("오답"));
  assertEqual(root.querySelector("#source-link").target, "_blank");
  assert(root.querySelector("#next-btn") !== null);
});
test("10문제를 마치면 점수와 틀린 문제 목록이 나온다", () => {
  const { root, app } = freshApp();
  click(root.querySelector('[data-category="한국사"]'));
  for (let i = 0; i < 10; i++) {
    const a = app.getState().questions[i].answer;
    click(root.querySelector(`[data-choice="${i < 8 ? a : (a + 1) % 4}"]`));
    if (i === 9) assertEqual(root.querySelector("#next-btn").textContent, "결과 보기");
    click(root.querySelector("#next-btn"));
  }
  assertEqual(app.getScreen(), "result");
  assertEqual(root.querySelector("#score-text").textContent, "8 / 10");
  assertEqual(root.querySelectorAll(".wrong-item").length, 2);
  assert(root.querySelector(".no-record") !== null);
});
test("그만하기를 확인하면 시작 화면으로 돌아간다", () => {
  const { root, app } = freshApp({ confirm: () => true });
  click(root.querySelector('[data-category="한국사"]'));
  click(root.querySelector("#quit-btn"));
  assertEqual(app.getScreen(), "category");
});
```

`freshApp`은 `{ root, app }`을 돌려준다.

- [ ] **Step 2: 실패를 확인한다**

Run: `bash ../Study03_Quiz_tests/run.sh`
Expected: 새 테스트 5개가 `FAIL … startApp is not defined`

- [ ] **Step 3: `index.html`, `style.css`, `startApp`과 화면 함수들을 구현한다**

- [ ] **Step 4: 통과를 확인한다**

Run: `bash ../Study03_Quiz_tests/run.sh`
Expected: `RESULT 11 passed, 0 failed`

- [ ] **Step 5: 실제 브라우저에서 확인한다**

`index.html`을 Edge로 직접 열어(`file://`) 카테고리 화면이 뜨는지, 개발자 도구 콘솔에 오류가 없는지, 360px 기기 보기에서 가로 스크롤이 없는지 본다. 이 시점에는 `QUESTIONS`가 비어 있으므로 한 판을 끝까지 푸는 확인은 Task 6 뒤의 1단계 완료 점검에서 한다.

- [ ] **Step 6: Commit**

```bash
git add index.html style.css script.js
git commit -m "feat: 1단계 연습 모드 화면"
```

---

### Task 3–6: 문항 작성 (카테고리별 10문항)

카테고리마다 Task 하나씩이며 절차는 같다.

| Task | 카테고리 | id 접두사 |
|------|----------|-----------|
| 3 | 한국사 | `kh-01`…`kh-10` |
| 4 | 세계지리 | `wg-01`…`wg-10` |
| 5 | 과학 | `sc-01`…`sc-10` |
| 6 | 예술과 문화 | `ac-01`…`ac-10` |

**Files:**
- Modify: `questions.js` (`QUESTIONS`에 10개 추가)
- Create (Task 3만): `../Study03_Quiz_tests/questions.test.js`, `../Study03_Quiz_tests/test.html`에 로드 추가

**Interfaces:**
- Consumes: Question 타입, `CATEGORIES`
- Produces: `QUESTIONS`의 해당 카테고리 10문항

- [ ] **Step 1 (Task 3만): 문항 규칙 테스트를 쓴다** (`../Study03_Quiz_tests/questions.test.js`)

```js
const PREFIX = { "한국사": "kh", "세계지리": "wg", "과학": "sc", "예술과 문화": "ac" };
CATEGORIES.forEach(cat => test(`${cat}: 10문항이 형식과 규칙을 지킨다`, () => {
  const qs = QUESTIONS.filter(q => q.category === cat);
  assertEqual(qs.length, 10, "문항 수");
  qs.forEach(q => {
    assert(new RegExp(`^${PREFIX[cat]}-\\d{2}$`).test(q.id), q.id + " id 형식");
    assertEqual(q.choices.length, 4, q.id + " 보기 4개");
    assertEqual(new Set(q.choices).size, 4, q.id + " 보기 중복");
    q.choices.forEach(c => assert(typeof c === "string" && c.trim() !== "", q.id + " 빈 보기"));
    assert(Number.isInteger(q.answer) && q.answer >= 0 && q.answer <= 3, q.id + " answer 범위");
    assert(q.explanation.trim() !== "" && !q.explanation.includes("\n"), q.id + " 해설 한 줄");
    assert(q.source && q.source.name.trim() !== "", q.id + " 출처 이름");
    assert(!q.source.url || q.source.url.startsWith("https://"), q.id + " 출처 URL");
    if (/가장|최대|최소|최고|최저/.test(q.question)) {
      assert(q.question.includes("기준") && /\d{4}년/.test(q.question), q.id + " 최상급 표현에 기준과 시점 필요");
    }
  });
}));
test("전체 40문항이고 id가 중복되지 않는다", () => {
  assertEqual(QUESTIONS.length, 40);
  assertEqual(new Set(QUESTIONS.map(q => q.id)).size, 40);
});
```

- [ ] **Step 2: 실패를 확인한다**

Run: `bash ../Study03_Quiz_tests/run.sh`
Expected: `FAIL 한국사: … 문항 수`(Task 4–6에서는 해당 카테고리 줄이 FAIL)

- [ ] **Step 3: 문항 후보 10개를 고른다**

대학 1학년 교양 수준으로 쉬운 문항과 어려운 문항을 섞고, 카테고리 안에서 시대·지역·분야가 한쪽에 몰리지 않게 한다.

- [ ] **Step 4: 문항마다 웹에서 사실을 확인한다** (기억에만 기대지 않음)

각 문항에 대해:
1. 공신력 있는 출처를 웹에서 찾아 실제로 열어 보고 정답 사실을 확인한다. 우선순위는 국사편찬위원회(우리역사넷), 한국민족문화대백과사전, 표준국어대사전, 브리태니커, 정부/국제기구 통계, NASA이고, 위키백과는 다른 출처로 교차 확인했을 때만 쓴다.
2. 오답 3개도 하나씩 확인해서 정답이 될 여지가 없음을 확인한다. 부분적으로 맞는 보기는 쓰지 않는다.
3. 최상급 표현이 있으면 문제에 기준과 연도를 적는다. 예: `"국토 면적 기준(2024년), 세계에서 가장 넓은 나라는?"`
4. `source.name`에는 출처와 항목 이름, `source.url`에는 실제로 열어 본 https 주소를 적는다.

- [ ] **Step 5: `questions.js`에 10문항을 추가한다**

해설은 한 문장이다. `answer`는 보기 배열에서 정답의 위치이며, 섞기는 앱이 하므로 정답 위치를 고르게 할 필요는 없다.

- [ ] **Step 6: 통과를 확인한다**

Run: `bash ../Study03_Quiz_tests/run.sh`
Expected: 해당 카테고리 줄에 FAIL 없음. Task 6이 끝나면 `전체 40문항…`도 통과하고 FAIL 줄 0개.

- [ ] **Step 7: 확인 기록을 남기고 Commit한다**

Task 3~6마다 따로 커밋하며, 제목의 카테고리 이름은 그 Task에 맞게 바꾼다. 커밋 메시지 본문에는 문항별로 "id — 확인한 출처"를 한 줄씩 적는다.

```bash
git add questions.js
git commit -m "content: 한국사 10문항 (출처 확인)"
```

**1단계 완료 점검 (Task 6 뒤):** `index.html`을 Edge로 열어 카테고리 4개를 각각 한 판씩 끝까지 풀어 본다. 콘솔 오류가 없어야 하고, PRD 8절 1단계 완료 기준을 하나씩 확인한다.

---

### Task 7: 모드 선택 화면과 스피드 모드

**Files:**
- Modify: `script.js`, `style.css`, `../Study03_Quiz_tests/ui.test.js`, `../Study03_Quiz_tests/test.html`
- Create: `../Study03_Quiz_tests/timer.test.js`

**Interfaces:**
- Consumes: `startApp` options의 `now`, `answerQuestion(state, null)`
- Produces:
  - `const SPEED_SECONDS = 15`
  - `createTimer({ seconds, now, onTick, onExpire }) -> { start(), stop(), remaining() -> number, check() }`
    - `start()`: 마감 시각 = `now() + seconds*1000`로 정하고 `setInterval(check, 250)`
    - `remaining()`: `Math.max(0, Math.ceil((마감 - now()) / 1000))`
    - `check()`: 실행 중이 아니면 아무것도 하지 않는다. 실행 중이면 `onTick(remaining())`을 부르고, 0이면 `stop()` 후 `onExpire()`를 한 번만 부른다.
  - `App.checkTimer()`가 현재 타이머의 `check()`를 부른다.

화면 변경:
- 시작 화면이 모드 선택 화면이 된다(`getScreen() === "start"`). 모드 버튼 3개와 각 설명을 두고, 연습 버튼 옆에 `.no-record`를 둔다. `#board-btn`은 Task 10에서 추가한다. 모드를 고르면 카테고리 화면으로 가고, 카테고리 화면에는 [뒤로] 버튼이 있다.
- 스피드 퀴즈: `#timer`에 남은 초를 표시한다. 답하면 타이머가 멈춘다. 만료되면 `answerQuestion(state, null)`을 부르고 보기를 잠근 뒤 정답에 `correct`를 붙이고 `#feedback`에 `시간 초과`와 해설을 보여 준다. `#next-btn`을 누르면 새 타이머를 15초로 시작한다. `#quit-btn`이나 결과 화면으로 갈 때는 타이머를 멈춘다.

- [ ] **Step 1: 기존 UI 테스트를 새 흐름에 맞게 고친다**

`freshApp` 뒤에 `click('[data-mode="practice"]')`를 먼저 하도록 도우미 `startPractice(root)`를 추가한다. "시작 화면" 테스트는 `[data-mode]` 3개와 연습 옆 `.no-record`를 확인하도록 바꾸고, 그만하기 테스트는 `getScreen() === "start"`를 기대하도록 바꾼다.

- [ ] **Step 2: 실패하는 테스트를 쓴다**

`../Study03_Quiz_tests/timer.test.js` (가짜 시계 `let t = 0; const now = () => t;`):

```js
test("15초가 지나면 onExpire가 한 번만 불린다", () => {
  let t = 0, expired = 0;
  const tm = createTimer({ seconds: 15, now: () => t, onTick() {}, onExpire: () => expired++ });
  tm.start(); t = 14000; tm.check(); assertEqual(expired, 0); assertEqual(tm.remaining(), 1);
  t = 15000; tm.check(); tm.check(); assertEqual(expired, 1);
});
test("다른 탭에 20초 있다 돌아오면 바로 만료된다", () => {   // Review Focus 3
  let t = 0, expired = 0;
  const tm = createTimer({ seconds: 15, now: () => t, onTick() {}, onExpire: () => expired++ });
  tm.start(); t = 20000; tm.check(); assertEqual(expired, 1); assertEqual(tm.remaining(), 0);
});
test("stop 후에는 만료되지 않는다", () => {
  let t = 0, expired = 0;
  const tm = createTimer({ seconds: 15, now: () => t, onTick() {}, onExpire: () => expired++ });
  tm.start(); tm.stop(); t = 30000; tm.check(); assertEqual(expired, 0);
});
```

`../Study03_Quiz_tests/ui.test.js`에 추가 (`freshApp({ now: () => t })`, 스피드 모드 → 한국사):

```js
// 시간 초과: t=15000 → app.checkTimer() → results[0].timedOut === true, points 0, #feedback에 "시간 초과", 보기 모두 disabled
// 해설 중 정지: 답한 뒤 t를 100000으로 → checkTimer() → results.length === 1 (Review Focus 2)
// 만료 후 클릭 무시: 만료 후 정답 보기 click → results.length === 1, results[0].timedOut === true (Review Focus 2)
// 다음 문항 재시작: 만료 → #next-btn → t를 +1000 → #timer 글자 "14"
```

위 주석 4개를 각각 `test(...)`로 쓰고, 주석에 적은 값을 그대로 단언한다.

- [ ] **Step 3: 실패를 확인한다**

Run: `bash ../Study03_Quiz_tests/run.sh`
Expected: 새 테스트들과 고친 시작 화면 테스트가 FAIL

- [ ] **Step 4: `createTimer`, 모드 선택 화면, 스피드 UI를 구현한다**

- [ ] **Step 5: 통과를 확인한다**

Run: `bash ../Study03_Quiz_tests/run.sh`
Expected: FAIL 줄 0개

- [ ] **Step 6: 실제 브라우저에서 확인한다**

Edge로 `index.html`을 열고 스피드 모드로 한 문항은 시간을 넘기고, 한 문항은 다른 탭에 20초 있다 돌아와 본다. 둘 다 시간 초과로 처리되어야 한다.

- [ ] **Step 7: Commit**

```bash
git add script.js style.css
git commit -m "feat: 모드 선택 화면과 스피드 모드"
```

---

### Task 8: 힌트 모드와 연습 모드 틀린 문제 다시 풀기

**Files:**
- Modify: `script.js`, `style.css`, `../Study03_Quiz_tests/logic.test.js`, `../Study03_Quiz_tests/ui.test.js`

**Interfaces:**
- Consumes: GameState, `answerQuestion`, `createGame`
- Produces:
  - `useHint(state, rng) -> number[]` — 힌트 모드가 아니거나, 이미 썼거나, 이미 답했으면 `[]`를 돌려준다. 아니면 오답 위치 3개 중 2개를 무작위로 골라 `state.removed`에 넣고 `hintUsed = true`로 바꾼 뒤 그 2개를 돌려준다.
  - `answerQuestion`은 `points = scoreFor(correct, state.hintUsed)`, `hintUsed: state.hintUsed`를 기록한다.
  - `createRetryGame(state, rng) -> GameState` — `wrongResults(state)`의 문항으로 새 연습 판을 만들고 `isRetry = true`로 둔다. 보기는 다시 섞는다.

화면:
- 힌트 퀴즈에만 `#hint-btn`을 둔다. 누르면 지운 보기에 `removed` 클래스와 `disabled`를 붙인다(자리는 유지). 힌트를 쓴 뒤나 답한 뒤에는 버튼을 `disabled`로 바꾼다.
- 연습 결과에서 오답이 1개 이상이면 `#retry-btn`을 보여 준다. 다시 푸는 판의 진행 표시는 `1 / 3`처럼 그 판의 문항 수를 쓴다.
- 다시 푼 판의 결과 화면: `#score-text`는 `"2 / 3"`처럼 그 판의 문항 수 기준이다. `.wrong-item`, 남은 오답이 있으면 `#retry-btn`, `#home-btn`, `.no-record`를 둔다. `#again-btn`은 두지 않는다. 오답이 0이면 `#all-clear`에 `틀린 문제를 모두 맞혔어요`를 표시하고 `#retry-btn`은 숨긴다.

- [ ] **Step 1: 실패하는 테스트를 쓴다**

`../Study03_Quiz_tests/logic.test.js`:

```js
test("힌트는 오답 2개를 지우고 정답은 남긴다", () => {
  const s = createGame({ mode: "hint", category: "한국사", questions: makeQuestions("한국사", 10), rng: Math.random });
  const removed = useHint(s, Math.random);
  assertEqual(removed.length, 2);
  assert(!removed.includes(currentQuestion(s).answer));
  assertEqual(new Set(removed).size, 2);
});
test("힌트는 문항당 한 번, 연습 모드에서는 쓸 수 없다", () => {
  const s = createGame({ mode: "hint", category: "한국사", questions: makeQuestions("한국사", 10), rng: Math.random });
  useHint(s, Math.random);
  assertDeepEqual(useHint(s, Math.random), []);
  const p = createGame({ mode: "practice", category: "한국사", questions: makeQuestions("한국사", 10), rng: Math.random });
  assertDeepEqual(useHint(p, Math.random), []);
});
test("힌트 쓰고 맞히면 0.5점, 지워진 보기는 고를 수 없다", () => {
  const s = createGame({ mode: "hint", category: "한국사", questions: makeQuestions("한국사", 10), rng: Math.random });
  const removed = useHint(s, Math.random);
  assertEqual(answerQuestion(s, removed[0]), null);
  assertEqual(answerQuestion(s, currentQuestion(s).answer).points, 0.5);
  nextQuestion(s);
  assertEqual(s.hintUsed, false);
});
test("다시 풀기 판은 틀린 문항만으로 만들어진다", () => {
  const s = createGame({ mode: "practice", category: "한국사", questions: makeQuestions("한국사", 10), rng: Math.random });
  const wrongIds = [];
  for (let i = 0; i < 10; i++) {
    const q = currentQuestion(s);
    if (i % 3 === 0) { wrongIds.push(q.id); answerQuestion(s, (q.answer + 1) % 4); } else answerQuestion(s, q.answer);
    nextQuestion(s);
  }
  const r = createRetryGame(s, Math.random);
  assert(r.isRetry);
  assertEqual(r.mode, "practice");
  assertDeepEqual(r.questions.map(q => q.id).sort(), wrongIds.sort());
  r.questions.forEach(q => assertEqual(q.choices[q.answer], "정답" + q.id.split("-")[1]));
});
```

`../Study03_Quiz_tests/ui.test.js`: 아래 각 항목을 `test(...)`로 쓴다.
- 힌트 버튼을 누르면 `.removed`가 2개 생기고 `#hint-btn`이 `disabled`가 된다. 이어서 정답을 고르면 `#current-score`가 `0.5`가 된다.
- 연습 모드에서 3개를 틀리면 `#retry-btn`이 보인다. 이를 누르면 `#progress`가 `1 / 3`이 되고, 3개를 모두 맞히면 `#score-text`가 `3 / 3`, `#all-clear`가 보이고 `#retry-btn`과 `#again-btn`은 없다.
- 스피드·힌트 결과 화면에는 `#retry-btn`이 없다.

- [ ] **Step 2: 실패를 확인한다**

Run: `bash ../Study03_Quiz_tests/run.sh`
Expected: 새 테스트들이 `useHint is not defined` 등으로 FAIL

- [ ] **Step 3: `useHint`, `createRetryGame`, 채점 변경, 힌트·다시 풀기 UI를 구현한다**

- [ ] **Step 4: 통과를 확인한다**

Run: `bash ../Study03_Quiz_tests/run.sh`
Expected: FAIL 줄 0개

- [ ] **Step 5: 실제 브라우저에서 PRD 8절 2단계 완료 기준을 하나씩 확인한다**

- [ ] **Step 6: Commit**

```bash
git add script.js style.css
git commit -m "feat: 힌트 모드와 틀린 문제 다시 풀기"
```

---

### Task 9: 순위표 저장 로직

**Files:**
- Modify: `script.js`, `../Study03_Quiz_tests/test.html`
- Create: `../Study03_Quiz_tests/board.test.js`

**Interfaces:**
- Consumes: 없음 (순수 함수, `storage`는 `getItem/setItem/removeItem`을 가진 객체 또는 `null`)
- Produces:
  - `const BOARD_KEY = "quiz.leaderboard.v1"`, `const BOARD_SIZE = 10`
  - `getStorage() -> Storage | null` — `localStorage`에 시험 키를 쓰고 지워 본다. 예외가 나면 `null`.
  - `getBoard(storage, category, mode) -> Entry[]` — 저장 형식 `{ "한국사|speed": Entry[], … }`. storage가 `null`이거나 JSON이 깨졌거나 배열이 아니면 `[]`.
  - `qualifies(entries, score) -> boolean` — `entries.length < 10 || score > entries[9].score`
  - `insertEntry(entries, entry) -> Entry[]` — 점수가 같거나 높은 기록들 **뒤에** 넣고(동점이면 먼저 세운 기록이 위) 앞 10개를 돌려준다.
  - `saveEntry(storage, category, mode, entry) -> { saved: true, rank: number } | { saved: false, reason: "unavailable" | "not-qualified" }` — storage가 `null`이거나 `setItem`이 예외를 던지면 `"unavailable"`. 깨진 JSON은 빈 순위표로 보고 덮어쓴다.
  - `normalizeName(raw) -> string` — 앞뒤 공백을 지우고, 빈 문자열이면 `"익명"`, 10자를 넘으면 앞 10자만 남긴다.
  - `formatDate(date) -> "YYYY-MM-DD"` (로컬 시간)
  - Entry: `{ name: string, score: number, date: string }`

- [ ] **Step 1: 실패하는 테스트를 쓴다** (`../Study03_Quiz_tests/board.test.js`)

```js
const E = (score, name = "a") => ({ name, score, date: "2026-10-12" });
test("점수 높은 순, 동점이면 먼저 세운 기록이 위", () => {
  let b = [];
  b = insertEntry(b, E(7, "첫째")); b = insertEntry(b, E(9)); b = insertEntry(b, E(7, "둘째"));
  assertDeepEqual(b.map(e => e.score), [9, 7, 7]);
  assertEqual(b[1].name, "첫째");
});
test("10개가 차면 10위보다 높아야 들어간다", () => {
  const b = Array.from({ length: 10 }, () => E(5));
  assertEqual(qualifies(b, 5), false);
  assertEqual(qualifies(b, 5.5), true);
  assertEqual(insertEntry(b, E(6)).length, 10);
});
test("카테고리·모드별로 따로 저장되고 다시 읽힌다", () => {
  const st = memoryStorage();
  assertDeepEqual(saveEntry(st, "한국사", "speed", E(8)), { saved: true, rank: 1 });
  assertEqual(getBoard(st, "한국사", "speed").length, 1);
  assertEqual(getBoard(st, "한국사", "hint").length, 0);
  assertEqual(getBoard(st, "과학", "speed").length, 0);
});
test("저장소가 없거나 쓰기가 실패하면 unavailable", () => {   // Review Focus 4
  assertDeepEqual(saveEntry(null, "한국사", "speed", E(8)), { saved: false, reason: "unavailable" });
  const broken = { getItem: () => null, setItem() { throw new Error("quota"); }, removeItem() {} };
  assertDeepEqual(saveEntry(broken, "한국사", "speed", E(8)), { saved: false, reason: "unavailable" });
  assertDeepEqual(getBoard(null, "한국사", "speed"), []);
});
test("깨진 JSON은 빈 순위표로 본다", () => {   // Review Focus 4
  const st = memoryStorage(); st.setItem(BOARD_KEY, "{bad");
  assertDeepEqual(getBoard(st, "한국사", "speed"), []);
  assertEqual(saveEntry(st, "한국사", "speed", E(3)).saved, true);
});
test("10위 밖이면 not-qualified", () => {
  const st = memoryStorage();
  for (let i = 0; i < 10; i++) saveEntry(st, "한국사", "hint", E(9));
  assertDeepEqual(saveEntry(st, "한국사", "hint", E(9)), { saved: false, reason: "not-qualified" });
});
test("이름 정리와 날짜 형식", () => {
  assertEqual(normalizeName("   "), "익명");
  assertEqual(normalizeName("  철수 "), "철수");
  assertEqual(normalizeName("가나다라마바사아자차카"), "가나다라마바사아자차");
  assertEqual(formatDate(new Date(2026, 0, 5)), "2026-01-05");
});
```

- [ ] **Step 2: 실패를 확인한다**

Run: `bash ../Study03_Quiz_tests/run.sh`
Expected: 새 테스트 7개가 FAIL

- [ ] **Step 3: Interfaces의 함수들을 구현한다**

- [ ] **Step 4: 통과를 확인한다**

Run: `bash ../Study03_Quiz_tests/run.sh`
Expected: FAIL 줄 0개

- [ ] **Step 5: Commit**

```bash
git add script.js
git commit -m "feat: 순위표 저장 로직"
```

---

### Task 10: 순위표 화면과 기록하기

**Files:**
- Modify: `script.js`, `style.css`, `../Study03_Quiz_tests/ui.test.js`

**Interfaces:**
- Consumes: Task 9 함수 전부, `startApp` options의 `storage`, `now`
- Produces: 화면만 (새 전역 없음)

화면:
- 스피드·힌트 결과 화면에 `#name-input`(`maxlength="10"`, placeholder `이름 (비우면 익명)`)과 `#record-btn`을 둔다.
  - 누르면 `saveEntry(storage, category, mode, { name: normalizeName(입력값), score, date: formatDate(new Date(now())) })`를 부른다.
  - 결과는 `#record-msg`에 표시한다. 저장되면 `{rank}위로 기록했어요`, `not-qualified`면 `상위 10위 안에 들지 못했어요`, `unavailable`이면 `이 브라우저에서는 기록을 저장할 수 없어요`.
  - 한 번 누르면 결과와 상관없이 `#record-btn`을 `disabled`로 바꾼다.
- storage가 `null`이면 입력칸 대신 `#record-msg`에 `이 브라우저에서는 기록을 저장할 수 없어요`를 처음부터 보여 준다.
- 연습 결과 화면(다시 풀기 판 포함)에는 기록 칸이 없다.
- 시작 화면에 `#board-btn`을 둔다. 순위표 화면에는 `[data-board-category]` 버튼 4개, `[data-board-mode]` 버튼 2개(스피드, 힌트)와 `.board-row` 목록(순위, 이름, 점수 `formatScore` 숫자 부분, 날짜)을 둔다. 기록이 없으면 `아직 기록이 없어요`를, 저장소가 없으면 저장 불가 문구를 보여 준다. [처음으로] 버튼도 둔다.
- 이름은 `textContent`로 넣는다.

- [ ] **Step 1: 실패하는 테스트를 쓴다** (`../Study03_Quiz_tests/ui.test.js`)

아래 각 항목을 `test(...)`로 쓴다. 공통 도우미 `finishRound(root, app, correctCount)`가 현재 판을 끝까지 푼다.
- 스피드 한국사 8점 → `#name-input`에 `"철수"` → `#record-btn` → `#record-msg`에 `1위`, 버튼 `disabled` → `#home-btn` → `#board-btn` → 한국사·스피드 선택 → `.board-row` 1개, 이름 `철수`, 점수 `8`
- 이름을 비우고 기록하면 순위표에 `익명`
- `freshApp({ storage: null })`로 힌트 판을 끝내면 `#record-btn`이 없고 `#record-msg`에 `이 브라우저에서는 기록을 저장할 수 없어요`. `#board-btn`을 눌러도 앱이 멈추지 않고 같은 문구 (Review Focus 4)
- 연습 결과 화면에는 `#name-input`이 없다
- 이름 `"<b>굵게</b>"`로 기록하면 `.board-row`의 이름 칸 `textContent`가 `"<b>굵게</b>"`이고 `querySelector("b")`가 `null`이다 (Review Focus 5)

- [ ] **Step 2: 실패를 확인한다**

Run: `bash ../Study03_Quiz_tests/run.sh`
Expected: 새 테스트들이 FAIL

- [ ] **Step 3: 기록 칸과 순위표 화면을 구현한다**

- [ ] **Step 4: 통과를 확인한다**

Run: `bash ../Study03_Quiz_tests/run.sh`
Expected: FAIL 줄 0개

- [ ] **Step 5: 실제 브라우저에서 확인한다**

Edge로 `index.html`을 열어 스피드와 힌트 기록을 하나씩 남긴다. 브라우저를 완전히 닫았다가 다시 열어도 순위표가 남아 있어야 한다. InPrivate 창에서도 열어 앱이 멈추지 않는지 본다. PRD 8절 3단계 완료 기준을 하나씩 확인한다.

- [ ] **Step 6: Commit**

```bash
git add script.js style.css
git commit -m "feat: 순위표 화면과 기록하기"
```
