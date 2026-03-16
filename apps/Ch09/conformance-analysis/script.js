const state = {
  score: 0,
  correct: 0,
  streak: 0,

  stage1Solved: false,
  stage1Order: [],

  definitionRound: 1,
  definitionStreak: 0,
  definitionCurrent: null,

  difficulty: 1,
  stage3Attempts: 0,
  stage3SolvedCount: 0,
  stage3Scenario: null,
  stage3Answer: "",
  calcPassed: false
};

const stage1Steps = [
  { id: 1, label: "Create X-chart" },
  { id: 2, label: "Collect a sample of n outcome observations" },
  { id: 3, label: "Determine whether the process is under control" },
  { id: 4, label: "Calculate the sample mean (X̄)" },
  { id: 5, label: "Calculate the centerline (X̄̄)" },
  { id: 6, label: "Calculate the control limits (UCL and LCL)" },
  { id: 7, label: "Plot the sample means over time" }
];

const stage1CorrectOrder = [2, 4, 1, 5, 6, 7, 3];

const definitionBank = [
  {
    prompt: "Average of the observations in one sample of size n.",
    answer: "Sample Mean (X̄)",
    options: ["Sample Mean (X̄)", "Centerline (X̄̄)", "Upper Control Limit (UCL)", "Estimated Standard Deviation (ESD)"]
  },
  {
    prompt: "Average of all sample means used as the centerline in an X-chart.",
    answer: "Centerline (X̄̄)",
    options: ["Lower Control Limit (LCL)", "Centerline (X̄̄)", "Sample Mean (X̄)", "Assignable Cause Variation"]
  },
  {
    prompt: "The estimated standard deviation of the sample means used to set control limits.",
    answer: "Estimated Standard Deviation (ESD)",
    options: ["Estimated Standard Deviation (ESD)", "Target Value", "Process Capability", "Tolerance"]
  },
  {
    prompt: "Centerline plus three estimated standard deviations.",
    answer: "Upper Control Limit (UCL)",
    options: ["Upper Control Limit (UCL)", "Lower Specification Limit (LSL)", "Centerline (X̄̄)", "Sample Mean (X̄)"]
  },
  {
    prompt: "Centerline minus three estimated standard deviations.",
    answer: "Lower Control Limit (LCL)",
    options: ["Upper Specification Limit (USL)", "Lower Control Limit (LCL)", "Assignable Cause Variation", "Robustness"]
  },
  {
    prompt: "The diagnosis made when a sample mean falls outside the control limits.",
    answer: "Assignable Cause Variation",
    options: ["Common Cause Variation", "Assignable Cause Variation", "Robust Process", "Centerline"]
  }
];

document.addEventListener("DOMContentLoaded", () => {
  bindEvents();
  buildStage1();
  loadDefinition();
  generateScenario();
  updateScoreboard();
  updateMastery();
});

