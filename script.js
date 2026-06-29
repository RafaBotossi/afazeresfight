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

const victoryPhrases = [
  "Até o Asta viu quem manda nessa pia.",
  "Zequinha já abanou o rabo para a pessoa certa.",
  "O Asta escolheu meu lado. Acabou o debate.",
  "Zequinha sabe reconhecer campeão quando vê um.",
  "Mais um ponto e o Asta vai dormir no meu travesseiro de comemoração.",
  "O Asta olhou para sua louça e saiu julgando em silêncio.",
  "Zequinha faria melhor com uma pata só.",
  "Até o Zequinha entendeu a técnica antes de você.",
  "O Asta aprovou minha vitória com aquele olhar de superioridade dele.",
  "Zequinha quer saber se você treinou com os olhos fechados.",
  "O Asta só respeita quem deixa a pia brilhando.",
  "Zequinha já está pronto para comemorar minha vitória.",
  "O Asta viu você perder e fingiu que não te conhece.",
  "Nem o Zequinha lamberia essa louça do jeito que ficou.",
  "O Asta decretou: hoje o colo é meu.",
  "Zequinha está abanando o rabo para a pessoa competente da casa.",
  "O Asta viu meu combo e quase deu um miado de aplauso.",
  "Zequinha está com cara de “eu avisei”.",
  "O Asta colocou você na lista de humanos suspeitos da cozinha.",
  "Zequinha escolheu meu time. E cachorro não erra caráter.",
  "Ponto meu. Vai separar a roupa por cor agora, campeão.",
  "Lavou errado e ainda perdeu. Multitalento.",
  "Isso aqui é talento doméstico, não bagunça profissional.",
  "Pode anotar: eu sou o terror da pia.",
  "Mais um ponto e você vira ajudante de limpeza.",
  "Quem manda na esponja sou eu.",
  "Você perdeu até para um pano de prato.",
  "Essa casa tem dono — e não é você.",
  "Técnica vence força bruta.",
  "Mais rápido que você só a máquina de lavar.",
  "Vai treinando, porque eu nem comecei a humilhar.",
  "Ponto limpo, prato limpo, ego sujo.",
  "Você deixou uma mancha e eu deixei uma lição.",
  "Nem o detergente consegue salvar esse desempenho.",
  "Isso foi lavagem ou pedido de socorro?",
  "Mais um ponto para quem sabe limpar sem criar desastre.",
  "Você é ótimo… em perder ponto.",
  "Eu chamo isso de eficiência. Você chama de azar.",
  "Tá vendo essa pia? Meu território.",
  "Vai querer tutorial ou vai perder sozinho mesmo?",
  "O pano de chão faria melhor.",
  "Você não lava louça, você negocia com a sujeira.",
  "Ponto meu. Pode ir pegando o avental da derrota.",
  "Hoje quem escolhe o jantar sou eu, aceita.",
  "Você tá apanhando até da espuma.",
  "Essa vitória veio cheirosa de amaciante.",
  "Você dobrou errado até a própria confiança.",
  "Quem perde ponto também perde o direito de reclamar.",
  "Meu combo é limpeza, seu combo é desculpa.",
  "Olha o brilho desse ponto. Quase tão forte quanto meu deboche.",
  "Você não perdeu ponto, você doou.",
  "Isso aí foi um erro doméstico ou uma performance artística?",
  "Mais um para o lado da competência.",
  "Você devia lavar só pensamento, porque louça não tá dando.",
  "Eu limpo, brilho e ainda ganho.",
  "Não basta esfregar, tem que saber.",
  "Você é a prova de que força sem técnica vira espuma.",
  "Mais um ponto e eu mando você organizar a despensa.",
  "Isso aqui não é disputa, é aula prática.",
  "O prato ficou limpo. Sua autoestima, nem tanto.",
  "Ponto meu. Pode guardar essa derrota no armário.",
  "Você caiu na própria sujeira.",
  "Nem o rodo passa tanta vergonha.",
  "A diferença entre nós é que eu termino o serviço.",
  "Perdeu ponto e ainda deixou migalha. Impressionante.",
  "Meu desempenho é padrão premium. O seu é versão teste.",
  "Quem manda bem assim merece até sobremesa.",
  "Vai lá, rei/rainha da bagunça, tenta de novo.",
  "Mais um ponto para a pessoa funcional da casa.",
  "Essa vitória veio passada, dobrada e guardada.",
  "Você tá perdendo de lavada. Literalmente.",
  "A pia me respeita. Você ela ignora.",
  "Não foi sorte. Foi capricho.",
  "Você não errou, você inovou no fracasso.",
  "Meu ponto veio com cheirinho de roupa limpa.",
  "Você tá fazendo a louça parecer missão impossível.",
  "Mais um e eu te coloco no modo ajudante.",
  "O placar tá mais limpo que sua consciência.",
  "Vai esfregando essa derrota aí.",
  "Ponto meu. Sem manchas, sem dúvidas.",
  "Eu vim para vencer e deixar tudo brilhando.",
  "Você trouxe força, eu trouxe resultado.",
  "Nem o aspirador consegue sugar essa vergonha.",
  "Tá perdendo até para a própria pia.",
  "Isso aqui é domínio doméstico absoluto.",
  "Você devia pedir reforço para o sabão em pó.",
  "Mais um ponto e eu ganho até sua prateleira favorita.",
  "Seu desempenho tá mais amassado que roupa esquecida no cesto.",
  "Eu faço parecer fácil porque é fácil para mim.",
  "Ponto meu. Vai recolher essa dignidade do chão.",
  "Você tentou. Isso já é quase um serviço doméstico.",
  "Quem sabe, sabe. Quem não sabe, derruba água.",
  "Mais uma vitória e você lava até meu copo.",
  "O cronômetro viu tudo. Sem choro.",
  "Você não tá competindo, tá participando.",
  "Esse ponto veio bem enxaguado.",
  "Pode chamar de arrogância, eu chamo de histórico.",
  "O placar tá ficando tão bonito quanto a cozinha depois que eu passo.",
  "Você é rápido… para inventar desculpa.",
  "Vitória doméstica confirmada: eu limpo, eu ganho, eu provoco."
];

