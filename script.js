const GROUP_LINK = "https://chat.whatsapp.com/JEyUUwzBX7BFfLjuVw96RM";

const form = document.getElementById("rsvpForm");
const feedback = document.getElementById("feedback");

form.addEventListener("submit", async (event) => {
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
