const cards = document.querySelectorAll(".drag-card");
const zones = document.querySelectorAll(".drop-zone");
const cardBank = document.getElementById("cardBank");
const checkBtn = document.getElementById("checkBtn");
const resetBtn = document.getElementById("resetBtn");
const scoreBox = document.getElementById("scoreBox");

let draggedCard = null;

function attachCardEvents(card) {
  card.addEventListener("dragstart", () => {
    draggedCard = card;
    setTimeout(() => {
      card.classList.add("hide-me");
    }, 0);
  });

  card.addEventListener("dragend", () => {
    card.classList.remove("hide-me");
    draggedCard = null;
  });
}

cards.forEach(attachCardEvents);

function clearZoneStates() {
  zones.forEach(zone => {
    zone.classList.remove("correct", "incorrect", "over");
  });
}

zones.forEach(zone => {
  zone.addEventListener("dragover", e => {
    e.preventDefault();
    zone.classList.add("over");
  });

  zone.addEventListener("dragleave", () => {
    zone.classList.remove("over");
  });

  zone.addEventListener("drop", e => {
    e.preventDefault();
    zone.classList.remove("over");

    if (!draggedCard) return;

    const existingCard = zone.querySelector(".drag-card");
    if (existingCard) {
      cardBank.appendChild(existingCard);
    }

    zone.appendChild(draggedCard);
    clearZoneStates();
    scoreBox.textContent = "";
  });
});

cardBank.addEventListener("dragover", e => {
  e.preventDefault();
});

cardBank.addEventListener("drop", e => {
  e.preventDefault();
  if (!draggedCard) return;
  cardBank.appendChild(draggedCard);
  clearZoneStates();
  scoreBox.textContent = "";
});

checkBtn.addEventListener("click", () => {
  let correct = 0;

  zones.forEach(zone => {
    zone.classList.remove("correct", "incorrect");

    const card = zone.querySelector(".drag-card");
    const expected = zone.dataset.zone;

    if (!card) {
      zone.classList.add("incorrect");
      return;
    }

    if (card.dataset.match === expected) {
      zone.classList.add("correct");
      correct++;
    } else {
      zone.classList.add("incorrect");
    }
  });

  const total = zones.length;

  if (correct === total) {
    scoreBox.textContent = `Excellent: ${correct} of ${total} correct. You rebuilt the SPC framework.`;
  } else {
    scoreBox.textContent = `Score: ${correct} of ${total} correct. Fix the red zones and check again.`;
  }
});

resetBtn.addEventListener("click", () => {
  const placedCards = document.querySelectorAll(".drop-zone .drag-card");
  placedCards.forEach(card => cardBank.appendChild(card));
  clearZoneStates();
  scoreBox.textContent = "";
});