function bindEvents() {
  document.getElementById("resetStage1Btn").addEventListener("click", resetStage1);
  document.getElementById("newDefinitionBtn").addEventListener("click", nextDefinition);
  document.getElementById("newScenarioBtn").addEventListener("click", generateScenario);
  document.getElementById("checkCalcBtn").addEventListener("click", checkCalculations);
  document.getElementById("inControlBtn").addEventListener("click", () => diagnose("in"));
  document.getElementById("outControlBtn").addEventListener("click", () => diagnose("out"));
  document.getElementById("resetAllBtn").addEventListener("click", resetAll);

  document.querySelectorAll(".difficulty-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".difficulty-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.difficulty = Number(btn.dataset.level);
      generateScenario();
    });
  });
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function round3(value) {
  return Math.round(value * 1000) / 1000;
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function updateScoreboard() {
  document.getElementById("scoreValue").textContent = state.score;
  document.getElementById("correctValue").textContent = state.correct;
  document.getElementById("streakValue").textContent = state.streak;
  document.getElementById("definitionRound").textContent = state.definitionRound;
  document.getElementById("definitionStreak").textContent = state.definitionStreak;
}

function award(points) {
  state.score += points;
  state.correct += 1;
  state.streak += 1;
  updateScoreboard();
}

function breakStreak() {
  state.streak = 0;
  updateScoreboard();
}

function setFeedback(id, message, type) {
  const el = document.getElementById(id);
  el.textContent = message;
  el.className = `feedback ${type}`;
}

function clearFeedback(id) {
  const el = document.getElementById(id);
  el.textContent = "";
  el.className = "feedback";
}

function showHint(message) {
  const box = document.getElementById("hintBox");
  box.textContent = message;
  box.classList.add("show");
}

function hideHint() {
  const box = document.getElementById("hintBox");
  box.textContent = "";
  box.classList.remove("show");
}

function updateMastery() {
  document.getElementById("masteryStage1").textContent = state.stage1Solved
    ? "Solved successfully"
    : "Not yet solved";

  document.getElementById("masteryStage2").textContent =
    `Rounds completed: ${Math.max(state.definitionRound - 1, 0)} · Best current streak: ${state.definitionStreak}`;

  document.getElementById("masteryStage3").textContent =
    `Scenarios solved: ${state.stage3SolvedCount} · Current difficulty: Level ${state.difficulty}`;
}

/* --------------------------
   Stage 1
--------------------------- */
function buildStage1() {
  const container = document.getElementById("stepsContainer");
  container.innerHTML = "";

  shuffle(stage1Steps).forEach(step => {
    const btn = document.createElement("button");
    btn.className = "step-btn";
    btn.textContent = step.label;
    btn.dataset.id = step.id;
    btn.addEventListener("click", () => chooseStage1Step(step.id, step.label, btn));
    container.appendChild(btn);
  });

  renderStage1Sequence();
  updateStage1Progress();
  clearFeedback("stepFeedback");
}

function chooseStage1Step(id, label, btn) {
  if (state.stage1Solved) return;
  if (state.stage1Order.includes(id)) return;

  state.stage1Order.push(id);
  btn.disabled = true;
  btn.classList.add("selected");

  renderStage1Sequence();
  updateStage1Progress();

  if (state.stage1Order.length === stage1CorrectOrder.length) {
    checkStage1();
  }
}

function renderStage1Sequence() {
  const list = document.getElementById("selectedSequence");
  list.innerHTML = "";
  state.stage1Order.forEach(id => {
    const li = document.createElement("li");
    li.textContent = stage1Steps.find(s => s.id === id).label;
    list.appendChild(li);
  });
}

function updateStage1Progress() {
  const n = state.stage1Order.length;
  document.getElementById("stage1Progress").textContent = `${n}/7`;
  document.getElementById("stage1Fill").style.width = `${(n / 7) * 100}%`;
}

function checkStage1() {
  const ok = JSON.stringify(state.stage1Order) === JSON.stringify(stage1CorrectOrder);
  const buttons = document.querySelectorAll(".step-btn");

  if (ok) {
    buttons.forEach(b => b.classList.add("correct"));
    setFeedback(
      "stepFeedback",
      "Correct. You followed the correct conformance-analysis workflow from data collection through process diagnosis.",
      "success"
    );
    state.stage1Solved = true;
    award(12);
  } else {
    buttons.forEach(b => {
      if (state.stage1Order.includes(Number(b.dataset.id))) {
        b.classList.add("incorrect");
      }
    });
    setFeedback(
      "stepFeedback",
      "Incorrect sequence. Start with collecting observations and calculating sample means. The diagnosis step comes last.",
      "error"
    );
    breakStreak();
  }

  updateMastery();
}

function resetStage1() {
  state.stage1Order = [];
  buildStage1();
}

/* --------------------------
   Stage 2
--------------------------- */
function loadDefinition() {
  clearFeedback("matchFeedback");
  const prompt = definitionBank[Math.floor(Math.random() * definitionBank.length)];
  state.definitionCurrent = prompt;

  document.getElementById("definitionPrompt").textContent = prompt.prompt;

  const wrap = document.getElementById("definitionOptions");
  wrap.innerHTML = "";

  shuffle(prompt.options).forEach(option => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = option;
    btn.addEventListener("click", () => checkDefinition(option, btn));
    wrap.appendChild(btn);
  });

  updateScoreboard();
}

function checkDefinition(selected, buttonEl) {
  const correct = state.definitionCurrent.answer;
  const buttons = document.querySelectorAll("#definitionOptions .option-btn");
  buttons.forEach(b => (b.disabled = true));

  if (selected === correct) {
    buttonEl.classList.add("correct");
    state.definitionStreak += 1;
    award(5);
    setFeedback("matchFeedback", `Correct. ${correct} matches the prompt.`, "success");
  } else {
    buttonEl.classList.add("incorrect");
    buttons.forEach(b => {
      if (b.textContent === correct) b.classList.add("correct");
    });
    state.definitionStreak = 0;
    breakStreak();
    setFeedback("matchFeedback", `Incorrect. The correct answer is ${correct}.`, "error");
  }

  state.definitionRound += 1;
  updateScoreboard();
  updateMastery();
}

