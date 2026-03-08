const bank = [
  {
    id: "xbar",
    title: "Sample Mean",
    symbolLatex: "\\( \\bar{X} \\)",
    note: "This is the mean of one sample of n units.",
    definitionParts: [
      { type: "text", value: "is the" },
      { type: "select", answer: "Mean", options: ["Mean", "Limit", "Range", "Sum"] },
      { type: "text", value: "of a sample of" },
      { type: "select", answer: "n", options: ["m", "n", "p", "3"] },
      { type: "text", value: "units" }
    ],
    slots: [
      { answerId: "lhs_xbar", label: "left side" },
      { answerId: "equals", label: "=" },
      { answerId: "frac_sample_sum", label: "sample sum over n" }
    ],
    tiles: [
      {
        id: "lhs_xbar",
        text: "X-bar",
        readable: "X-bar",
        latex: "\\bar{X}"
      },
      {
        id: "equals",
        text: "=",
        readable: "=",
        latex: "="
      },
      {
        id: "frac_sample_sum",
        text: "(x₁ + x₂ + ... + xₙ) / n",
        readable: "(x₁ + x₂ + ... + xₙ) / n",
        latex: "\\frac{x_{(1)} + x_{(2)} + \\cdots + x_{(n)}}{n}"
      },
      {
        id: "lhs_xdoublebar",
        text: "X-double-bar",
        readable: "X-double-bar",
        latex: "\\bar{\\bar{X}}"
      },
      {
        id: "frac_sample_means",
        text: "(X̄₁ + X̄₂ + ... + X̄ₘ) / m",
        readable: "(X̄₁ + X̄₂ + ... + X̄ₘ) / m",
        latex: "\\frac{\\bar{X}_{(1)} + \\bar{X}_{(2)} + \\cdots + \\bar{X}_{(m)}}{m}"
      }
    ]
  },
  {
    id: "xdoublebar",
    title: "Average of Sample Means",
    symbolLatex: "\\( \\bar{\\bar{X}} \\)",
    note: "This is the average of a set of m sample averages.",
    definitionParts: [
      { type: "text", value: "is the" },
      { type: "select", answer: "Average", options: ["Average", "Sum", "Upper limit", "Deviation"] },
      { type: "text", value: "of a set of" },
      { type: "select", answer: "m", options: ["n", "m", "p", "1"] },
      { type: "text", value: "sample averages" }
    ],
    slots: [
      { answerId: "lhs_xdoublebar", label: "left side" },
      { answerId: "equals", label: "=" },
      { answerId: "frac_sample_means", label: "average of sample means" }
    ],
    tiles: [
      {
        id: "lhs_xdoublebar",
        text: "X-double-bar",
        readable: "X-double-bar",
        latex: "\\bar{\\bar{X}}"
      },
      {
        id: "equals",
        text: "=",
        readable: "=",
        latex: "="
      },
      {
        id: "frac_sample_means",
        text: "(X̄₁ + X̄₂ + ... + X̄ₘ) / m",
        readable: "(X̄₁ + X̄₂ + ... + X̄ₘ) / m",
        latex: "\\frac{\\bar{X}_{(1)} + \\bar{X}_{(2)} + \\cdots + \\bar{X}_{(m)}}{m}"
      },
      {
        id: "frac_sample_sum",
        text: "(x₁ + x₂ + ... + xₙ) / n",
        readable: "(x₁ + x₂ + ... + xₙ) / n",
        latex: "\\frac{x_{(1)} + x_{(2)} + \\cdots + x_{(n)}}{n}"
      },
      {
        id: "lhs_esd",
        text: "ESD of X-bar",
        readable: "ESD of X-bar",
        latex: "ESD_{(\\bar{X})}"
      }
    ]
  },
  {
    id: "esd",
    title: "Estimated Standard Deviation of Sample Means",
    symbolLatex: "\\( ESD_{(\\bar{X})} \\)",
    note: "This is the estimated standard deviation of the X-bar sample means.",
    definitionParts: [
      { type: "text", value: "is the" },
      {
        type: "select",
        answer: "Estimated Standard Deviation",
        options: ["Estimated Standard Deviation", "Upper Control Limit", "Process Average", "Lower Control Limit"]
      },
      { type: "text", value: "of" },
      {
        type: "select",
        answer: "X̄",
        options: ["X̄", "UCL", "LCL", "m"]
      },
      { type: "text", value: "sample means" }
    ],
    slots: [
      { answerId: "lhs_esd", label: "left side" },
      { answerId: "equals", label: "=" },
      { answerId: "frac_sd_over_rootn", label: "std. dev. all parts over root n" }
    ],
    tiles: [
      {
        id: "lhs_esd",
        text: "ESD of X-bar",
        readable: "ESD of X-bar",
        latex: "ESD_{(\\bar{X})}"
      },
      {
        id: "equals",
        text: "=",
        readable: "=",
        latex: "="
      },
      {
        id: "frac_sd_over_rootn",
        text: "standard deviation of all parts / √n",
        readable: "standard deviation of all parts / √n",
        latex: "\\frac{\\text{standard deviation all parts}}{\\sqrt{n}}"
      },
      {
        id: "ucl_formula_rhs",
        text: "X-double-bar + 3(ESD of X-bar)",
        readable: "X-double-bar + 3(ESD of X-bar)",
        latex: "\\bar{\\bar{X}} + 3\\left(ESD_{(\\bar{X})}\\right)"
      },
      {
        id: "lcl_formula_rhs",
        text: "X-double-bar - 3(ESD of X-bar)",
        readable: "X-double-bar - 3(ESD of X-bar)",
        latex: "\\bar{\\bar{X}} - 3\\left(ESD_{(\\bar{X})}\\right)"
      }
    ]
  },
  {
    id: "ucl",
    title: "Upper Control Limit",
    symbolLatex: "\\( UCL \\)",
    note: "This is the upper control limit for the X-chart.",
    definitionParts: [
      { type: "text", value: "is the" },
      {
        type: "select",
        answer: "Upper control limit",
        options: ["Upper control limit", "Lower control limit", "Average of sample means", "Sample mean"]
      }
    ],
    slots: [
      { answerId: "lhs_ucl", label: "left side" },
      { answerId: "equals", label: "=" },
      { answerId: "ucl_formula_rhs", label: "upper-limit formula" }
    ],
    tiles: [
      {
        id: "lhs_ucl",
        text: "UCL",
        readable: "UCL",
        latex: "UCL"
      },
      {
        id: "equals",
        text: "=",
        readable: "=",
        latex: "="
      },
      {
        id: "ucl_formula_rhs",
        text: "X-double-bar + 3(ESD of X-bar)",
        readable: "X-double-bar + 3(ESD of X-bar)",
        latex: "\\bar{\\bar{X}} + 3\\left(ESD_{(\\bar{X})}\\right)"
      },
      {
        id: "lcl_formula_rhs",
        text: "X-double-bar - 3(ESD of X-bar)",
        readable: "X-double-bar - 3(ESD of X-bar)",
        latex: "\\bar{\\bar{X}} - 3\\left(ESD_{(\\bar{X})}\\right)"
      },
      {
        id: "lhs_lcl",
        text: "LCL",
        readable: "LCL",
        latex: "LCL"
      }
    ]
  },
  {
    id: "lcl",
    title: "Lower Control Limit",
    symbolLatex: "\\( LCL \\)",
    note: "This is the lower control limit for the X-chart.",
    definitionParts: [
      { type: "text", value: "is the" },
      {
        type: "select",
        answer: "Lower control limit",
        options: ["Upper control limit", "Lower control limit", "Sample mean", "Estimated standard deviation"]
      }
    ],
    slots: [
      { answerId: "lhs_lcl", label: "left side" },
      { answerId: "equals", label: "=" },
      { answerId: "lcl_formula_rhs", label: "lower-limit formula" }
    ],
    tiles: [
      {
        id: "lhs_lcl",
        text: "LCL",
        readable: "LCL",
        latex: "LCL"
      },
      {
        id: "equals",
        text: "=",
        readable: "=",
        latex: "="
      },
      {
        id: "lcl_formula_rhs",
        text: "X-double-bar - 3(ESD of X-bar)",
        readable: "X-double-bar - 3(ESD of X-bar)",
        latex: "\\bar{\\bar{X}} - 3\\left(ESD_{(\\bar{X})}\\right)"
      },
      {
        id: "ucl_formula_rhs",
        text: "X-double-bar + 3(ESD of X-bar)",
        readable: "X-double-bar + 3(ESD of X-bar)",
        latex: "\\bar{\\bar{X}} + 3\\left(ESD_{(\\bar{X})}\\right)"
      },
      {
        id: "lhs_ucl",
        text: "UCL",
        readable: "UCL",
        latex: "UCL"
      }
    ]
  }
];

