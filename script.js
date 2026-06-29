const maxLife = 10;
const defaultVolume = 0.05;
const continueVolumeBoost = 0.1;
const countdownStepMs = 1100;
const storageKey = "house-fight-score";

const state = {
  life1: maxLife,
  life2: maxLife,
  locked: false,
  musicStarted: false,
  countdownTimer: null,
};

const els = {
  game: document.getElementById("game"),
  stage: document.getElementById("stage"),
  lifeValue1: document.getElementById("lifeValue1"),
  lifeValue2: document.getElementById("lifeValue2"),
  lifeBar1: document.getElementById("lifeBar1"),
  lifeBar2: document.getElementById("lifeBar2"),
  pointPlayer1: document.getElementById("pointPlayer1"),
  pointPlayer2: document.getElementById("pointPlayer2"),
  volumeRange: document.getElementById("volumeRange"),
  volumeLabel: document.getElementById("volumeLabel"),
  music: document.getElementById("music"),
  koSound: document.getElementById("koSound"),
  continueSound: document.getElementById("continueSound"),
  koLayer: document.getElementById("koLayer"),
  victoryLayer: document.getElementById("victoryLayer"),
  victoryImage: document.getElementById("victoryImage"),
  victoryText: document.getElementById("victoryText"),
  restartButton: document.getElementById("restartButton"),
  countdown: document.getElementById("countdown"),
  tapStart: document.getElementById("tapStart"),
};

function clampLife(value) {
  return Math.max(0, Math.min(maxLife, value));
}

function currentVolume() {
  return Number(els.volumeRange.value) / 100;
}

function applyVolume() {
  const volume = currentVolume();
  els.volumeLabel.textContent = `${els.volumeRange.value}%`;
  els.music.volume = volume;
  els.koSound.volume = volume;
  els.continueSound.volume = Math.min(1, volume + continueVolumeBoost);
  saveScore();
}

function loadScore() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (!saved) return;

    state.life1 = clampLife(Number(saved.life1));
    state.life2 = clampLife(Number(saved.life2));

    if (Number.isFinite(Number(saved.volume))) {
      els.volumeRange.value = Math.round(Math.max(0, Math.min(1, Number(saved.volume))) * 100);
    }
  } catch {
    localStorage.removeItem(storageKey);
  }
}

function saveScore() {
  localStorage.setItem(storageKey, JSON.stringify({
    life1: state.life1,
    life2: state.life2,
    volume: currentVolume(),
  }));
}

function startMusic() {
  if (state.musicStarted) return;
  state.musicStarted = true;
  applyVolume();
  els.music.play().catch(() => {
    state.musicStarted = false;
  });
  els.tapStart.classList.add("hidden");
}

function updateLifeBars() {
  const percent1 = (state.life1 / maxLife) * 100;
  const percent2 = (state.life2 / maxLife) * 100;

  els.lifeValue1.textContent = state.life1;
  els.lifeValue2.textContent = state.life2;
  els.lifeBar1.style.width = `${percent1}%`;
  els.lifeBar2.style.width = `${percent2}%`;
  els.lifeBar1.style.filter = state.life1 <= 3 ? "saturate(1.5) brightness(1.08)" : "";
  els.lifeBar2.style.filter = state.life2 <= 3 ? "saturate(1.5) brightness(1.08)" : "";
}

function setButtonsDisabled(disabled) {
  els.pointPlayer1.disabled = disabled;
  els.pointPlayer2.disabled = disabled;
}

function hitStage() {
  els.stage.classList.remove("shake");
  window.requestAnimationFrame(() => {
    els.stage.classList.add("shake");
  });
}

function scoreFor(player) {
  if (state.locked) return;
  startMusic();

  if (player === 1) {
    state.life2 = clampLife(state.life2 - 1);
  } else {
    state.life1 = clampLife(state.life1 - 1);
  }

  updateLifeBars();
  saveScore();
  hitStage();

  if (state.life1 === 0 || state.life2 === 0) {
    beginKnockout(state.life1 === 0 ? 2 : 1);
  }
}

function beginKnockout(winner) {
  state.locked = true;
  setButtonsDisabled(true);
  els.koLayer.classList.add("active");

  els.koSound.pause();
  els.koSound.currentTime = 0;
  els.koSound.play().catch(() => {
    showVictory(winner);
  });

  els.koSound.onended = () => showVictory(winner);
}

function showVictory(winner) {
  els.koLayer.classList.remove("active");
  els.victoryImage.src = winner === 1 ? "assets/jogador1venceu.png" : "assets/jogador2venceu.png";
  els.victoryText.textContent = `Jogador ${winner} venceu`;
  els.victoryLayer.classList.add("active");

  els.continueSound.pause();
  els.continueSound.currentTime = 0;
  els.continueSound.volume = Math.min(1, currentVolume() + continueVolumeBoost);
  els.continueSound.play().catch(() => {});
  startCountdown();
}

function startCountdown() {
  let seconds = 10;
  clearInterval(state.countdownTimer);
  els.countdown.textContent = seconds;

  state.countdownTimer = setInterval(() => {
    seconds -= 1;
    els.countdown.textContent = seconds;

    if (seconds <= 0) {
      clearInterval(state.countdownTimer);
      state.countdownTimer = null;
      els.countdown.textContent = "0";
      els.continueSound.pause();
      els.continueSound.currentTime = 0;
    }
  }, countdownStepMs);
}

function resetGame() {
  state.life1 = maxLife;
  state.life2 = maxLife;
  state.locked = false;

  clearInterval(state.countdownTimer);
  state.countdownTimer = null;

  els.koLayer.classList.remove("active");
  els.victoryLayer.classList.remove("active");
  setButtonsDisabled(false);
  updateLifeBars();
  saveScore();

  els.koSound.pause();
  els.koSound.currentTime = 0;
  els.continueSound.pause();
  els.continueSound.currentTime = 0;

  if (state.musicStarted) {
    els.music.play().catch(() => {});
  }
}

els.pointPlayer1.addEventListener("click", () => scoreFor(1));
els.pointPlayer2.addEventListener("click", () => scoreFor(2));
els.restartButton.addEventListener("click", resetGame);
els.volumeRange.addEventListener("input", applyVolume);
document.addEventListener("click", startMusic, { once: true });

loadScore();
applyVolume();
updateLifeBars();
