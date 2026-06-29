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
  winner: null,
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
  countdown: document.getElementById("countdown"),
  tapStart: document.getElementById("tapStart"),
  trashTalkLeft: document.getElementById("trashTalkLeft"),
  trashTalkRight: document.getElementById("trashTalkRight"),
};

const trashTalkPhrases = [
  "Essa louca lavou mais rápido que máquina no modo turbo.",
  "Ponto ganho: a esponja cantou vitória.",
  "Quem perdeu deixou até o pano de prato decepcionado.",
  "Mais um prato limpo, menos uma desculpa na mesa.",
  "A pia viu esse ponto e pediu replay.",
  "Esse copo saiu brilhando e debochando.",
  "A gordura pediu arrego antes do segundo round.",
  "Hoje a vassoura escolheu um favorito.",
  "A poeira tentou correr, mas levou counter.",
  "Esse ponto foi tão limpo que dá para jantar no reflexo.",
  "Quem perdeu ficou devendo um detergente emocional.",
  "A louça aplaudiu de pé dentro do escorredor.",
  "A esponja falou: respeito quem trabalha.",
  "Ponto conquistado no combo enxágue perfeito.",
  "Isso foi faxina ou final de campeonato?",
  "O ralo engoliu a derrota sem mastigar.",
  "Perdeu ponto e ainda deixou farelo de orgulho.",
  "O aspirador faria barulho de torcida agora.",
  "O sabão declarou neutralidade, mas sorriu.",
  "Essa panela não via brilho assim desde a loja.",
  "Mais um ponto e a pia já está pedindo autógrafo.",
  "Quem perdeu lavou a alma, mas esqueceu a forma.",
  "A bancada está refletindo a superioridade.",
  "Esse pano passou como golpe especial.",
  "A sujeira saiu com pedido formal de demissão.",
  "Quem ganhou passou o rodo na concorrência.",
  "O tanque viu disciplina e ficou emocionado.",
  "A roupa dobrada deu nota dez.",
  "A meia perdida apareceu só para ver o ponto.",
  "A lixeira fechou a tampa em sinal de respeito.",
  "A casa inteira ouviu esse ponto encaixar.",
  "Quem perdeu deixou o balde em crise existencial.",
  "Esse foi um uppercut de limpeza pesada.",
  "O desengordurante nem precisou levantar da cadeira.",
  "A pia ficou tão limpa que piscou.",
  "O chão está escorregando de inveja.",
  "Ponto ganho com cheiro de amaciante e provocação.",
  "Quem perdeu tomou sabão sem nem entrar no banho.",
  "O fogão agora chama isso de liderança.",
  "A geladeira abriu espaço para o campeão.",
  "Essa varrida teve trilha sonora de vitória.",
  "A poeira assinou rendição no rodapé.",
  "Quem ganhou espanou a autoestima do rival.",
  "O mop passou deixando recado.",
  "O escorredor está lotado de troféus molhados.",
  "Esse talher saiu mais brilhante que promessa de Ano Novo.",
  "Quem perdeu está no nível colher esquecida.",
  "A esponja rosa mandou lembranças afiadas.",
  "A luva azul sentiu o impacto daqui.",
  "Limpeza crítica: dano máximo no orgulho.",
  "Esse ponto veio com perfume de casa vencida.",
  "A sujeira piscou e já era.",
  "Quem perdeu ficou abaixo do nível do sabão.",
  "O armário rangeu parabéns.",
  "A pia chamou esse movimento de arte.",
  "Mais um ponto para quem não tem medo de bucha.",
  "O prato sujo tentou negociar e foi silenciado.",
  "A toalha de mesa pediu bis.",
  "Quem perdeu foi varrido para a área de serviço.",
  "Esse ponto fez até o rodo ficar ereto.",
  "O balde viu técnica, foco e deboche.",
  "Essa faxina teve frame perfeito.",
  "A casa está mais limpa e a rivalidade mais suja.",
  "Ponto limpo, provocação esterilizada.",
  "Quem perdeu deixou a desculpa de molho.",
  "O detergente fez joinha com espuma.",
  "A gordura virou estatística.",
  "Esse round foi decidido no brilho do azulejo.",
  "A escova de vaso ficou com medo do campeão.",
  "Quem ganhou passou lustra-móveis no ego.",
  "O varal balançou em comemoração.",
  "A roupa limpa gritou flawless.",
  "Quem perdeu tomou combo de sabão e silêncio.",
  "O chão encerado refletiu a derrota.",
  "Esse ponto veio direto do modo faxina lendária.",
  "A esponja fez drift na frigideira.",
  "A louça saiu tão limpa que pediu RG novo.",
  "Quem perdeu virou sujeira no cantinho.",
  "O pano úmido deu aula de humildade.",
  "Ponto ganho com finalização de enxágue.",
  "A pia está sem vida suja para contar história.",
  "O cesto de roupa suja está reconsiderando alianças.",
  "Quem perdeu levou detergente na ferida.",
  "A bancada virou ringue e já tem campeão.",
  "Esse brilho causou dano psicológico.",
  "A poeira pediu pause e não foi atendida.",
  "Mais um ponto para o terror da louça acumulada.",
  "Quem perdeu escorregou no próprio argumento.",
  "O sabão em pó fez chuva de confete.",
  "Essa vitória veio prensada no pano multiuso.",
  "A panela grudada reconheceu o superior.",
  "Ponto ganho no estilo lava, seca e humilha.",
  "O rival ficou com cara de prato engordurado.",
  "Essa limpeza foi tão forte que atualizou o placar sozinha.",
  "Quem perdeu virou tarefa pendente.",
  "A pia soltou espuma de alegria.",
  "O rodapé nunca viu tamanha dominância.",
  "Esse ponto deu brilho até na provocação.",
  "A casa está limpa, mas a disputa ficou imunda.",
  "Quem ganhou deixou o rival no molho por dez minutos.",
  "A bucha carimbou: serviço aprovado.",
  "O cheiro de limpeza veio com risada de canto.",
  "Quem perdeu está devendo um ciclo completo.",
  "Essa pontuação veio com pressão de lava-jato.",
  "O escovão apontou para o placar e riu.",
  "A sujeira tentou fazer corpo mole, perdeu mesmo assim.",
  "Mais um ponto: a pia virou camarote.",
  "Quem perdeu ficou no modo pré-lavagem.",
  "A faxina mandou um abraço e uma indireta."
];

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

