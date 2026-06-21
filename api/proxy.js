export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url param' });

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'AnixartApp/9.0 BETA 7-25082901 (Android 9; SDK 28; x86_64; ROG ASUS AI2201_B; ru)',
    }
  });

  const body = await response.text();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(response.status).send(body);
}
