
/* ==========================================================
   POP-UP ALEATÓRIO — COLEÇÃO PINTURA EM PANO DE PRATO
   Controla exclusivamente o pop-up.
========================================================== */

(function () {
  "use strict";

  function iniciarPurchaseToast() {
    const toast = document.getElementById("purchase-notification");
    const closeButton = document.getElementById("toast-close");
    const nameElement = document.getElementById("toast-name");
    const actionElement = document.getElementById("toast-action");
    const timeElement = document.getElementById("toast-time");

    if (
      !toast ||
      !closeButton ||
      !nameElement ||
      !actionElement ||
      !timeElement
    ) {
      console.warn("[Purchase Toast] Elementos não encontrados.");
      return;
    }

    if (toast.dataset.initialized === "true") return;
    toast.dataset.initialized = "true";

    // A. Nomes
    const firstNames = [
      "Mariana", "Carlos", "Fernanda", "Thiago", "Gabriela",
      "Felipe", "Aline", "Lucas", "Juliana", "Rodrigo",
      "Camila", "Bruno", "Beatriz", "Gustavo", "Patricia",
      "Renato", "Larissa", "Diego", "Amanda", "Matheus",
      "Pedro", "Joao", "Ana", "Maria", "Sofia", "Julia",
      "Gabriel", "Rafael", "Daniel", "Marcos", "Andre",
      "Ricardo", "Vanessa", "Renata", "Laura", "Giovanna",
      "Isabela", "Luana", "Eduardo", "Leonardo", "Vinicius"
    ];

    // B. Iniciais de sobrenome
    const lastInitials = [
      "A.", "B.", "C.", "D.", "E.", "F.", "G.", "H.", "I.",
      "J.", "K.", "L.", "M.", "N.", "O.", "P.", "Q.", "R.",
      "S.", "T.", "U.", "V.", "W.", "X.", "Y.", "Z."
    ];

    // C. Mensagens adaptadas ao produto
    const actions = [
      "garantiu a Coleção!",
      "acabou de garantir a Coleção!",
      "garantiu a Coleção Completa!"
    ];

    // D. Textos de tempo
    const times = [
      "há poucos segundos",
      "há 1 minuto",
      "há 2 minutos",
      "há 42 segundos",
      "há 3 minutos"
    ];

    let hideTimer = null;
    let nextTimer = null;
    let fechado = false;

    const TEMPO_INICIAL = 2500;
    const TEMPO_VISIVEL = 6000;
    const INTERVALO = 15000;

    function aleatorio(lista) {
      return lista[Math.floor(Math.random() * lista.length)];
    }

    function preencherPopUp() {
      const nome = aleatorio(firstNames);
      const inicial = aleatorio(lastInitials);

      nameElement.textContent = nome + " " + inicial;
      actionElement.textContent = aleatorio(actions);
      timeElement.textContent = aleatorio(times);
    }

    function esconderPopUp() {
      toast.classList.remove("show");

      clearTimeout(nextTimer);

      if (!fechado) {
        nextTimer = setTimeout(mostrarPopUp, INTERVALO);
      }
    }

    function mostrarPopUp() {
      if (fechado || !toast.isConnected) return;

      // Sorteia novamente a cada exibição.
      preencherPopUp();

      toast.classList.add("show");

      clearTimeout(hideTimer);
      hideTimer = setTimeout(esconderPopUp, TEMPO_VISIVEL);
    }

    function fecharPopUp() {
      fechado = true;

      clearTimeout(hideTimer);
      clearTimeout(nextTimer);

      toast.classList.remove("show");
      toast.style.display = "none";
    }

    closeButton.addEventListener("click", fecharPopUp);

    // Primeira aparição após 2,5 segundos.
    nextTimer = setTimeout(mostrarPopUp, TEMPO_INICIAL);

    // Atalho para testar manualmente pelo Console do navegador.
    window.purchaseToastTest = mostrarPopUp;
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      iniciarPurchaseToast,
      { once: true }
    );
  } else {
    iniciarPurchaseToast();
  }
})();
