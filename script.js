// Initialize player inputs on page load
window.onload = () => {
  const container = document.getElementById("playerInputs");
  for (let i = 1; i <= 8; i++) {
    let div = document.createElement("div");
    div.className = "mb-3";
    div.innerHTML = `
      <label for="P${i}" class="block text-sm font-medium text-gray-400 mb-1">P${i}${i === 1 ? " (You)" : ""}</label>
      <input id="P${i}" type="text" 
        class="w-full rounded-md bg-gray-800 border border-gray-700 placeholder-gray-500 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition px-3 py-2" 
        placeholder="Player ${i} Name" />
    `;
    container.appendChild(div);
  }
};

let players = [];

function generateDropdowns() {
  players = [];
  for (let i = 1; i <= 8; i++) {
    let val = document.getElementById("P" + i).value.trim();
    if (!val) {
      alert("All players (P1–P8) must be filled!");
      return;
    }
    players.push(val);
  }
  if (new Set(players).size !== 8) {
    alert("Player names must be unique!");
    return;
  }

  let roundsDiv = document.getElementById("rounds");
  roundsDiv.innerHTML = "";

  ["Round I-2", "Round I-3", "Round I-4"].forEach((title) => {
    let section = document.createElement("div");
    section.className = "mb-6";
    let h3 = document.createElement("h3");
    h3.className = "text-lg font-semibold text-indigo-300 mb-2";
    h3.textContent = title;
    section.appendChild(h3);
    section.appendChild(makeMatch(players[0], true));
    for (let i = 0; i < 3; i++) section.appendChild(makeMatch(null, false));
    roundsDiv.appendChild(section);
  });

  document.getElementById("roundsForm").classList.remove("hidden");
  attachFilterEvents();
}

function makeMatch(fixed = null) {
  let row = document.createElement("div");
  row.className = "flex flex-col sm:flex-row items-center gap-2 mb-2";

  function createInput(value, disabled = false) {
    if (disabled) {
      let input = document.createElement("input");
      input.type = "text";
      input.className =
        "rounded-md bg-gray-700 border border-gray-600 text-gray-400 px-3 py-2 w-full sm:w-1/2 cursor-not-allowed";
      input.value = value;
      input.disabled = true;
      return input;
    } else {
      let select = document.createElement("select");
      select.className =
        "player-select rounded-md bg-gray-800 border border-gray-700 text-gray-200 px-3 py-2 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition";
      let optionDefault = document.createElement("option");
      optionDefault.value = "";
      optionDefault.textContent = "-- select --";
      select.appendChild(optionDefault);
      players
        .filter((p) => p !== players[0])
        .forEach((p) => {
          let opt = document.createElement("option");
          opt.value = p;
          opt.textContent = p;
          select.appendChild(opt);
        });
      if (value) select.value = value;
      return select;
    }
  }

  if (fixed) {
    let inputFixed = createInput(fixed, true);
    let vsSpan = document.createElement("span");
    vsSpan.className = "text-gray-400";
    vsSpan.textContent = "vs";
    let selectOpp = createInput(null, false);
    row.appendChild(inputFixed);
    row.appendChild(vsSpan);
    row.appendChild(selectOpp);
  } else {
    let select1 = createInput(null, false);
    let vsSpan = document.createElement("span");
    vsSpan.className = "text-gray-400";
    vsSpan.textContent = "vs";
    let select2 = createInput(null, false);
    row.appendChild(select1);
    row.appendChild(vsSpan);
    row.appendChild(select2);
  }
  return row;
}

function attachFilterEvents() {
  document.querySelectorAll("#rounds > div").forEach((roundDiv) => {
    let selects = roundDiv.querySelectorAll("select");
    selects.forEach((sel) => {
      sel.addEventListener("change", () => {
        let chosen = Array.from(selects)
          .map((s) => s.value)
          .filter((v) => v !== "");
        selects.forEach((s) => {
          let current = s.value;
          s.innerHTML =
            `<option value="">-- select --</option>` +
            players
              .filter(
                (p) =>
                  p !== players[0] &&
                  (!chosen.includes(p) || p === current)
              )
              .map(
                (p) =>
                  `<option value="${p}" ${
                    p === current ? "selected" : ""
                  }>${p}</option>`
              )
              .join("");
        });
      });
    });
  });
}

// --- Solve function (shortened for clarity, logic sama macam version awak) ---
function solve() {
  let container = document.getElementById("output");
  container.innerHTML = "";

  let box = document.createElement("pre");
  box.textContent = "🚀 Prediction coming soon (dummy output)";
  container.appendChild(box);
}

// Attach event listeners
document.getElementById("btnGenerate").addEventListener("click", generateDropdowns);
document.getElementById("btnSolve").addEventListener("click", solve);
