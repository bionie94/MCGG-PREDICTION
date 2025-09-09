// Senarai player
let players = [];

// Round data (array of array)
let rounds = [];

// Generate input field
window.onload = () => {
  const container = document.getElementById("playerInputs");
  for (let i = 1; i <= 8; i++) {
    let div = document.createElement("div");
    div.innerHTML = `
      <label for="P${i}" class="block text-gray-200 text-sm mb-1 font-medium select-none">P${i}${i === 1 ? " (You)" : ""}</label>
      <input type="text" id="P${i}" placeholder="Enter player ${i}" class="w-full rounded px-2 py-1 text-black">
    `;
    container.appendChild(div);
  }
};

// Bila klik Generate
document.getElementById("btnGenerate").onclick = () => {
  players = [];
  for (let i = 1; i <= 8; i++) {
    let name = document.getElementById(`P${i}`).value.trim();
    if (!name) name = "Player" + i;
    players.push(name);
  }
  generateRounds(players);
  document.getElementById("roundsForm").classList.remove("hidden");
};

// Buat dropdown utk input match 1–4
function generateRounds(players) {
  const roundsDiv = document.getElementById("rounds");
  roundsDiv.innerHTML = "";

  for (let r = 1; r <= 4; r++) {
    let html = `<div>
      <h2 class="text-xl font-semibold text-indigo-300 mb-2">Round ${r}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">`;

    for (let m = 1; m <= 4; m++) {
      html += `
        <div>
          <label class="block text-sm mb-1 text-gray-300">Match ${m}</label>
          <select id="R${r}M${m}" class="w-full rounded px-2 py-1 text-black">
            ${players.map(p => `<option value="${p}">${p}</option>`).join("")}
          </select>
          <span class="mx-2 text-gray-200">vs</span>
          <select id="R${r}M${m}B" class="w-full rounded px-2 py-1 text-black">
            ${players.map(p => `<option value="${p}">${p}</option>`).join("")}
          </select>
        </div>
      `;
    }

    html += "</div></div>";
    roundsDiv.innerHTML += html;
  }
}

// Solve: kira siapa lawan siapa
document.getElementById("btnSolve").onclick = solve;

function solve() {
  rounds = [];

  // Ambil data Round 1–4
  for (let r = 1; r <= 4; r++) {
    let roundMatches = [];
    for (let m = 1; m <= 4; m++) {
      let A = document.getElementById(`R${r}M${m}`).value;
      let B = document.getElementById(`R${r}M${m}B`).value;
      roundMatches.push([A, B]);
    }
    rounds.push(roundMatches);
  }

  // Simpan match history untuk setiap player
  let history = {};
  players.forEach(p => (history[p] = new Set()));

  rounds.forEach(round => {
    round.forEach(([A, B]) => {
      history[A].add(B);
      history[B].add(A);
    });
  });

  // Cari siapa next lawan (round 5)
  let round5 = [];
  let used = new Set();

  for (let p of players) {
    if (used.has(p)) continue;

    // Cari lawan yg belum pernah jumpa
    let opponent = players.find(
      q => q !== p && !history[p].has(q) && !used.has(q)
    );

    if (!opponent) {
      opponent = "Mirror " + p; // fallback lawan mirror
    }

    round5.push([p, opponent]);
    used.add(p);
    used.add(opponent);
  }

  // Output
  const out = document.getElementById("output");
  out.innerHTML = "";

  rounds.forEach((round, idx) => {
    let html = `<h3 class="text-lg font-bold text-indigo-300">Round ${idx + 1}</h3><ul class="list-disc pl-6">`;
    round.forEach(([A, B]) => (html += `<li>${A} vs ${B}</li>`));
    html += "</ul>";
    out.innerHTML += html;
  });

  let html = `<h3 class="text-lg font-bold text-green-400">Predicted Round 5</h3><ul class="list-disc pl-6">`;
  round5.forEach(([A, B]) => (html += `<li>${A} vs ${B}</li>`));
  html += "</ul>";
  out.innerHTML += html;
}