let currentIndex = 0;
let correctCount = 0;
let attemptCount = 0;
let formulaSelections = [];

const termTitle = document.getElementById("termTitle");
const termSymbol = document.getElementById("termSymbol");
const termNote = document.getElementById("termNote");
const definitionBox = document.getElementById("definitionBox");
const formulaSlots = document.getElementById("formulaSlots");
const tileBank = document.getElementById("tileBank");
const readablePreview = document.getElementById("readablePreview");
const latexPreview = document.getElementById("latexPreview");
const correctCountEl = document.getElementById("correctCount");
const attemptCountEl = document.getElementById("attemptCount");
const definitionFeedback = document.getElementById("definitionFeedback");
const formulaFeedback = document.getElementById("formulaFeedback");
const finalFeedback = document.getElementById("finalFeedback");

document.getElementById("checkBtn").addEventListener("click", checkAnswer);
document.getElementById("nextBtn").addEventListener("click", nextTerm);
document.getElementById("resetBtn").addEventListener("click", renderCurrent);
document.getElementById("undoBtn").addEventListener("click", undoTile);
document.getElementById("clearFormulaBtn").addEventListener("click", clearFormula);

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function setFeedback(el, msg, type) {
  el.textContent = msg;
  el.className = `feedback ${type}`;
}

