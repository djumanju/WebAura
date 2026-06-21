<script lang="ts">
  import { onMount } from 'svelte';
  import * as api from '../lib/api';

  let { url }: { url: string } = $props();

  let directUrl = $state('');
  let isIframe = $state(false);
  let loading = $state(true);

  async function initHls() {
    const video = document.getElementById('hls-video') as HTMLVideoElement;
    if (!video || !directUrl) return;
    try {
      const Hls = (await import('hls.js')).default;
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(directUrl);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = directUrl;
      }
    } catch {
      video.src = directUrl;
    }
  }

  $effect(() => {
    if (!loading && directUrl && !isIframe && directUrl.endsWith('.m3u8')) {
      requestAnimationFrame(() => initHls());
    }
  });

  onMount(async () => {
    if (!url) { loading = false; return; }

    if (url.endsWith('.m3u8') || url.includes('.mp4')) {
      directUrl = url;
      isIframe = false;
      loading = false;
      return;
    }

    if (url.startsWith('http') && (url.includes('kodik') || url.includes('sibnet') || url.includes('animego'))) {
      try {
        const direct = await api.getDirectLink(url);
        if (direct && direct !== url) {
          directUrl = direct;
          isIframe = !direct.endsWith('m3u8') && !direct.includes('.mp4');
        } else {
          isIframe = true;
          directUrl = url;
        }
      } catch {
        isIframe = true;
        directUrl = url;
      }
    } else {
      isIframe = true;
      directUrl = url;
    }
    loading = false;
  });
</script>

<div style="max-width:960px;margin:0 auto;display:flex;flex-direction:column;gap:16px">
  <button onclick={() => history.back()} style="color:var(--accent);font-size:13px;display:flex;align-items:center;gap:4px;padding:4px 0">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
    Назад
  </button>

  {#if loading}
    <p style="color:var(--text3);text-align:center;padding:40px">Загрузка видео...</p>
  {:else if !url}
    <p style="color:var(--text3);text-align:center;padding:40px">Видео не найдено</p>
  {:else if isIframe}
    <div style="position:relative;width:100%;aspect-ratio:16/9;background:#000;border-radius:var(--radius-md);overflow:hidden">
      <iframe src={directUrl} title="Видеоплеер" style="position:absolute;inset:0;width:100%;height:100%;border:none" allowfullscreen allow="autoplay;fullscreen"></iframe>
    </div>
  {:else}
    <div style="position:relative;width:100%;aspect-ratio:16/9;background:#000;border-radius:var(--radius-md);overflow:hidden">
      {#if directUrl.endsWith('.m3u8')}
        <video id="hls-video" style="width:100%;height:100%" controls autoplay aria-label="Видео"><track kind="captions" /></video>
      {:else}
        <video src={directUrl} style="width:100%;height:100%" controls autoplay aria-label="Видео"><track kind="captions" /></video>
      {/if}
    </div>
  {/if}
</div>
