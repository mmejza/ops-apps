"use strict";

const BASE_ACTIVITIES = [
  { id: "A1", time: 9, predecessors: [] },
  { id: "A2", time: 3, predecessors: ["A1"] },
  { id: "A3", time: 11, predecessors: ["A2"] },
  { id: "A4", time: 7, predecessors: ["A2"] },
  { id: "A5", time: 8, predecessors: ["A4"] },
  { id: "A6", time: 6, predecessors: ["A4"] },
  { id: "A7", time: 21, predecessors: ["A3", "A6"] },
  { id: "A8", time: 10, predecessors: ["A3", "A5", "A6"] },
  { id: "A9", time: 15, predecessors: ["A8"] },
  { id: "A10", time: 5, predecessors: ["A7", "A9"] }
];

const NODE_POSITIONS = {
  A1: { x: 30, y: 162 },
  A2: { x: 160, y: 162 },
  A3: { x: 300, y: 78 },
  A4: { x: 300, y: 252 },
  A5: { x: 450, y: 276 },
  A6: { x: 450, y: 162 },
  A7: { x: 610, y: 82 },
  A8: { x: 610, y: 232 },
  A9: { x: 780, y: 232 },
  A10: { x: 900, y: 162 }
};

const MODE_RULES = {
  network: "Network mode: read predecessor-successor relationships and activity durations.",
  forward: "Forward pass rules: ES = largest EF of immediate predecessors, EF = ES + T.",
  backward: "Backward pass rules: LF = smallest LS of immediate successors, LS = LF - T.",
  slack: "Node notation: top row ES | T | EF, middle row activity, bottom row LS | ST | LF. Critical activities have ST = 0."
};

const state = {
  mode: "network",
  selectedActivityId: null,
  sortKey: "id",
  sortDirection: "asc",
  delayActivityId: "A1",
  delayDays: 0
};

const graphTemplate = buildGraphTemplate(BASE_ACTIVITIES);
const baseResults = runCPM(graphTemplate, null, 0);
let currentResults = runCPM(graphTemplate, state.delayActivityId, state.delayDays);

const ui = {
  modeButtons: Array.from(document.querySelectorAll(".mode-btn")),
  modeRule: document.getElementById("mode-rule"),
  networkSvg: document.getElementById("network-svg"),
  nodePanel: document.getElementById("node-panel"),
  tableBody: document.getElementById("cpm-table-body"),
  sortButtons: Array.from(document.querySelectorAll(".th-sort")),
  activitySelect: document.getElementById("activity-select"),
  delayInput: document.getElementById("delay-days"),
  delayMinus: document.getElementById("delay-minus"),
  delayPlus: document.getElementById("delay-plus"),
  resetButton: document.getElementById("reset-btn"),
  copySummaryButton: document.getElementById("copy-summary-btn"),
  diagnostics: document.getElementById("delay-diagnostics"),
  summaryBox: document.getElementById("result-summary"),
  practiceButtons: Array.from(document.querySelectorAll(".check-btn")),
  q1: document.getElementById("q1"),
  q2: document.getElementById("q2"),
  q3: document.getElementById("q3"),
  fb1: document.getElementById("fb-q1"),
  fb2: document.getElementById("fb-q2"),
  fb3: document.getElementById("fb-q3")
};

initialize();

function initialize() {
  state.delayActivityId = BASE_ACTIVITIES[0].id;
  populateDelaySelector();
  bindEvents();
  renderAll();
}

function buildGraphTemplate(baseActivities) {
  const nodes = {};
  const ids = [];

  baseActivities.forEach((activity) => {
    nodes[activity.id] = {
      id: activity.id,
      baseTime: activity.time,
      predecessors: [...activity.predecessors],
      successors: []
    };
    ids.push(activity.id);
  });

  ids.forEach((id) => {
    nodes[id].predecessors.forEach((predId) => {
      nodes[predId].successors.push(id);
    });
  });

  return { ids, nodes };
}

