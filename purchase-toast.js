
/* ==========================================================
   POP-UP DA COLEÇÃO PINTURA EM PANO DE PRATO
   Este arquivo controla somente a notificação flutuante.
========================================================== */

(() => {
  "use strict";

  function initPurchaseToast() {
    const toast = document.getElementById("purchase-notification");
    const closeButton = document.getElementById("toast-close");

    // Se o HTML do pop-up não existir, não faz nada.
    if (!toast || !closeButton) return;

    // Evita inicialização duplicada.
    if (toast.dataset.initialized === "true") return;
    toast.dataset.initialized = "true";

    const DISPLAY_DELAY = 4000;
    const VISIBLE_DURATION = 5000;
    const REPEAT_INTERVAL = 30000;

    let hideTimeout = null;
    let firstTimeout = null;
    let repeatInterval = null;
    let closed = false;

    function showNotification() {
      if (closed || !toast.isConnected) return;

      clearTimeout(hideTimeout);

      toast.classList.add("show");

      hideTimeout = setTimeout(() => {
        toast.classList.remove("show");
      }, VISIBLE_DURATION);
    }

    function closeNotification() {
      closed = true;

      clearTimeout(firstTimeout);
      clearTimeout(hideTimeout);
      clearInterval(repeatInterval);

      toast.classList.remove("show");
    }

    closeButton.addEventListener("click", closeNotification);

    // Primeira exibição após 4 segundos.
    firstTimeout = setTimeout(() => {
      showNotification();

      // Repete a cada 30 segundos enquanto a página estiver aberta.
      repeatInterval = setInterval(() => {
        showNotification();
      }, REPEAT_INTERVAL);
    }, DISPLAY_DELAY);
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initPurchaseToast,
      { once: true }
    );
  } else {
    initPurchaseToast();
  }
})();