function randomPhrase() {
  return trashTalkPhrases[Math.floor(Math.random() * trashTalkPhrases.length)];
}

function showTrashTalk(scoringPlayer) {
  const winnerBox = scoringPlayer === 1 ? els.trashTalkLeft : els.trashTalkRight;
  const loserBox = scoringPlayer === 1 ? els.trashTalkRight : els.trashTalkLeft;

  winnerBox.textContent = randomPhrase();
  loserBox.textContent = randomPhrase();

  winnerBox.classList.remove("show");
  loserBox.classList.remove("show");

  window.requestAnimationFrame(() => {
    winnerBox.classList.add("show");
    loserBox.classList.add("show");
  });
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
  showTrashTalk(player);
  hitStage();

  if (state.life1 === 0 || state.life2 === 0) {
    beginKnockout(state.life1 === 0 ? 2 : 1);
  }
}

function beginKnockout(winner) {
  state.locked = true;
  state.winner = winner;
  setButtonsDisabled(true);
  els.koLayer.classList.add("active");

  els.koSound.pause();
  els.koSound.currentTime = 0;
  els.koSound.play().catch(() => {
    showVictory(winner);
  });

  els.koSound.onended = () => {
    if (!els.victoryLayer.classList.contains("active")) {
      showVictory(winner);
    }
  };
}

function skipKnockout() {
  if (!els.koLayer.classList.contains("active") || !state.winner) return;

  els.koSound.onended = null;
  els.koSound.pause();
  els.koSound.currentTime = 0;
  showVictory(state.winner);
}

function showVictory(winner) {
  if (els.victoryLayer.classList.contains("active")) return;

  els.koLayer.classList.remove("active");
  els.victoryImage.src = winner === 1 ? "assets/jogador1venceu.png" : "assets/jogador2venceu.png";
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
  state.winner = null;

  clearInterval(state.countdownTimer);
  state.countdownTimer = null;

  els.koLayer.classList.remove("active");
  els.victoryLayer.classList.remove("active");
  setButtonsDisabled(false);
  updateLifeBars();
  saveScore();

  els.koSound.pause();
  els.koSound.onended = null;
  els.koSound.currentTime = 0;
  els.continueSound.pause();
  els.continueSound.currentTime = 0;

  if (state.musicStarted) {
    els.music.play().catch(() => {});
  }
}

els.pointPlayer1.addEventListener("click", () => scoreFor(1));
els.pointPlayer2.addEventListener("click", () => scoreFor(2));
els.koLayer.addEventListener("click", skipKnockout);
els.countdown.addEventListener("click", resetGame);
els.volumeRange.addEventListener("input", applyVolume);
document.addEventListener("click", startMusic, { once: true });

loadScore();
applyVolume();
updateLifeBars();
