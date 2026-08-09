export default async function handler(req, res) {
  // Configurações de CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { eventName, eventId, eventSourceUrl, eventCustomData } = req.body;
  
  const PIXEL_ID = process.env.META_PIXEL_ID;
  const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;

  if (!PIXEL_ID || !ACCESS_TOKEN) {
    return res.status(500).json({ error: 'Missing Meta Pixel ID or Access Token in Environment Variables' });
  }

  const clientUserAgent = req.headers['user-agent'];
  let clientIpAddress = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket?.remoteAddress;
  if (clientIpAddress && clientIpAddress.includes(',')) {
    clientIpAddress = clientIpAddress.split(',')[0].trim();
  }

  const currentTimestamp = Math.floor(Date.now() / 1000);

  const eventData = {
    data: [
      {
        event_name: eventName,
        event_time: currentTimestamp,
        action_source: 'website',
        event_source_url: eventSourceUrl || req.headers.referer,
        event_id: eventId, // Desduplicação
        user_data: {
          client_ip_address: clientIpAddress,
          client_user_agent: clientUserAgent,
        },
        custom_data: eventCustomData || {},
      }
    ]
  };

  try {
    const response = await fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Meta CAPI Error:', data);
      return res.status(400).json({ error: 'Meta API Error', details: data });
    }

    return res.status(200).json({ success: true, meta_response: data });
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
