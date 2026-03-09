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
      { answerId: "equals", label: "equals sign" },
      { answerId: "rhs_sample_mean", label: "sample mean formula" }
    ],
    choicesBySlot: {
      0: [
        { id: "lhs_xbar", text: "X-bar", readable: "X-bar", latex: "\\bar{X}" },
        { id: "lhs_xdoublebar", text: "X-double-bar", readable: "X-double-bar", latex: "\\bar{\\bar{X}}" },
        { id: "lhs_esd", text: "ESD of X-bar", readable: "ESD of X-bar", latex: "ESD_{(\\bar{X})}" }
      ],
      1: [
        { id: "equals", text: "=", readable: "=", latex: "=" },
        { id: "plus", text: "+", readable: "+", latex: "+" },
        { id: "minus", text: "-", readable: "-", latex: "-" }
      ],
      2: [
        {
          id: "rhs_sample_mean",
          text: "(x₁ + x₂ + ... + xₙ) / n",
          readable: "(x₁ + x₂ + ... + xₙ) / n",
          latex: "\\frac{x_{(1)} + x_{(2)} + \\cdots + x_{(n)}}{n}"
        },
        {
          id: "rhs_sample_means_avg",
          text: "(X̄₁ + X̄₂ + ... + X̄ₘ) / m",
          readable: "(X̄₁ + X̄₂ + ... + X̄ₘ) / m",
          latex: "\\frac{\\bar{X}_{(1)} + \\bar{X}_{(2)} + \\cdots + \\bar{X}_{(m)}}{m}"
        }
      ]
    }
  },
  {
    id: "xdoublebar",
    title: "Average of Sample Means",
    symbolLatex: "\\( \\bar{\\bar{X}} \\)",
    note: "This is the mean of m sample means.",
    definitionParts: [
      { type: "text", value: "is the" },
      { type: "select", answer: "Average", options: ["Average", "Sum", "Upper limit", "Deviation"] },
      { type: "text", value: "of a set of" },
      { type: "select", answer: "m", options: ["n", "m", "p", "1"] },
      { type: "text", value: "sample averages" }
    ],
    slots: [
      { answerId: "lhs_xdoublebar", label: "left side" },
      { answerId: "equals", label: "equals sign" },
      { answerId: "rhs_sample_means_avg", label: "mean of m sample means" }
    ],
    choicesBySlot: {
      0: [
        { id: "lhs_xdoublebar", text: "X-double-bar", readable: "X-double-bar", latex: "\\bar{\\bar{X}}" },
        { id: "lhs_xbar", text: "X-bar", readable: "X-bar", latex: "\\bar{X}" },
        { id: "lhs_ucl", text: "UCL", readable: "UCL", latex: "UCL" }
      ],
      1: [
        { id: "equals", text: "=", readable: "=", latex: "=" },
        { id: "plus", text: "+", readable: "+", latex: "+" },
        { id: "minus", text: "-", readable: "-", latex: "-" }
      ],
      2: [
        {
          id: "rhs_sample_means_avg",
          text: "(X̄₁ + X̄₂ + ... + X̄ₘ) / m",
          readable: "(X̄₁ + X̄₂ + ... + X̄ₘ) / m",
          latex: "\\frac{\\bar{X}_{(1)} + \\bar{X}_{(2)} + \\cdots + \\bar{X}_{(m)}}{m}"
        },
        {
          id: "rhs_sample_mean",
          text: "(x₁ + x₂ + ... + xₙ) / n",
          readable: "(x₁ + x₂ + ... + xₙ) / n",
          latex: "\\frac{x_{(1)} + x_{(2)} + \\cdots + x_{(n)}}{n}"
        }
      ]
    }
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
      { type: "select", answer: "X̄", options: ["X̄", "UCL", "LCL", "m"] },
      { type: "text", value: "sample means" }
    ],
    slots: [
      { answerId: "lhs_esd", label: "left side" },
      { answerId: "equals", label: "equals sign" },
      { answerId: "rhs_esd", label: "estimated standard deviation formula" }
    ],
    choicesBySlot: {
      0: [
        { id: "lhs_esd", text: "ESD of X-bar", readable: "ESD of X-bar", latex: "ESD_{(\\bar{X})}" },
        { id: "lhs_xbar", text: "X-bar", readable: "X-bar", latex: "\\bar{X}" },
        { id: "lhs_lcl", text: "LCL", readable: "LCL", latex: "LCL" }
      ],
      1: [
        { id: "equals", text: "=", readable: "=", latex: "=" },
        { id: "plus", text: "+", readable: "+", latex: "+" }
      ],
      2: [
        {
          id: "rhs_esd",
          text: "standard deviation of all parts / √n",
          readable: "standard deviation of all parts / √n",
          latex: "\\frac{\\text{standard deviation of all parts}}{\\sqrt{n}}"
        },
        {
          id: "rhs_ucl",
          text: "X-double-bar + 3(ESD of X-bar)",
          readable: "X-double-bar + 3(ESD of X-bar)",
          latex: "\\bar{\\bar{X}} + 3\\left(ESD_{(\\bar{X})}\\right)"
        }
      ]
    }
  },
  {
    id: "ucl",
    title: "Upper Control Limit",
    symbolLatex: "\\( UCL \\)",
    note: "This is the upper control limit.",
    definitionParts: [
      { type: "text", value: "is the" },
      { type: "select", answer: "Upper control limit", options: ["Upper control limit", "Lower control limit", "Sample mean", "Average of sample means"] }
    ],
    slots: [
      { answerId: "lhs_ucl", label: "left side" },
      { answerId: "equals", label: "equals sign" },
      { answerId: "rhs_ucl", label: "upper control limit formula" }
    ],
    choicesBySlot: {
      0: [
        { id: "lhs_ucl", text: "UCL", readable: "UCL", latex: "UCL" },
        { id: "lhs_lcl", text: "LCL", readable: "LCL", latex: "LCL" }
      ],
      1: [
        { id: "equals", text: "=", readable: "=", latex: "=" }
      ],
      2: [
        {
          id: "rhs_ucl",
          text: "X-double-bar + 3(ESD of X-bar)",
          readable: "X-double-bar + 3(ESD of X-bar)",
          latex: "\\bar{\\bar{X}} + 3\\left(ESD_{(\\bar{X})}\\right)"
        },
        {
          id: "rhs_lcl",
          text: "X-double-bar - 3(ESD of X-bar)",
          readable: "X-double-bar - 3(ESD of X-bar)",
          latex: "\\bar{\\bar{X}} - 3\\left(ESD_{(\\bar{X})}\\right)"
        }
      ]
    }
  },
  {
    id: "lcl",
    title: "Lower Control Limit",
    symbolLatex: "\\( LCL \\)",
    note: "This is the lower control limit.",
    definitionParts: [
      { type: "text", value: "is the" },
      { type: "select", answer: "Lower control limit", options: ["Upper control limit", "Lower control limit", "Sample mean", "Estimated standard deviation"] }
    ],
    slots: [
      { answerId: "lhs_lcl", label: "left side" },
      { answerId: "equals", label: "equals sign" },
      { answerId: "rhs_lcl", label: "lower control limit formula" }
    ],
    choicesBySlot: {
      0: [
        { id: "lhs_lcl", text: "LCL", readable: "LCL", latex: "LCL" },
        { id: "lhs_ucl", text: "UCL", readable: "UCL", latex: "UCL" }
      ],
      1: [
        { id: "equals", text: "=", readable: "=", latex: "=" }
      ],
      2: [
        {
          id: "rhs_lcl",
          text: "X-double-bar - 3(ESD of X-bar)",
          readable: "X-double-bar - 3(ESD of X-bar)",
          latex: "\\bar{\\bar{X}} - 3\\left(ESD_{(\\bar{X})}\\right)"
        },
        {
          id: "rhs_ucl",
          text: "X-double-bar + 3(ESD of X-bar)",
          readable: "X-double-bar + 3(ESD of X-bar)",
          latex: "\\bar{\\bar{X}} + 3\\left(ESD_{(\\bar{X})}\\right)"
        }
      ]
    }
  }
];