function nextDefinition() {
  loadDefinition();
}

/* --------------------------
   Stage 3
--------------------------- */
function generateScenario() {
  clearFeedback("analysisFeedback");
  clearFeedback("calcFeedback");
  hideHint();

  state.stage3Attempts = 0;
  state.calcPassed = state.difficulty === 1;
  document.getElementById("attemptsValue").textContent = "0";

  const sampleCount = state.difficulty === 3 ? 8 : 6 + Math.floor(Math.random() * 2);
  const center = round3(rand(0.42, 0.62));
  const esd = round3(rand(0.015, 0.035));
  const ucl = round3(center + 3 * esd);
  const lcl = round3(center - 3 * esd);

  let means = [];
  let outOfControl = Math.random() < (state.difficulty === 1 ? 0.5 : 0.6);

  if (state.difficulty === 3) {
    outOfControl = Math.random() < 0.7;
  }

  const outIndex = outOfControl ? Math.floor(Math.random() * sampleCount) : -1;

  for (let i = 0; i < sampleCount; i++) {
    let val;
    if (outOfControl && i === outIndex) {
      const goHigh = Math.random() < 0.5;
      val = goHigh ? round3(ucl + rand(0.008, 0.04)) : round3(lcl - rand(0.008, 0.04));
    } else {
      let lowBuffer = state.difficulty === 3 ? 0.002 : 0.01;
      let highBuffer = state.difficulty === 3 ? 0.002 : 0.01;
      val = round3(rand(lcl + lowBuffer, ucl - highBuffer));
    }
    means.push(val);
  }

  state.stage3Scenario = { center, esd, ucl, lcl, means };
  state.stage3Answer = outOfControl ? "out" : "in";

  renderScenario();
  renderCalcVisibility();
  drawChart();
  updateMastery();
}

