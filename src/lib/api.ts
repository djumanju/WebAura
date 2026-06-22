import type { IRelease, IEpisode, IDubber, ISource, IProfile } from './types';
import { proxyUrl } from './cors';

const API_BASE = 'https://api-s.anixsekai.com';
const USER_AGENT = 'AnixartApp/9.0 BETA 7-25082901 (Android 9; SDK 28; x86_64; ROG ASUS AI2201_B; ru)';

function corsUrl(path: string): string {
  return proxyUrl(`${API_BASE}${path}`);
}

function headers(token?: string | null): Record<string, string> {
  const h: Record<string, string> = { 'User-Agent': USER_AGENT };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

async function apiCall<T>(path: string, opts: {
  method?: string; token?: string | null;
  params?: Record<string, any>; body?: any;
} = {}): Promise<T> {
  let url = corsUrl(path);
  const params = new URLSearchParams();
  if (opts.token) params.set('token', opts.token);
  if (opts.params) {
    for (const [k, v] of Object.entries(opts.params)) {
      if (v !== undefined) params.set(k, String(v));
    }
  }
  const qs = params.toString();
  if (qs) url += '?' + qs;

  const init: RequestInit = {
    method: opts.method || 'GET',
    headers: headers(opts.token),
  };
  if (opts.body) {
    init.method = 'POST';
    if (opts.body instanceof URLSearchParams) {
      init.headers = { ...init.headers as any, 'Content-Type': 'application/x-www-form-urlencoded' };
      init.body = opts.body.toString();
    } else {
      init.headers = { ...init.headers as any, 'Content-Type': 'application/json' };
      init.body = JSON.stringify(opts.body);
    }
  }

  const res = await fetch(url, init);
  const data = await res.json();
  if (data.code !== undefined && data.code !== 0) {
    throw new Error(`API error ${data.code}: ${path}`);
  }
  return data;
}

// Auth
export async function loginAnix(login: string, password: string): Promise<string | null> {
  const data: any = await apiCall('/auth/signIn', {
    method: 'POST',
    body: new URLSearchParams({ login, password })
  });
  if (data.code === 0 && data.profileToken?.token) {
    return data.profileToken.token;
  }
  return null;
}

// Profile
export async function getMyProfile(token: string): Promise<IProfile | null> {
  const data: any = await apiCall('/profile/info', { token });
  return data?.profile ?? null;
}

export async function getProfile(id: number, token?: string): Promise<IProfile | null> {
  const data: any = await apiCall(`/profile/${id}`, { token });
  return data?.profile ?? null;
}

// Releases
export async function getRelease(id: number, token?: string): Promise<IRelease | null> {
  const data: any = await apiCall(`/release/${id}`, { token, params: { extended_mode: 'true' } });
  return data?.release ?? null;
}

export async function filterReleases(params: Record<string, any>, page: number = 0, token?: string): Promise<IRelease[]> {
  const qp: Record<string, any> = { extended_mode: 'true' };
  if (params.genres) qp.genres = params.genres;
  if (params.status_id) qp.status_id = params.status_id;
  if (params.category_id) qp.category_id = params.category_id;
  if (params.sort !== undefined) qp.sort = params.sort;
  if (params.types) qp.types = params.types;
  if (params.season) qp.season = params.season;
  if (params.start_year) qp.start_year = params.start_year;
  if (params.end_year) qp.end_year = params.end_year;
  const data: any = await apiCall(`/filter/${page}`, { params: qp, token });
  return data?.content ?? [];
}

// Dubbers & Sources & Episodes
export async function getDubbers(releaseId: number, token?: string): Promise<IDubber[]> {
  const data: any = await apiCall(`/episode/${releaseId}`, { token });
  return data?.types ?? [];
}

export async function getSources(releaseId: number, typeId: number, token?: string): Promise<ISource[]> {
  const data: any = await apiCall(`/episode/${releaseId}/${typeId}`, { token });
  return data?.sources ?? [];
}

export async function getEpisodes(releaseId: number, typeId: number, sourceId: number, token?: string): Promise<IEpisode[]> {
  const data: any = await apiCall(`/episode/${releaseId}/${typeId}/${sourceId}`, { token, params: { sort: '1' } });
  return data?.episodes ?? [];
}

// Search
export async function searchReleases(query: string, page: number = 0, token?: string): Promise<IRelease[]> {
  const data: any = await apiCall(`/search/releases/${page}`, { params: { query }, token });
  return data?.content ?? [];
}

// Schedule
export async function getSchedule(token?: string): Promise<Record<string, IRelease[]>> {
  const data: any = await apiCall('/schedule', { token });
  const days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
  const result: Record<string, IRelease[]> = {};
  for (const d of days) result[d] = data?.[d] ?? [];
  return result;
}

// Profile lists (bookmarks)
export async function getProfileList(status: number, page: number = 0, token?: string): Promise<IRelease[]> {
  const data: any = await apiCall(`/profile/list/all/${status}/${page}`, { token });
  return data?.content ?? [];
}

export async function addToProfileList(releaseId: number, status: number, token: string): Promise<boolean> {
  const data: any = await apiCall(`/profile/list/add/${status}/${releaseId}`, { token });
  return data?.code === 0;
}

export async function removeFromProfileList(releaseId: number, status: number, token: string): Promise<boolean> {
  const data: any = await apiCall(`/profile/list/delete/${status}/${releaseId}`, { token });
  return data?.code === 0;
}

// History & Favorites
export async function getHistory(page: number = 0, token: string): Promise<any[]> {
  const data: any = await apiCall(`/history/${page}`, { token });
  return data?.content ?? [];
}

export async function getFavorites(page: number = 0, token: string): Promise<IRelease[]> {
  const data: any = await apiCall(`/favorite/all/${page}`, { token, params: { sort: '1', filter_announce: '0', filter: '0' } });
  return data?.content ?? [];
}

// Video links
export async function getDirectLink(embedUrl: string): Promise<string | null> {
  try {
    // Try Kodik parser (most common)
    const res = await fetch(embedUrl);
    const html = await res.text();

    // Kodik direct link extraction
    const hashMatch = html.match(/\w+\.hash\s*=\s*'(\w+)'/);
    const idMatch = html.match(/\w+\.id\s*=\s*'(\w+)'/);
    const typeMatch = html.match(/\w+\.type\s*=\s*'(\w+)'/) || html.match(/type:\s*'(\w+)'/);
    const urlParamsMatch = html.match(/var\s+urlParams\s*=\s*'(\{.*?\})'/);

    if (hashMatch && idMatch && typeMatch) {
      const params = urlParamsMatch ? JSON.parse(urlParamsMatch[1].replace(/\\"/g, '"')) : {};
      const qs = new URLSearchParams({
        ...params,
        type: typeMatch[1], hash: hashMatch[1], id: idMatch[1]
      }).toString();
      const linkRes = await fetch(`https://kodikplayer.com/ftor?${qs}`, {
        referrerPolicy: 'no-referrer'
      });
      const linkData = await linkRes.json();
      if (linkData?.links?.['720']?.[0]?.src) return linkData.links['720'][0].src;
      if (linkData?.links?.['480']?.[0]?.src) return linkData.links['480'][0].src;
      const allLinks = Object.values(linkData?.links ?? {});
      for (const arr of allLinks) {
        if (Array.isArray(arr) && arr[0]?.src) return arr[0].src;
      }
    }

    // Fallback: return the embed URL directly (for iframe playback)
    return embedUrl;
  } catch {
    return embedUrl;
  }
}