function runCPM(template, delayedId, delayedDays) {
  const nodes = {};
  template.ids.forEach((id) => {
    const baseNode = template.nodes[id];
    const delay = id === delayedId ? delayedDays : 0;
    nodes[id] = {
      id,
      time: baseNode.baseTime + delay,
      predecessors: [...baseNode.predecessors],
      successors: [...baseNode.successors],
      ES: 0,
      EF: 0,
      LS: 0,
      LF: 0,
      slack: 0,
      critical: false
    };
  });

  const topoOrder = topologicalSort(nodes, template.ids);

  topoOrder.forEach((id) => {
    const node = nodes[id];
    const maxPredecessorEF = node.predecessors.length === 0
      ? 0
      : Math.max(...node.predecessors.map((predId) => nodes[predId].EF));

    node.ES = maxPredecessorEF;
    node.EF = node.ES + node.time;
  });

  const projectDuration = Math.max(...topoOrder.map((id) => nodes[id].EF));

  [...topoOrder].reverse().forEach((id) => {
    const node = nodes[id];
    const minSuccessorLS = node.successors.length === 0
      ? projectDuration
      : Math.min(...node.successors.map((succId) => nodes[succId].LS));

    node.LF = minSuccessorLS;
    node.LS = node.LF - node.time;
    node.slack = node.LS - node.ES;
    node.critical = node.slack === 0;
  });

  const criticalEdges = [];
  topoOrder.forEach((id) => {
    const fromNode = nodes[id];
    fromNode.successors.forEach((succId) => {
      const toNode = nodes[succId];
      const isCriticalEdge = fromNode.critical && toNode.critical && toNode.ES === fromNode.EF;
      if (isCriticalEdge) {
        criticalEdges.push({ from: id, to: succId });
      }
    });
  });

  const criticalPath = findOneCriticalPath(nodes, topoOrder, criticalEdges, projectDuration);

  return {
    nodes,
    topoOrder,
    projectDuration,
    criticalEdges,
    criticalPath
  };
}

function topologicalSort(nodes, ids) {
  const indegree = {};
  ids.forEach((id) => {
    indegree[id] = nodes[id].predecessors.length;
  });

  const queue = ids.filter((id) => indegree[id] === 0);
  const order = [];

  while (queue.length > 0) {
    const current = queue.shift();
    order.push(current);

    nodes[current].successors.forEach((succId) => {
      indegree[succId] -= 1;
      if (indegree[succId] === 0) {
        queue.push(succId);
      }
    });
  }

  if (order.length !== ids.length) {
    throw new Error("The activity graph contains a cycle; CPM requires a DAG.");
  }

  return order;
}

function findOneCriticalPath(nodes, topoOrder, criticalEdges, projectDuration) {
  const criticalAdj = {};
  criticalEdges.forEach((edge) => {
    if (!criticalAdj[edge.from]) {
      criticalAdj[edge.from] = [];
    }
    criticalAdj[edge.from].push(edge.to);
  });

  const starts = topoOrder.filter(
    (id) => nodes[id].critical && nodes[id].predecessors.length === 0
  );

  let bestPath = [];

  function dfs(currentId, path) {
    const nextNodes = criticalAdj[currentId] || [];

    if (nextNodes.length === 0) {
      const currentNode = nodes[currentId];
      if (currentNode.EF === projectDuration && path.length > bestPath.length) {
        bestPath = [...path];
      }
      return;
    }

    nextNodes.forEach((nextId) => {
      dfs(nextId, [...path, nextId]);
    });
  }

  starts.forEach((startId) => {
    dfs(startId, [startId]);
  });

  if (bestPath.length === 0) {
    return topoOrder
      .filter((id) => nodes[id].critical)
      .sort((a, b) => nodes[a].ES - nodes[b].ES);
  }

  return bestPath;
}

function bindEvents() {
  ui.modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.mode = button.dataset.mode;
      renderAll();
    });
  });

  ui.sortButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const requestedKey = button.dataset.sort;
      if (state.sortKey === requestedKey) {
        state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
      } else {
        state.sortKey = requestedKey;
        state.sortDirection = "asc";
      }
      renderTable();
    });
  });

  ui.activitySelect.addEventListener("change", () => {
    state.delayActivityId = ui.activitySelect.value;
    recomputeAndRender();
  });

  ui.delayInput.addEventListener("input", () => {
    const parsed = normalizeDelayDays(ui.delayInput.value);
    state.delayDays = parsed;
    ui.delayInput.value = parsed;
    recomputeAndRender();
  });

  ui.delayMinus.addEventListener("click", () => {
    state.delayDays = Math.max(0, state.delayDays - 1);
    ui.delayInput.value = state.delayDays;
    recomputeAndRender();
  });

  ui.delayPlus.addEventListener("click", () => {
    state.delayDays += 1;
    ui.delayInput.value = state.delayDays;
    recomputeAndRender();
  });

  ui.resetButton.addEventListener("click", resetAppState);

  ui.copySummaryButton.addEventListener("click", async () => {
    const text = ui.summaryBox.textContent || "";
    try {
      await navigator.clipboard.writeText(text);
      ui.copySummaryButton.textContent = "Copied";
      setTimeout(() => {
        ui.copySummaryButton.textContent = "Copy Result Summary";
      }, 1200);
    } catch (_error) {
      ui.copySummaryButton.textContent = "Copy Unavailable";
      setTimeout(() => {
        ui.copySummaryButton.textContent = "Copy Result Summary";
      }, 1600);
    }
  });

  ui.practiceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      checkPracticeQuestion(button.dataset.question);
    });
  });
}

