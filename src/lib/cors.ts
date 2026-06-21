// CORS proxy configuration for Anixart API
// Set your Cloudflare Worker URL here after deployment
// Example: https://your-worker.workers.dev/?url=
const CORS_PROXY = 'https://anix-proxy.hxshiiko.workers.dev/?url=';

export function proxyUrl(url: string): string {
  if (CORS_PROXY) {
    return `${CORS_PROXY}${encodeURIComponent(url)}`;
  }
  return url;
}
