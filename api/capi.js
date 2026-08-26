export default async function handler(req, res) {

  /* =========================================================
     CORS / MÉTODO
  ========================================================= */

  if (req.method === 'OPTIONS') {
    return res
      .status(200)
      .end();
  }


  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({
        error: 'Method Not Allowed'
      });
  }


  /* =========================================================
     VARIÁVEIS META
  ========================================================= */

  const PIXEL_ID =
    process.env.META_PIXEL_ID;

  const ACCESS_TOKEN =
    process.env.META_ACCESS_TOKEN;


  if (!PIXEL_ID || !ACCESS_TOKEN) {

    console.error(
      'META_PIXEL_ID ou META_ACCESS_TOKEN ausente'
    );

    return res
      .status(500)
      .json({
        error:
          'Meta environment variables missing'
      });

  }


  /* =========================================================
     DADOS RECEBIDOS DO NAVEGADOR
  ========================================================= */

  const {
    eventName,
    eventId,
    eventSourceUrl,
    eventCustomData,
    fbp,
    fbc,
    externalId
  } = req.body || {};


  if (!eventName) {
    return res
      .status(400)
      .json({
        error: 'eventName is required'
      });
  }


  if (!eventId) {
    return res
      .status(400)
      .json({
        error: 'eventId is required'
      });
  }


  /* =========================================================
     USER AGENT
  ========================================================= */

  const clientUserAgent =
    req.headers['user-agent'] || '';


  /* =========================================================
     IP DO CLIENTE
     Prioridade: x-forwarded-for (primeiro IP) > x-real-ip > socket
     Se x-forwarded-for tiver múltiplos IPs, usa o primeiro
     (IP original do cliente, antes dos proxies).
  ========================================================= */

  let clientIpAddress =
    req.headers['x-forwarded-for'] ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    null;


  if (
    typeof clientIpAddress === 'string' &&
    clientIpAddress.includes(',')
  ) {
    clientIpAddress =
      clientIpAddress
        .split(',')[0]
        .trim();
  }


  /* =========================================================
     TIMESTAMP
  ========================================================= */

  const currentTimestamp =
    Math.floor(
      Date.now() / 1000
    );


  /* =========================================================
     USER DATA
     Montado dinamicamente — campos vazios são omitidos.
     Meta recomenda não enviar fbc/fbp/external_id como null.
  ========================================================= */

  const userData = {};


  if (clientIpAddress) {
    userData.client_ip_address =
      clientIpAddress;
  }


  if (clientUserAgent) {
    userData.client_user_agent =
      clientUserAgent;
  }


  if (fbp) {
    userData.fbp = fbp;
  }


  if (fbc) {
    userData.fbc = fbc;
  }


  /* =========================================================
     EXTERNAL ID — SHA-256 HASH (OBRIGATÓRIO PELA META)
     O browser envia o UUID em plain text.
     O servidor hasheia com SHA-256 antes de enviar à Graph API.
     Enviado como array conforme spec Meta CAPI.
  ========================================================= */

  if (externalId) {
    try {
      const { createHash } = await import('node:crypto');
      const hashedId = createHash('sha256')
        .update(externalId.toLowerCase().trim())
        .digest('hex');
      userData.external_id = [hashedId];
    } catch (e) {
      console.warn('Erro ao hashear external_id:', e.message);
    }
  }


  /* =========================================================
     EVENT SOURCE URL
     Preferir URL enviada pelo browser (mais precisa).
     Fallback para referer do request.
     Omitir se ambos estiverem vazios — não enviar string vazia.
  ========================================================= */

  const resolvedSourceUrl =
    eventSourceUrl ||
    req.headers.referer ||
    null;


  /* =========================================================
     EVENTO META
  ========================================================= */

  const metaEvent = {

    event_name:
      eventName,

    event_time:
      currentTimestamp,

    action_source:
      'website',

    event_id:
      eventId,

    user_data:
      userData

  };


  // Só incluir event_source_url se tiver valor real
  if (resolvedSourceUrl) {
    metaEvent.event_source_url =
      resolvedSourceUrl;
  }


  if (
    eventCustomData &&
    Object.keys(eventCustomData).length > 0
  ) {
    metaEvent.custom_data =
      eventCustomData;
  }


  const eventData = {
    data: [
      metaEvent
    ]
  };


  /* =========================================================
     ENVIO PARA META
  ========================================================= */

  try {

    const metaUrl =
      `https://graph.facebook.com/v24.0/${PIXEL_ID}/events`;


    const response =
      await fetch(
        metaUrl,
        {

          method:
            'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body:
            JSON.stringify({

              ...eventData,

              access_token:
                ACCESS_TOKEN

            })

        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      console.error(
        'Meta CAPI Error:',
        data
      );

      return res
        .status(400)
        .json({
          error:
            'Meta API Error',

          details:
            data
        });

    }


    return res
      .status(200)
      .json({

        success:
          true,

        events_received:
          data.events_received ?? null,

        messages:
          data.messages ?? [],

        fbtrace_id:
          data.fbtrace_id ?? null

      });


  } catch (error) {

    console.error(
      'Meta CAPI Server Error:',
      error
    );


    return res
      .status(500)
      .json({
        error:
          'Internal Server Error'
      });

  }

}