let currentIndex = 0;
let correctCount = 0;
let attemptCount = 0;
let formulaSelections = [];
let activeSlotIndex = null;

const termTitle = document.getElementById("termTitle");
const termSymbol = document.getElementById("termSymbol");
const termNote = document.getElementById("termNote");
const definitionBox = document.getElementById("definitionBox");
const formulaSlots = document.getElementById("formulaSlots");
const choiceBank = document.getElementById("choiceBank");
const activeSlotIndicator = document.getElementById("activeSlotIndicator");
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
  activeSlotIndex = 0;

  const item = bank[currentIndex];
  termTitle.textContent = item.title;
  termSymbol.innerHTML = item.symbolLatex;
  termNote.textContent = item.note;

  renderDefinition(item);
  renderSlots(item);
  renderChoices(item, activeSlotIndex);
  updatePreviews();
  updateActiveIndicator();

  safeTypeset([termSymbol, latexPreview]);
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
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "slot";
    btn.id = `slot-${index}`;

    const chosenId = formulaSelections[index];
    const slotChoices = item.choicesBySlot[index] || [];
    const chosenChoice = slotChoices.find(c => c.id === chosenId);

    if (chosenChoice) {
      btn.classList.add("filled");
      btn.textContent = chosenChoice.text;
    } else {
      btn.textContent = `Slot ${index + 1}: ${slot.label}`;
    }

    if (activeSlotIndex === index) {
      btn.classList.add("active");
    }

    btn.addEventListener("click", () => {
      activeSlotIndex = index;
      renderSlots(item);
      renderChoices(item, activeSlotIndex);
      updateActiveIndicator();
    });

    formulaSlots.appendChild(btn);
  });
}

