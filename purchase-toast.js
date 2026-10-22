
/* ==========================================================
   PURCHASE TOAST — COLEÇÃO PINTURA EM PANO DE PRATO
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

    if (!toast || !closeButton || !nameElement ||
        !actionElement || !timeElement) {
      return;
    }

    if (toast.dataset.initialized === "true") return;
    toast.dataset.initialized = "true";

    const messages = [
      {
        title: "Coleção Completa",
        action: "Conheça os 120 riscos para pintar panos de prato!",
        time: "120 riscos + 4 bônus digitais"
      },
      {
        title: "Pintura em Tecido",
        action: "Encontre inspiração para sua próxima pintura!",
        time: "Modelos prontos para imprimir"
      },
      {
        title: "Sua Criatividade",
        action: "Comece a criar lindas peças artesanais!",
        time: "Conheça todo o material incluído"
      },
      {
        title: "Coleção Completa",
        action: "Veja os riscos e bônus disponíveis na coleção!",
        time: "Acesso digital"
      }
    ];

    let hideTimer;
    let nextTimer;
    let lastIndex = -1;
    let closed = false;

    function escolherMensagem() {
      let index;

      do {
        index = Math.floor(Math.random() * messages.length);
      } while (messages.length > 1 && index === lastIndex);

      lastIndex = index;
      return messages[index];
    }

    function esconder() {
      toast.classList.remove("show");

      clearTimeout(nextTimer);

      if (!closed) {
        nextTimer = setTimeout(exibir, 15000);
      }
    }

    function exibir() {
      if (closed || !toast.isConnected) return;

      const message = escolherMensagem();

      nameElement.textContent = message.title;
      actionElement.textContent = message.action;
      timeElement.textContent = message.time;

      toast.classList.add("show");

      clearTimeout(hideTimer);
      hideTimer = setTimeout(esconder, 6000);
    }

    closeButton.addEventListener("click", function () {
      closed = true;

      clearTimeout(hideTimer);
      clearTimeout(nextTimer);

      toast.classList.remove("show");
      toast.style.display = "none";
    });

    nextTimer = setTimeout(exibir, 2500);

    // Permite testar pelo console do navegador.
    window.purchaseToastTest = exibir;
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