function resetAppState() {
  state.mode = "network";
  state.selectedActivityId = null;
  state.sortKey = "id";
  state.sortDirection = "asc";
  state.delayActivityId = BASE_ACTIVITIES[0].id;
  state.delayDays = 0;

  ui.activitySelect.value = state.delayActivityId;
  ui.delayInput.value = "0";

  [ui.q1, ui.q2, ui.q3].forEach((input) => {
    input.value = "";
  });
  [ui.fb1, ui.fb2, ui.fb3].forEach((feedback) => {
    feedback.textContent = "";
    feedback.className = "feedback";
  });

  recomputeAndRender();
}

function normalizeDelayDays(value) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }
  return parsed;
}

function populateDelaySelector() {
  ui.activitySelect.innerHTML = "";
  BASE_ACTIVITIES.forEach((activity) => {
    const option = document.createElement("option");
    option.value = activity.id;
    option.textContent = activity.id;
    ui.activitySelect.appendChild(option);
  });
  ui.activitySelect.value = state.delayActivityId;
}

function recomputeAndRender() {
  currentResults = runCPM(graphTemplate, state.delayActivityId, state.delayDays);
  renderAll();
}

function renderAll() {
  updateModeButtons();
  updateRuleBox();
  renderNetwork();
  renderNodePanel();
  renderTable();
  renderDelayAnalysis();
}

function updateModeButtons() {
  ui.modeButtons.forEach((button) => {
    const isActive = button.dataset.mode === state.mode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", isActive ? "true" : "false");
  });
}

function updateRuleBox() {
  ui.modeRule.textContent = MODE_RULES[state.mode];
}

function renderNetwork() {
  const svg = ui.networkSvg;
  svg.innerHTML = "";

  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  defs.innerHTML = `
    <marker id="arrow-muted" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#95abc9"></path>
    </marker>
    <marker id="arrow-critical" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#b3252d"></path>
    </marker>
  `;
  svg.appendChild(defs);

  const nodeWidth = state.mode === "slack" ? 142 : 110;
  const nodeHeight = state.mode === "slack" ? 96 : 68;

  Object.values(currentResults.nodes).forEach((node) => {
    node.successors.forEach((succId) => {
      const target = currentResults.nodes[succId];
      const from = NODE_POSITIONS[node.id];
      const to = NODE_POSITIONS[succId];

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", String(from.x + nodeWidth));
      line.setAttribute("y1", String(from.y + nodeHeight / 2));
      line.setAttribute("x2", String(to.x));
      line.setAttribute("y2", String(to.y + nodeHeight / 2));

      const isCriticalEdge = currentResults.criticalEdges.some(
        (edge) => edge.from === node.id && edge.to === succId
      );
      const highlightCritical = state.mode === "slack" && isCriticalEdge;

      line.setAttribute("class", highlightCritical ? "edge critical" : "edge");
      line.setAttribute("marker-end", highlightCritical ? "url(#arrow-critical)" : "url(#arrow-muted)");
      svg.appendChild(line);
    });
  });

  currentResults.topoOrder.forEach((id) => {
    const node = currentResults.nodes[id];
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const { x, y } = NODE_POSITIONS[id];
    group.setAttribute("transform", `translate(${x},${y})`);
    group.setAttribute("class", buildNodeClass(id));
    group.setAttribute("role", "button");
    group.setAttribute("tabindex", "0");
    group.setAttribute("aria-label", `${id} activity node`);

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("class", "node-box");
    rect.setAttribute("x", "0");
    rect.setAttribute("y", "0");
    rect.setAttribute("width", String(nodeWidth));
    rect.setAttribute("height", String(nodeHeight));
    group.appendChild(rect);

    if (state.mode === "network") {
      addText(group, id, nodeWidth / 2, 24, "node-text");
      addText(group, `T = ${node.time}`, nodeWidth / 2, 46, "node-sub");
    } else if (state.mode === "forward") {
      addText(group, `ES ${node.ES}`, 30, 20, "node-sub");
      addText(group, `EF ${node.EF}`, nodeWidth - 30, 20, "node-sub");
      addText(group, id, nodeWidth / 2, 38, "node-text");
      addText(group, `T ${node.time}`, nodeWidth / 2, 55, "node-sub");
    } else if (state.mode === "backward") {
      addText(group, `LS ${node.LS}`, 30, 20, "node-sub");
      addText(group, `LF ${node.LF}`, nodeWidth - 30, 20, "node-sub");
      addText(group, id, nodeWidth / 2, 38, "node-text");
      addText(group, `T ${node.time}`, nodeWidth / 2, 55, "node-sub");
    } else {
      addNotationGrid(group, node, nodeWidth, nodeHeight);
    }

    group.addEventListener("click", () => {
      state.selectedActivityId = id;
      renderNetwork();
      renderNodePanel();
    });

    group.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        state.selectedActivityId = id;
        renderNetwork();
        renderNodePanel();
      }
    });

    svg.appendChild(group);
  });
}

