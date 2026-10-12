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
