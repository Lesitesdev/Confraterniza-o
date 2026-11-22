const GROUP_LINK = "https://chat.whatsapp.com/JEyUUwzBX7BFfLjuVw96RM";

const music = document.getElementById("invitation-audio");
const musicToggle = document.getElementById("music-toggle");
const musicStatus = document.getElementById("music-status");
const entryScreen = document.getElementById("entry-screen");
const enterInvitation = document.getElementById("enter-invitation");

if (music && musicToggle && musicStatus && entryScreen && enterInvitation) {
  const setPlayingState = () => {
    musicToggle.setAttribute("aria-pressed", "true");
    musicToggle.innerHTML = '<span aria-hidden="true">♫</span> Pausar música';
    musicStatus.textContent = "A música está tocando.";
  };

  const setPausedState = () => {
    musicToggle.setAttribute("aria-pressed", "false");
    musicToggle.innerHTML = '<span aria-hidden="true">♫</span> Ativar música';
    musicStatus.textContent = "A música está pausada.";
  };

  const reportPlaybackError = (error) => {
    if (error.name === "NotAllowedError") {
      musicStatus.textContent = "A música não iniciou. Toque em “Ativar música” para tentar novamente.";
      return;
    }

    musicStatus.textContent = "Não foi possível iniciar a música. Verifique se o arquivo está disponível e tente novamente.";
  };

  const startMusic = async () => {
    try {
      await music.play();
    } catch (error) {
      reportPlaybackError(error);
    }
  };

  music.addEventListener("play", setPlayingState);
  music.addEventListener("pause", setPausedState);
  music.addEventListener("error", () => {
    musicStatus.textContent = "Não foi possível carregar a música. Verifique se o arquivo está disponível.";
  });

  musicToggle.addEventListener("click", () => {
    if (!music.paused) {
      music.pause();
      return;
    }

    startMusic();
  });

  enterInvitation.addEventListener("click", () => {
    enterInvitation.disabled = true;
    musicStatus.textContent = "Abrindo o convite e iniciando a música...";
    document.body.classList.remove("awaiting-entry");
    document.body.classList.add("invitation-entered");
    entryScreen.classList.add("is-dismissed");
    window.setTimeout(() => {
      entryScreen.hidden = true;
    }, 750);
    startMusic();
  });
}

const form = document.getElementById("rsvpForm");
const feedback = document.getElementById("feedback");

if (form && feedback) form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const responsavel = document.getElementById("responsavel").value.trim();
  const nomes = document.getElementById("participantes").value
    .split("\\n")
    .map(nome => nome.trim())
    .filter(Boolean);

  const dias = [...document.querySelectorAll('input[name="dias"]:checked')]
    .map(item => item.value);

  if (nomes.length === 0) {
    feedback.textContent = "Informe pelo menos um participante.";
    return;
  }

  if (dias.length === 0) {
    feedback.textContent = "Selecione pelo menos um dia de participação.";
    return;
  }

  const mensagem =
    "Olá! Aqui está nossa confirmação para a Confraternização 2026.\\n\\n" +
    "Responsável: " + responsavel + "\\n" +
    "Participantes (" + nomes.length + "):\\n- " + nomes.join("\\n- ") + "\\n\\n" +
    "Dias de participação: " + dias.join(", ") + "\\n\\n" +
    "Leandro e Juliana, estamos confirmando nossa presença!";

  // Abre o convite do grupo diretamente durante o clique, evitando bloqueio de pop-up.
  window.open(GROUP_LINK, "_blank", "noopener,noreferrer");

  try {
    await navigator.clipboard.writeText(mensagem);
    feedback.textContent = "Confirmação copiada! No grupo que abriu, cole a mensagem e toque em Enviar.";
  } catch (error) {
    feedback.textContent = "O grupo foi aberto. Copie os dados do formulário e envie sua confirmação no grupo.";
    window.prompt("Copie esta mensagem e envie no grupo do WhatsApp:", mensagem);
  }
});