function addNotationGrid(group, node, width, height) {
  const topY = 30;
  const bottomY = 67;
  const col1 = width / 3;
  const col2 = (2 * width) / 3;

  const topDivider = document.createElementNS("http://www.w3.org/2000/svg", "line");
  topDivider.setAttribute("x1", "0");
  topDivider.setAttribute("y1", String(topY));
  topDivider.setAttribute("x2", String(width));
  topDivider.setAttribute("y2", String(topY));
  topDivider.setAttribute("stroke", "#a6bddb");
  topDivider.setAttribute("stroke-width", "1");
  group.appendChild(topDivider);

  const bottomDivider = document.createElementNS("http://www.w3.org/2000/svg", "line");
  bottomDivider.setAttribute("x1", "0");
  bottomDivider.setAttribute("y1", String(bottomY));
  bottomDivider.setAttribute("x2", String(width));
  bottomDivider.setAttribute("y2", String(bottomY));
  bottomDivider.setAttribute("stroke", "#a6bddb");
  bottomDivider.setAttribute("stroke-width", "1");
  group.appendChild(bottomDivider);

  [col1, col2].forEach((colX) => {
    const topCol = document.createElementNS("http://www.w3.org/2000/svg", "line");
    topCol.setAttribute("x1", String(colX));
    topCol.setAttribute("y1", "0");
    topCol.setAttribute("x2", String(colX));
    topCol.setAttribute("y2", String(topY));
    topCol.setAttribute("stroke", "#a6bddb");
    topCol.setAttribute("stroke-width", "1");
    group.appendChild(topCol);

    const bottomCol = document.createElementNS("http://www.w3.org/2000/svg", "line");
    bottomCol.setAttribute("x1", String(colX));
    bottomCol.setAttribute("y1", String(bottomY));
    bottomCol.setAttribute("x2", String(colX));
    bottomCol.setAttribute("y2", String(height));
    bottomCol.setAttribute("stroke", "#a6bddb");
    bottomCol.setAttribute("stroke-width", "1");
    group.appendChild(bottomCol);
  });

  addText(group, String(node.ES), width / 6, 16, "node-sub");
  addText(group, String(node.time), width / 2, 16, "node-sub");
  addText(group, String(node.EF), (5 * width) / 6, 16, "node-sub");

  addText(group, node.id, width / 2, 48, "node-text");

  addText(group, String(node.LS), width / 6, 81, "node-sub");
  addText(group, String(node.slack), width / 2, 81, "node-sub");
  addText(group, String(node.LF), (5 * width) / 6, 81, "node-sub");
}

function addText(group, text, x, y, className) {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
  t.setAttribute("x", String(x));
  t.setAttribute("y", String(y));
  t.setAttribute("class", className);
  t.textContent = text;
  group.appendChild(t);
}

function buildNodeClass(id) {
  const classes = ["node-group"];
  if (state.selectedActivityId === id) {
    classes.push("is-selected");
  }
  if (state.mode === "slack" && currentResults.nodes[id].critical) {
    classes.push("is-critical");
  }
  return classes.join(" ");
}

