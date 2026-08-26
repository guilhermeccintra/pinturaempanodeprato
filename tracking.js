/* =========================================================
   TRACKING DE ORIGEM - GOOGLE/META -> HOTMART
   Preserva UTMs e parâmetros de anúncio

   ESTRATÉGIA: Last Identifiable Click
   Quando nova origem identificável chega, sessão anterior
   é completamente substituída. Sem mistura de origens.

   TTL: 30 minutos — evita atribuição incorreta após
   expiração do interesse do visitante.
========================================================= */

(function () {

  /* =========================================================
     CONSTANTES
  ========================================================= */

  var STORAGE_KEY = 'traffic_tracking';
  var TTL_MS = 30 * 60 * 1000; // 30 minutos

  var TRACKING_PARAMS = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
    'utm_placement',
    'gclid',
    'gbraid',
    'wbraid',
    'fbclid'
  ];

  // Params que indicam uma fonte identificável (para coerência de sessão)
  var SOURCE_IDENTIFIERS = [
    'fbclid',
    'gclid',
    'gbraid',
    'wbraid',
    'utm_source'
  ];


  /* =========================================================
     SESSÃO DE TRACKING COM TTL
  ========================================================= */

  function loadTracking() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};

      var data = JSON.parse(raw);

      // Verificar TTL — descartar dados expirados
      if (data._ts && (Date.now() - data._ts > TTL_MS)) {
        localStorage.removeItem(STORAGE_KEY);
        return {};
      }

      return data;
    } catch (e) {
      return {};
    }
  }


  function saveTracking(data) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
      );
    } catch (e) {
      // Silently fail — não quebrar navegação
    }
  }


  function captureTrackingParams() {

    var currentParams =
      new URLSearchParams(window.location.search);

    // Verificar se a URL atual traz uma origem identificável
    var hasNewSource = false;

    SOURCE_IDENTIFIERS.forEach(function (param) {
      if (currentParams.get(param)) {
        hasNewSource = true;
      }
    });

    // Carregar dados salvos
    var savedTracking = loadTracking();

    /*
      LAST IDENTIFIABLE CLICK:
      Se nova origem identificável chegou, limpar sessão anterior.
      Evita mistura de fbclid Meta + gclid Google, por exemplo.
    */
    if (hasNewSource) {
      savedTracking = {};
    }

    // Capturar todos os parâmetros de tracking da URL
    var hasAnyParam = false;

    TRACKING_PARAMS.forEach(function (param) {
      var value = currentParams.get(param);
      if (value) {
        savedTracking[param] = value;
        hasAnyParam = true;
      }
    });

    // Registrar timestamp para TTL
    if (hasAnyParam || hasNewSource) {
      savedTracking._ts = Date.now();
    }

    saveTracking(savedTracking);

    return savedTracking;
  }


  /* =========================================================
     VERIFICAÇÃO HOTMART
  ========================================================= */

  function isHotmartLink(url) {
    var hostname = url.hostname.toLowerCase();
    return (
      hostname === 'pay.hotmart.com' ||
      hostname.endsWith('.hotmart.com') ||
      hostname === 'go.hotmart.com'
    );
  }


  /* =========================================================
     SCK COMPOSTO PARA HOTMART
     Formato: utm_source|utm_medium|utm_campaign
     Dá mais contexto que apenas utm_source.
     Limite: 255 caracteres (Hotmart).
  ========================================================= */

  function buildSck(tracking) {
    var parts = [];

    if (tracking.utm_source) parts.push(tracking.utm_source);
    if (tracking.utm_medium) parts.push(tracking.utm_medium);
    if (tracking.utm_campaign) parts.push(tracking.utm_campaign);

    if (parts.length === 0) return null;

    return parts.join('|').substring(0, 255);
  }


  /* =========================================================
     APLICAR TRACKING NOS LINKS HOTMART
  ========================================================= */

  function applyTracking(link) {
    try {
      var url = new URL(link.href, window.location.origin);

      if (!isHotmartLink(url)) return;

      var tracking = loadTracking();

      // Adicionar parâmetros sem sobrescrever os já existentes da Hotmart
      TRACKING_PARAMS.forEach(function (param) {
        if (tracking[param]) {
          url.searchParams.set(param, tracking[param]);
        }
      });

      // SCK composto para identificação Hotmart
      if (!url.searchParams.has('sck')) {
        var sck = buildSck(tracking);
        if (sck) {
          url.searchParams.set('sck', sck);
        }
      }

      link.href = url.toString();

    } catch (e) {
      // Silently fail — não quebrar navegação
    }
  }


  function applyTrackingToAllLinks() {
    document
      .querySelectorAll('a[href]')
      .forEach(applyTracking);
  }


  /* =========================================================
     INICIALIZAÇÃO
  ========================================================= */

  // Capturar parâmetros de tracking da URL imediatamente
  captureTrackingParams();


  // Atualizar links existentes no DOMContentLoaded
  document.addEventListener(
    'DOMContentLoaded',
    function () {

      applyTrackingToAllLinks();

      // MutationObserver com debounce para links adicionados dinamicamente
      var debounceTimer;

      var observer = new MutationObserver(function () {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(applyTrackingToAllLinks, 300);
      });

      observer.observe(
        document.body,
        {
          childList: true,
          subtree: true
        }
      );
    }
  );


  // Rede de segurança: aplicar tracking no clique (capture phase)
  document.addEventListener(
    'click',
    function (event) {
      var link = event.target.closest('a[href]');
      if (link) {
        applyTracking(link);
      }
    },
    true
  );


})();
