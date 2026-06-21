export default {
  async fetch(request) {
    const url = new URL(request.url);
    const target = url.searchParams.get('url');
    if (!target) return new Response('Missing url param', { status: 400 });

    const res = await fetch(target, {
      headers: {
        'User-Agent': 'AnixartApp/9.0 BETA 7-25082901 (Android 9; SDK 28; x86_64; ROG ASUS AI2201_B; ru)',
        'Origin': 'https://anixsekai.com',
        'Referer': 'https://anixsekai.com/'
      }
    });

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': '*'
    };

    const body = await res.text();
    return new Response(body, {
      status: res.status,
      headers: { ...Object.fromEntries(res.headers), ...corsHeaders }
    });
  }
};