function renderNodePanel() {
  const id = state.selectedActivityId;
  if (!id) {
    ui.nodePanel.innerHTML = "<h3>Activity Details</h3><p>Select a node to inspect duration, predecessor/successor links, and pass calculations.</p>";
    return;
  }

  const node = currentResults.nodes[id];
  const preds = node.predecessors.length ? node.predecessors.join(", ") : "None";
  const succs = node.successors.length ? node.successors.join(", ") : "None";

  const infoLines = [
    `<h3>${id} <span class=\"mode-tag\">(${state.mode} mode)</span></h3>`,
    `<p><strong>Duration (T):</strong> ${node.time}</p>`,
    `<p><strong>Predecessors:</strong> ${preds}</p>`,
    `<p><strong>Successors:</strong> ${succs}</p>`
  ];

  if (state.mode === "forward") {
    infoLines.push(`<div class=\"calc\">${buildForwardExplanation(id, node)}</div>`);
  } else if (state.mode === "backward") {
    infoLines.push(`<div class=\"calc\">${buildBackwardExplanation(id, node)}</div>`);
  } else if (state.mode === "slack") {
    infoLines.push(`<div class=\"calc\">ES=${node.ES}, EF=${node.EF}, LS=${node.LS}, LF=${node.LF}, ST=${node.slack}\n${node.critical ? "This activity is on the current critical path." : "This activity is not currently critical."}</div>`);
  } else {
    infoLines.push("<p>In network mode, focus on the direction of arrows and dependency structure before computing times.</p>");
  }

  ui.nodePanel.innerHTML = infoLines.join("");
}

function buildForwardExplanation(id, node) {
  if (node.predecessors.length === 0) {
    return [
      "Start activity:",
      "ES = 0",
      `EF = ES + T = 0 + ${node.time} = ${node.EF}`
    ].join("\n");
  }

  const efTerms = node.predecessors.map((predId) => `${predId}=${currentResults.nodes[predId].EF}`);
  return [
    `ES = max(EF of ${node.predecessors.join(", ")})`,
    `ES = max(${efTerms.join(", ")}) = ${node.ES}`,
    `EF = ES + T = ${node.ES} + ${node.time} = ${node.EF}`
  ].join("\n");
}

function buildBackwardExplanation(id, node) {
  if (node.successors.length === 0) {
    return [
      "Finish activity:",
      `LF = project duration = ${currentResults.projectDuration}`,
      `LS = LF - T = ${node.LF} - ${node.time} = ${node.LS}`
    ].join("\n");
  }

  const lsTerms = node.successors.map((succId) => `${succId}=${currentResults.nodes[succId].LS}`);
  return [
    `LF = min(LS of ${node.successors.join(", ")})`,
    `LF = min(${lsTerms.join(", ")}) = ${node.LF}`,
    `LS = LF - T = ${node.LF} - ${node.time} = ${node.LS}`
  ].join("\n");
}