function renderChoices(item, slotIndex) {
  choiceBank.innerHTML = "";

  if (slotIndex === null || slotIndex === undefined) return;

  const slotChoices = item.choicesBySlot[slotIndex] || [];

  slotChoices.forEach(choice => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice-btn";
    btn.textContent = choice.text;

    btn.addEventListener("click", () => {
      formulaSelections[slotIndex] = choice.id;

      if (slotIndex < item.slots.length - 1) {
        activeSlotIndex = slotIndex + 1;
      }

      renderSlots(item);
      renderChoices(item, activeSlotIndex);
      updateActiveIndicator();
      updatePreviews();
    });

    choiceBank.appendChild(btn);
  });
}

function updateActiveIndicator() {
  const item = bank[currentIndex];
  if (activeSlotIndex === null || activeSlotIndex === undefined) {
    activeSlotIndicator.textContent = "All slots complete.";
    return;
  }
  activeSlotIndicator.textContent = `Active slot: Slot ${activeSlotIndex + 1} — ${item.slots[activeSlotIndex].label}`;
}

function clearFormula() {
  formulaSelections = [];
  activeSlotIndex = 0;
  renderSlots(bank[currentIndex]);
  renderChoices(bank[currentIndex], activeSlotIndex);
  updateActiveIndicator();
  updatePreviews();
}

function updatePreviews() {
  const item = bank[currentIndex];
  const readableParts = [];
  const latexParts = [];

  item.slots.forEach((slot, index) => {
    const chosenId = formulaSelections[index];
    const choice = item.choicesBySlot[index].find(c => c.id === chosenId);

    if (choice) {
      readableParts.push(choice.readable);
      latexParts.push(choice.latex);
    } else {
      readableParts.push("□");
      latexParts.push("\\Box");
    }
  });

  readablePreview.textContent = readableParts.join(" ");
  latexPreview.innerHTML = `\$begin:math:display$ \$\{latexParts\.join\(\" \"\)\} \\$end:math:display$`;

  safeTypeset([latexPreview]);
}

function safeTypeset(elements) {
  if (!window.MathJax || !window.mathReady) return;
  MathJax.typesetClear(elements);
  MathJax.typesetPromise(elements).catch(err => {
    console.error("MathJax render error:", err);
  });
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
  const expected = item.slots.map(slot => slot.answerId);
  const actual = item.slots.map((slot, index) => formulaSelections[index] || null);

  const ok =
    actual.length === expected.length &&
    actual.every((value, index) => value === expected[index]);

  if (ok) {
    setFeedback(formulaFeedback, "Formula is correct.", "success");
  } else {
    setFeedback(
      formulaFeedback,
      "Formula is not correct yet. Check each slot carefully from left to right.",
      "error"
    );
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