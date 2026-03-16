document.getElementById("app").innerHTML = `
  <div class="controls">
    <label>
      Example Input
      <input id="demoInput" type="number" value="10" />
    </label>
    <button id="runBtn">Run</button>
  </div>
  <div class="output" id="output">Result will appear here.</div>
`;

document.getElementById("runBtn").addEventListener("click", () => {
  const value = Number(document.getElementById("demoInput").value);
  document.getElementById("output").textContent = `You entered ${value}.`;
  setStatus("App ran successfully.");
});