function renderScenario() {
  const { center, ucl, lcl, means } = state.stage3Scenario;
  const hidden = state.difficulty === 1 ? false : true;

  document.getElementById("centerlineValue").textContent = hidden ? "?" : center.toFixed(3);
  document.getElementById("uclValue").textContent = hidden ? "?" : ucl.toFixed(3);
  document.getElementById("lclValue").textContent = hidden ? "?" : lcl.toFixed(3);

  const tbody = document.querySelector("#sampleTable tbody");
  tbody.innerHTML = "";

  means.forEach((m, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${i + 1}</td><td>${m.toFixed(3)}</td>`;
    tbody.appendChild(row);
  });

  document.getElementById("calcCenter").value = "";
  document.getElementById("calcUcl").value = "";
  document.getElementById("calcLcl").value = "";
}

function renderCalcVisibility() {
  const panel = document.getElementById("calcPanel");
  panel.style.display = state.difficulty === 1 ? "none" : "block";
}

function checkCalculations() {
  if (state.difficulty === 1) return;

  const centerGuess = Number(document.getElementById("calcCenter").value);
  const uclGuess = Number(document.getElementById("calcUcl").value);
  const lclGuess = Number(document.getElementById("calcLcl").value);

  const { center, ucl, lcl } = state.stage3Scenario;

  const closeEnough =
    Math.abs(centerGuess - center) <= 0.003 &&
    Math.abs(uclGuess - ucl) <= 0.003 &&
    Math.abs(lclGuess - lcl) <= 0.003;

  if (closeEnough) {
    state.calcPassed = true;
    setFeedback("calcFeedback", "Correct calculations. You can now make your diagnosis.", "success");
    award(8);
  } else {
    state.calcPassed = false;
    setFeedback(
      "calcFeedback",
      "Not quite. Recheck the average of the sample means for the centerline, then apply ± 3(ESD).",
      "error"
    );
    breakStreak();

    if (state.difficulty === 3) {
      showHint("Hard mode hint: the centerline is the average of the listed sample means. Then use UCL = centerline + 3(ESD) and LCL = centerline - 3(ESD).");
    }
  }

  updateMastery();
}

function diagnose(choice) {
  state.stage3Attempts += 1;
  document.getElementById("attemptsValue").textContent = state.stage3Attempts;

  if (!state.calcPassed) {
    setFeedback("analysisFeedback", "Complete the calculation step correctly before diagnosing this scenario.", "error");
    breakStreak();
    return;
  }

  if (choice === state.stage3Answer) {
    const msg =
      choice === "out"
        ? "Correct. At least one sample mean lies outside the control limits, so assignable cause variation is present."
        : "Correct. All sample means remain within the control limits, so the process appears in control.";
    setFeedback("analysisFeedback", msg, "success");

    const points = Math.max(14 - (state.stage3Attempts - 1) * 2, 6);
    award(points);
    state.stage3SolvedCount += 1;
    hideHint();
  } else {
    setFeedback(
      "analysisFeedback",
      "Incorrect diagnosis. Compare each sample mean against the UCL and LCL before deciding.",
      "error"
    );
    breakStreak();

    if (state.stage3Attempts >= 2) {
      showHint("Diagnosis hint: if any sample mean falls outside the control limits, infer assignable cause variation. If all stay inside, infer no assignable cause variation.");
    }
  }

  updateMastery();
}

function drawChart() {
  const canvas = document.getElementById("xChartCanvas");
  const ctx = canvas.getContext("2d");
  const { center, ucl, lcl, means } = state.stage3Scenario;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const pad = { top: 30, right: 36, bottom: 56, left: 64 };
  const w = canvas.width - pad.left - pad.right;
  const h = canvas.height - pad.top - pad.bottom;

  const minVal = Math.min(...means, lcl, center, ucl) - 0.02;
  const maxVal = Math.max(...means, lcl, center, ucl) + 0.02;

  const x = idx => pad.left + (idx * w) / Math.max(means.length - 1, 1);
  const y = val => pad.top + h - ((val - minVal) / (maxVal - minVal)) * h;

  ctx.strokeStyle = "#d9e2ec";
  ctx.lineWidth = 1;

  for (let i = 0; i <= 5; i++) {
    const yy = pad.top + (h / 5) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, yy);
    ctx.lineTo(canvas.width - pad.right, yy);
    ctx.stroke();
  }

  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top);
  ctx.lineTo(pad.left, canvas.height - pad.bottom);
  ctx.lineTo(canvas.width - pad.right, canvas.height - pad.bottom);
  ctx.stroke();

  const showLines = state.difficulty === 1 || state.calcPassed;

  if (showLines) {
    drawHorizontal(ctx, y(ucl), "UCL", "#b42318", canvas.width, pad);
    drawHorizontal(ctx, y(center), "Centerline", "#1d6fe8", canvas.width, pad);
    drawHorizontal(ctx, y(lcl), "LCL", "#b42318", canvas.width, pad);
  }

  ctx.fillStyle = "#334155";
  ctx.font = "12px Arial";
  for (let i = 0; i <= 5; i++) {
    const value = maxVal - ((maxVal - minVal) / 5) * i;
    const yy = pad.top + (h / 5) * i + 4;
    ctx.fillText(value.toFixed(3), 10, yy);
  }

  means.forEach((_, i) => {
    ctx.fillText(String(i + 1), x(i) - 4, canvas.height - pad.bottom + 20);
  });
  ctx.fillText("Sample #", canvas.width / 2 - 25, canvas.height - 14);

  ctx.beginPath();
  means.forEach((m, i) => {
    const xx = x(i);
    const yy = y(m);
    if (i === 0) ctx.moveTo(xx, yy);
    else ctx.lineTo(xx, yy);
  });
  ctx.strokeStyle = "#111827";
  ctx.lineWidth = 2.2;
  ctx.stroke();

  means.forEach((m, i) => {
    const xx = x(i);
    const yy = y(m);
    const outside = m > ucl || m < lcl;

    ctx.beginPath();
    ctx.arc(xx, yy, 5, 0, Math.PI * 2);
    ctx.fillStyle = outside ? "#b42318" : "#1d6fe8";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });
}

function drawHorizontal(ctx, yVal, label, color, width, pad) {
  ctx.beginPath();
  ctx.moveTo(pad.left, yVal);
  ctx.lineTo(width - pad.right, yVal);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.7;
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.font = "bold 12px Arial";
  ctx.fillText(label, width - pad.right - 5, yVal - 6);
}

/* --------------------------
   Reset
--------------------------- */
function resetAll() {
  state.score = 0;
  state.correct = 0;
  state.streak = 0;

  state.stage1Solved = false;
  state.stage1Order = [];

  state.definitionRound = 1;
  state.definitionStreak = 0;
  state.definitionCurrent = null;

  state.difficulty = 1;
  state.stage3Attempts = 0;
  state.stage3SolvedCount = 0;
  state.stage3Scenario = null;
  state.stage3Answer = "";
  state.calcPassed = false;

  document.querySelectorAll(".difficulty-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelector('.difficulty-btn[data-level="1"]').classList.add("active");

  buildStage1();
  loadDefinition();
  generateScenario();
  updateScoreboard();
  updateMastery();
}