function setFinalFeedback(msg, type) {
  finalFeedback.textContent = msg;
  finalFeedback.className = `final-feedback ${type}`;
}

function clearFeedbacks() {
  definitionFeedback.className = "feedback";
  formulaFeedback.className = "feedback";
  finalFeedback.className = "final-feedback";
  definitionFeedback.textContent = "";
  formulaFeedback.textContent = "";
  finalFeedback.textContent = "";
}

function renderCurrent() {
  clearFeedbacks();
  formulaSelections = [];

  const item = bank[currentIndex];
  termTitle.textContent = item.title;
  termSymbol.innerHTML = item.symbolLatex;
  termNote.textContent = item.note;

  renderDefinition(item);
  renderSlots(item);
  renderTileBank(item);
  updatePreviews();

  MathJax.typesetPromise();
}

function renderDefinition(item) {
  definitionBox.innerHTML = "";

  item.definitionParts.forEach((part, index) => {
    if (part.type === "text") {
      const span = document.createElement("span");
      span.className = "chunk";
      span.textContent = part.value;
      definitionBox.appendChild(span);
    } else {
      const select = document.createElement("select");
      select.dataset.kind = "definition";
      select.dataset.index = index;

      const first = document.createElement("option");
      first.value = "";
      first.textContent = "Choose...";
      select.appendChild(first);

      shuffle(part.options).forEach(option => {
        const opt = document.createElement("option");
        opt.value = option;
        opt.textContent = option;
        select.appendChild(opt);
      });

      definitionBox.appendChild(select);
    }
  });
}

