export function posterUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `https://anixart-anime.ru/${url}`;
}

export function formatRating(n: number): string {
  return (n / 10).toFixed(1);
}

export function formatDuration(m: number): string {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return h > 0 ? `${h}ч ${min}м` : `${min}м`;
}

export function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts * 1000) / 1000);
  if (diff < 60) return 'только что';
  if (diff < 3600) return `${Math.floor(diff / 60)}м назад`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}ч назад`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}д назад`;
  return `${Math.floor(diff / 2592000)}мес назад`;
}