const defeatPhrases = [
  "O Asta viu isso? Finge que não foi nada.",
  "Zequinha, não abana o rabo para essa pessoa ainda.",
  "O Asta, sai da cozinha. Isso foi constrangedor.",
  "Zequinha, isso foi só estratégia… mais ou menos.",
  "O Asta está me julgando, eu sei.",
  "Zequinha não olha para mim assim, eu vou virar esse jogo.",
  "O Asta viu meu erro e já começou a me ignorar.",
  "Zequinha, não comemora antes da hora.",
  "O Asta vai usar essa derrota contra mim por semanas.",
  "Zequinha já está com cara de quem vai contar para a vizinhança.",
  "O Asta, eu explico. Foi a esponja.",
  "Zequinha, você não viu direito. O cronômetro roubou.",
  "O Asta está decepcionado, mas eu ainda tenho rodada.",
  "Zequinha, para de torcer para o outro lado.",
  "O Asta acabou de me deserdar do sofá.",
  "Zequinha está feliz demais para alguém que nem lava prato.",
  "O Asta viu eu perder e foi tomar água com desprezo.",
  "Zequinha está comemorando como se tivesse ganho petisco.",
  "O Asta vai dormir do lado do vencedor agora, eu conheço esse traidor.",
  "Zequinha, não faz essa cara de “eu sabia”.",
  "Ah não. Você ganhou esse por pura sorte de detergente.",
  "Tá comemorando cedo demais, louça suja.",
  "Aproveita esse ponto, porque foi o último que eu deixei escapar.",
  "Você ganhou um ponto, não uma casa inteira.",
  "Calma aí, campeão. Até pano molhado seca.",
  "Foi acidente. Igual sua técnica.",
  "Não se acostuma, isso aqui foi falha operacional.",
  "Pode comemorar. Eu gosto de dar esperança.",
  "Esse ponto foi seu porque eu estava sendo gentil.",
  "Você ganhou porque a pia ficou com pena.",
  "Tá feliz? Quer uma medalha de esponja usada?",
  "Esse ponto tem cheiro de sorte.",
  "Aproveita. Eu já tô voltando para o jogo.",
  "Você venceu a rodada, não minha paciência.",
  "Foi um ponto. Não inventa documentário.",
  "Tá se achando porque acertou uma vez?",
  "Pode rir agora. Daqui a pouco você seca as lágrimas.",
  "Você ganhou esse ponto e perdeu a humildade.",
  "A pia traiu meu talento.",
  "Tá bom, essa foi sua. Mas o próximo vem com juros.",
  "Eu escorreguei. Você ainda continua sem técnica.",
  "Não comemora muito, que a sujeira ainda tá do seu lado.",
  "Esse ponto foi emprestado. Vou cobrar na próxima.",
  "Você ganhou porque eu quis aumentar a emoção.",
  "Uau, um ponto. Quer que eu chame os vizinhos?",
  "Até relógio quebrado acerta duas vezes.",
  "Parabéns, você fez o mínimo e ficou emocionado.",
  "Foi bonito. Quase pareceu competência.",
  "Esse ponto não muda o fato de que você ainda dobra lençol errado.",
  "Pode guardar esse momento. Vai ser raro.",
  "Você ganhou, mas o sabão sabe a verdade.",
  "Não foi derrota, foi intervalo dramático.",
  "Tá vendo? Eu deixo você sonhar antes de acordar.",
  "Esse ponto veio com ajuda divina e água quente.",
  "Você tá comemorando igual quem terminou a faxina sem reclamar.",
  "Pode aproveitar. Minha revanche já está centrifugando.",
  "Foi um vacilo meu, não um mérito seu.",
  "Não fica metido, que ainda tem muita louça para lavar.",
  "Eu deixei cair o ponto. Você só pegou.",
  "Tá feliz porque ganhou? Fofo.",
  "Esse ponto foi seu porque eu estava distraído com sua bagunça.",
  "Você ganhou a rodada, eu ganho no capricho.",
  "Não confunde erro meu com talento seu.",
  "Tá bom, pode colocar esse ponto na geladeira.",
  "Você só ganhou porque o cronômetro te protegeu.",
  "Essa vitória sua veio toda engordurada.",
  "Eu perdi um ponto, não o bom gosto.",
  "Pode rir. Eu tô decorando seu sorriso para apagar depois.",
  "Foi uma falha de esponja, acontece.",
  "Você venceu agora, mas sua roupa ainda tá no varal errado.",
  "Esse ponto foi seu. A pia deve estar carente.",
  "Parabéns. Seu prêmio é continuar lavando.",
  "Eu deixei você ganhar para não dizer que sou cruel.",
  "Esse ponto é tão pequeno que cabe numa colher de chá.",
  "Você ganhou e já tá com pose de dono da lavanderia.",
  "Aproveita enquanto eu recalculo seu desastre.",
  "Tá comemorando? Então prepara o pano para limpar a próxima derrota.",
  "Isso foi uma rodada, não um milagre.",
  "Você ganhou porque eu estava poupando energia para humilhar depois.",
  "Um ponto não lava a quantidade de erro que você já fez.",
  "Tá achando que virou especialista em afazeres domésticos?",
  "Foi sorte. E sorte não tira mancha.",
  "Pode se exibir. A próxima espuma é sua.",
  "Você ganhou porque eu te subestimei. Nunca mais.",
  "Essa foi sua, mas não se empolga e derruba o balde.",
  "O placar te deu carinho. Eu vou tirar.",
  "Você venceu por detalhes. Eu venço por domínio.",
  "Tá bom, essa foi uma boa. Não se acostuma.",
  "Você ganhou um ponto e perdeu toda a discrição.",
  "Esse ponto veio fácil demais. Desconfio até do detergente.",
  "Parabéns, mestre da pia. Agora tenta repetir.",
  "Você ganhou porque eu deixei a guarda baixa — e o prato escorregou.",
  "Pode guardar essa vitória no armário de raridades.",
  "Ah, então você sabe fazer alguma coisa além de bagunçar.",
  "Essa rodada foi sua. A cozinha ainda é minha.",
  "Você tá feliz demais para alguém que quase queimou água outro dia.",
  "Ganhou um ponto e já quer escolher o jantar?",
  "Aproveita a fama. Ela dura menos que roupa no varal com chuva.",
  "Eu perdi porque fui bonzinho. Erro meu.",
  "Aproveita esse ponto, porque eu vou esfregar essa vantagem até sumir."
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
  } catch {
    localStorage.removeItem(storageKey);
  }
}

function saveScore() {
  localStorage.setItem(storageKey, JSON.stringify({
    life1: state.life1,
    life2: state.life2,
  }));
}

function randomPhrase(phrases) {
  return phrases[Math.floor(Math.random() * phrases.length)];
}

function showTrashTalk(scoringPlayer) {
  const winnerBox = scoringPlayer === 1 ? els.trashTalkLeft : els.trashTalkRight;
  const loserBox = scoringPlayer === 1 ? els.trashTalkRight : els.trashTalkLeft;

  winnerBox.textContent = randomPhrase(victoryPhrases);
  loserBox.textContent = randomPhrase(defeatPhrases);

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
  els.countdown.classList.add("is-hidden");

  state.countdownTimer = setInterval(() => {
    seconds -= 1;
    els.countdown.textContent = seconds;
    els.countdown.classList.remove("is-hidden");

    if (seconds <= 0) {
      clearInterval(state.countdownTimer);
      state.countdownTimer = null;
      els.countdown.textContent = "0";
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
  els.countdown.classList.remove("is-hidden");
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
document.addEventListener("click", startMusic);

els.volumeRange.value = String(defaultVolume * 100);
loadScore();
applyVolume();
updateLifeBars();
