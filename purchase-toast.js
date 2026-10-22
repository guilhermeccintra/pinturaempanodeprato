
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
  "Mariana", "Carolina", "Fernanda", "Tatiane", "Gabriela",
  "Aline", "Laís", "Juliana", "Roberta", "Camila",
  "Bruna", "Beatriz", "Gabrielle", "Patricia", "Renata",
  "Larissa", "Amanda", "Manuella", "Ana", "Maria",
  "Sofia", "Julia", "Vanessa", "Laura", "Giovanna",
  "Isabela", "Luana", "Letícia", "Rafaela", "Priscila",
  "Débora", "Natália", "Vitória", "Bianca", "Helena",
  "Cláudia", "Cristiane", "Daniela", "Elaine", "Flávia",
  "Jéssica", "Kelly", "Lívia", "Michele", "Monique",
  "Paula", "Raquel", "Simone", "Tainá", "Yasmin"
    ];

// B. Iniciais de sobrenome
const lastInitials = [
  "S.", "M.", "O.", "C.", "A.",
  "R.", "L.", "P.", "F.", "B.",
  "G.", "D.", "T.", "N.", "V.",
  "E.", "J.", "I.", "H.", "K."
];

    // C. Mensagens adaptadas ao produto
    const actions = [
      "garantiu a Coleção!",
      "acabou de garantir a Coleção!",
      "garantiu a Coleção completa!"
    ];

// D. Textos de tempo
const times = [
  "há poucos segundos",
  "há 8 segundos",
  "há 12 segundos",
  "há 17 segundos",
  "há 23 segundos",
  "há 28 segundos",
  "há 35 segundos",
  "há 42 segundos",
  "há 47 segundos",
  "há 53 segundos",
  "há 58 segundos",
  "há 1 minuto",
  "há 1 minuto e 10 segundos",
  "há 1 minuto e 20 segundos",
  "há 1 minuto e 30 segundos",
  "há 1 minuto e 40 segundos",
  "há 1 minuto e 50 segundos",
  "há 2 minutos",
  "há 2 minutos e 15 segundos",
  "há 2 minutos e 30 segundos",
  "há 2 minutos e 45 segundos",
  "há 3 minutos",
  "há 4 minutos",
  "há 5 minutos"
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