function renderSlots(item) {
  formulaSlots.innerHTML = "";

  item.slots.forEach((slot, index) => {
    const div = document.createElement("div");
    div.className = "slot";
    div.id = `slot-${index}`;
    div.textContent = `Slot ${index + 1}: ${slot.label}`;
    formulaSlots.appendChild(div);
  });
}

function renderTileBank(item) {
  tileBank.innerHTML = "";

  shuffle(item.tiles).forEach(tile => {
    const btn = document.createElement("button");
    btn.className = "tile";
    btn.type = "button";
    btn.textContent = tile.text;
    btn.addEventListener("click", () => addTile(tile.id));
    tileBank.appendChild(btn);
  });
}

function addTile(tileId) {
  const item = bank[currentIndex];
  if (formulaSelections.length >= item.slots.length) return;

  formulaSelections.push(tileId);
  renderFilledSlots();
  updatePreviews();
}

function undoTile() {
  if (formulaSelections.length === 0) return;
  formulaSelections.pop();
  renderFilledSlots();
  updatePreviews();
}

function clearFormula() {
  formulaSelections = [];
  renderFilledSlots();
  updatePreviews();
}

function renderFilledSlots() {
  const item = bank[currentIndex];

  item.slots.forEach((slot, index) => {
    const slotEl = document.getElementById(`slot-${index}`);
    const chosenId = formulaSelections[index];

    if (!chosenId) {
      slotEl.className = "slot";
      slotEl.textContent = `Slot ${index + 1}: ${slot.label}`;
      return;
    }

    const tile = item.tiles.find(t => t.id === chosenId);
    slotEl.className = "slot filled";
    slotEl.textContent = tile ? tile.text : `Slot ${index + 1}`;
  });
}

function updatePreviews() {
  const item = bank[currentIndex];
  const readableParts = [];
  const latexParts = [];

  item.slots.forEach((slot, index) => {
    const chosenId = formulaSelections[index];
    const tile = item.tiles.find(t => t.id === chosenId);

    if (tile) {
      readableParts.push(tile.readable);
      latexParts.push(tile.latex);
    } else {
      readableParts.push("□");
      latexParts.push("\\square");
    }
  });

  readablePreview.textContent = readableParts.join(" ");
  latexPreview.innerHTML = `\$begin:math:display$ \$\{latexParts\.join\(\" \"\)\} \\$end:math:display$`;
  MathJax.typesetPromise([latexPreview]);
}

function checkDefinition(item) {
  let ok = true;

  item.definitionParts.forEach((part, index) => {
    if (part.type === "select") {
      const select = definitionBox.querySelector(`select[data-kind="definition"][data-index="${index}"]`);
      if (!select || select.value !== part.answer) ok = false;
    }
  });

  if (ok) {
    setFeedback(definitionFeedback, "Definition is correct.", "success");
  } else {
    setFeedback(definitionFeedback, "Definition is not correct yet. Recheck the blanks.", "error");
  }

  return ok;
}

function checkFormula(item) {
  const expected = item.slots.map(s => s.answerId);
  const ok = JSON.stringify(formulaSelections) === JSON.stringify(expected);

  if (ok) {
    setFeedback(formulaFeedback, "Formula is correct.", "success");
  } else {
    setFeedback(formulaFeedback, "Formula is not correct yet. Rebuild it in the correct order.", "error");
  }

  return ok;
}

function checkAnswer() {
  const item = bank[currentIndex];
  attemptCount += 1;
  attemptCountEl.textContent = attemptCount;

  const defOk = checkDefinition(item);
  const formulaOk = checkFormula(item);

  if (defOk && formulaOk) {
    correctCount += 1;
    correctCountEl.textContent = correctCount;
    setFinalFeedback("Excellent. You correctly rebuilt both the definition and the formula.", "success");
  } else {
    setFinalFeedback("Not yet. Fix the incorrect part and check again.", "error");
  }
}

function nextTerm() {
  currentIndex = (currentIndex + 1) % bank.length;
  renderCurrent();
}

renderCurrent();