function renderTable() {
  const rows = currentResults.topoOrder.map((id) => currentResults.nodes[id]);
  rows.sort((a, b) => compareRows(a, b, state.sortKey, state.sortDirection));

  ui.tableBody.innerHTML = "";
  rows.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.id}</td>
      <td>${row.time}</td>
      <td>${row.predecessors.length ? row.predecessors.join(", ") : "-"}</td>
      <td>${row.ES}</td>
      <td>${row.EF}</td>
      <td>${row.LS}</td>
      <td>${row.LF}</td>
      <td>${row.slack}</td>
      <td>${row.critical ? "<span class=\"crit-chip\">Yes</span>" : "<span class=\"noncrit-chip\">No</span>"}</td>
    `;
    ui.tableBody.appendChild(tr);
  });
}

function compareRows(a, b, key, direction) {
  const dir = direction === "asc" ? 1 : -1;

  if (key === "id") {
    const aid = Number.parseInt(a.id.slice(1), 10);
    const bid = Number.parseInt(b.id.slice(1), 10);
    return (aid - bid) * dir;
  }

  return (a[key] - b[key]) * dir;
}

function renderDelayAnalysis() {
  const selectedId = state.delayActivityId;
  const delay = state.delayDays;
  const baseNode = baseResults.nodes[selectedId];

  const wasOriginallyCritical = baseNode.critical;
  const originalSlack = baseNode.slack;
  const projectDurationIncreased = currentResults.projectDuration > baseResults.projectDuration;
  const criticalPathChanged = baseResults.criticalPath.join(",") !== currentResults.criticalPath.join(",");
  const consumedSlackOnly = !wasOriginallyCritical && delay > 0 && delay <= originalSlack && !projectDurationIncreased;

  const feedbackMessage = chooseDelayMessage(
    delay,
    wasOriginallyCritical,
    originalSlack,
    projectDurationIncreased,
    consumedSlackOnly
  );

  ui.diagnostics.innerHTML = `
    <p><strong>Selected activity:</strong> ${selectedId}</p>
    <p><strong>Delay applied:</strong> ${delay} day(s)</p>
    <p><strong>Originally critical?</strong> ${wasOriginallyCritical ? "Yes" : "No"}</p>
    <p><strong>Original slack:</strong> ${originalSlack}</p>
    <p><strong>Project duration increased?</strong> ${projectDurationIncreased ? "Yes" : "No"}</p>
    <p><strong>Critical path changed?</strong> ${criticalPathChanged ? "Yes" : "No"}</p>
    <p><strong>Slack consumed only?</strong> ${consumedSlackOnly ? "Yes" : "No"}</p>
    <ul class="list-plain">
      <li>${feedbackMessage}</li>
    </ul>
  `;

  ui.summaryBox.textContent = buildSummaryText(
    selectedId,
    delay,
    wasOriginallyCritical,
    originalSlack,
    projectDurationIncreased,
    criticalPathChanged,
    consumedSlackOnly,
    feedbackMessage
  );
}

function chooseDelayMessage(delay, wasOriginallyCritical, originalSlack, projectDurationIncreased, consumedSlackOnly) {
  if (delay === 0) {
    return "No delay has been applied. This is the base case for comparison.";
  }

  if (wasOriginallyCritical) {
    return "This activity had zero slack, so any delay increases project duration unless another path also constrains completion.";
  }

  if (consumedSlackOnly) {
    return "This delay consumes slack but does not extend the project.";
  }

  if (delay > originalSlack || projectDurationIncreased) {
    return "This delay exceeds available slack, so the project duration increases and the critical path may change.";
  }

  return "The delay changes local timing values. Review slack and path status to determine full project impact.";
}

function buildSummaryText(
  selectedId,
  delay,
  wasOriginallyCritical,
  originalSlack,
  projectDurationIncreased,
  criticalPathChanged,
  consumedSlackOnly,
  feedbackMessage
) {
  const basePath = baseResults.criticalPath.join(" -> ");
  const newPath = currentResults.criticalPath.join(" -> ");

  return [
    "CPM RESULT SUMMARY",
    "==================",
    `Base duration: ${baseResults.projectDuration}`,
    `New duration: ${currentResults.projectDuration}`,
    `Base critical path: ${basePath}`,
    `New critical path: ${newPath}`,
    "",
    `Delayed activity: ${selectedId}`,
    `Delay days: ${delay}`,
    `Originally critical: ${wasOriginallyCritical ? "Yes" : "No"}`,
    `Original slack: ${originalSlack}`,
    `Consumed slack only: ${consumedSlackOnly ? "Yes" : "No"}`,
    `Project duration increased: ${projectDurationIncreased ? "Yes" : "No"}`,
    `Critical path changed: ${criticalPathChanged ? "Yes" : "No"}`,
    "",
    `Diagnostic: ${feedbackMessage}`
  ].join("\n");
}

function checkPracticeQuestion(questionId) {
  if (questionId === "q1") {
    const value = Number.parseInt(ui.q1.value, 10);
    if (value === 57) {
      setFeedback(ui.fb1, true, "Correct. The base project duration is 57 days.");
    } else {
      setFeedback(ui.fb1, false, "Not yet. Recheck the final EF of A10 in the base case.");
    }
    return;
  }

  if (questionId === "q2") {
    const expected = ["A1", "A2", "A4", "A5", "A8", "A9", "A10"];
    const normalized = normalizePathInput(ui.q2.value);
    const isMatch = normalized.length === expected.length && normalized.every((id, i) => id === expected[i]);

    if (isMatch) {
      setFeedback(ui.fb2, true, "Correct. That is the base critical path.");
    } else {
      setFeedback(ui.fb2, false, "Not yet. Enter activities in path order, separated by commas.");
    }
    return;
  }

  if (questionId === "q3") {
    const value = Number.parseInt(ui.q3.value, 10);
    if (value === 2) {
      setFeedback(ui.fb3, true, "Correct. A6 has 2 days of slack in the base case.");
    } else {
      setFeedback(ui.fb3, false, "Not yet. Use ST = LS - ES for A6 in the base case.");
    }
  }
}

function normalizePathInput(rawInput) {
  const cleaned = rawInput
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/->/g, ",");

  return cleaned
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function setFeedback(element, isCorrect, message) {
  element.textContent = message;
  element.className = `feedback ${isCorrect ? "ok" : "bad"}`;
}
