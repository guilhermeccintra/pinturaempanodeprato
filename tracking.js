/* =========================================================
   TRACKING DE ORIGEM - GOOGLE/META -> HOTMART
   Preserva UTMs e parâmetros de anúncio
========================================================= */

(function () {

  const TRACKING_PARAMS = [
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


  // Captura UTMs da URL e salva
  function captureTrackingParams() {

    const currentParams =
      new URLSearchParams(window.location.search);

    const savedTracking = JSON.parse(
      localStorage.getItem('traffic_tracking') || '{}'
    );


    TRACKING_PARAMS.forEach(function(param) {

      const value = currentParams.get(param);

      if (value) {
        savedTracking[param] = value;
      }

    });


    localStorage.setItem(
      'traffic_tracking',
      JSON.stringify(savedTracking)
    );

    return savedTracking;
  }



  // Recupera UTMs salvas
  function getSavedTracking() {

    try {

      return JSON.parse(
        localStorage.getItem('traffic_tracking') || '{}'
      );

    } catch (e) {

      return {};

    }

  }



  // Verifica se é link Hotmart
  function isHotmartLink(url) {

    const hostname =
      url.hostname.toLowerCase();


    return (
      hostname === 'pay.hotmart.com' ||
      hostname.endsWith('.hotmart.com') ||
      hostname === 'go.hotmart.com'
    );

  }



  // Adiciona UTMs no checkout
  function applyTracking(link) {

    try {

      const url =
        new URL(link.href, window.location.origin);


      if (!isHotmartLink(url)) {
        return;
      }


      const tracking =
        getSavedTracking();


      TRACKING_PARAMS.forEach(function(param) {

        if (tracking[param]) {

          url.searchParams.set(
            param,
            tracking[param]
          );

        }

      });



      // Adiciona SCK para identificação Hotmart
      if (
        tracking.utm_source &&
        !url.searchParams.has('sck')
      ) {

        url.searchParams.set(
          'sck',
          tracking.utm_source
        );

      }



      link.href =
        url.toString();


    } catch(e) {}

  }



  // Captura origem assim que entra na página
  captureTrackingParams();



  // Atualiza links existentes
  document.addEventListener(
    'DOMContentLoaded',
    function() {

      document
        .querySelectorAll('a[href]')
        .forEach(applyTracking);

    }
  );



  // Proteção extra no clique
  document.addEventListener(
    'click',
    function(event) {

      const link =
        event.target.closest('a[href]');


      if (link) {

        applyTracking(link);

      }

    },
    true
  );



  // Caso algum botão seja criado depois
  const observer =
    new MutationObserver(function() {

      document
        .querySelectorAll('a[href]')
        .forEach(applyTracking);

    });



  document.addEventListener(
    'DOMContentLoaded',
    function() {

      observer.observe(
        document.body,
        {
          childList: true,
          subtree: true
        }
      );

    }
  );


})();
