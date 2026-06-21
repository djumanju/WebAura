<script lang="ts">
  import { onMount } from 'svelte';
  import type { IRelease, IDubber, ISource, IEpisode } from '../lib/types';
  import * as api from '../lib/api';
  import { posterUrl, formatRating, formatDuration } from '../lib/helpers';

  let { id, navigate, token }: {
    id: number; navigate: (p: string, params?: any) => void; token: string | null;
  } = $props();

  let release = $state<IRelease | null>(null);
  let dubbers = $state<IDubber[]>([]);
  let sources = $state<ISource[]>([]);
  let episodes = $state<IEpisode[]>([]);

  let selectedDubber = $state<number | null>(null);
  let selectedSource = $state<number | null>(null);
  let loading = $state(true);
  let descExpanded = $state(false);

  const statusLabels: Record<number, string> = { 1: 'Онгоинг', 2: 'Вышел', 3: 'Анонс' };

  async function selectDubber(dId: number) {
    selectedDubber = dId;
    selectedSource = null;
    episodes = [];
    sources = [];
    try {
      sources = await api.getSources(id, dId, token || undefined);
      if (sources.length > 0) {
        selectedSource = sources[0].id;
        episodes = await api.getEpisodes(id, dId, sources[0].id, token || undefined);
      }
    } catch (e) { console.error(e); }
  }

  async function selectSource(sId: number) {
    selectedSource = sId;
    episodes = [];
    try {
      episodes = await api.getEpisodes(id, selectedDubber!, sId, token || undefined);
    } catch (e) { console.error(e); }
  }

  onMount(async () => {
    try {
      release = await api.getRelease(id, token || undefined);
      dubbers = await api.getDubbers(id, token || undefined);
      if (dubbers.length > 0) await selectDubber(dubbers[0].id);
    } catch (e) {
      console.error('Release page error', e);
    } finally {
      loading = false;
    }
  });
</script>

<div style="max-width:1000px">
  {#if loading}
    <p style="color:var(--text3)">Загрузка...</p>
  {:else if release}
    <div style="display:flex;gap:24px;margin-bottom:24px;flex-wrap:wrap">
      <div style="width:220px;flex-shrink:0">
        <div style="aspect-ratio:3/4;border-radius:var(--radius-md);overflow:hidden;background:var(--bg3)">
          {#if release.poster || release.image}
            <img src={posterUrl(release.poster || release.image)} alt={release.title_ru} style="width:100%;height:100%;object-fit:cover" />
          {/if}
        </div>
      </div>
      <div style="flex:1;min-width:200px">
        <h1 style="font-size:22px;font-weight:700;margin-bottom:4px">{release.title_ru || release.title_original}</h1>
        {#if release.title_original && release.title_ru !== release.title_original}
          <p style="font-size:13px;color:var(--text3);margin-bottom:8px">{release.title_original}</p>
        {/if}
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">
          <span style="padding:3px 8px;background:var(--accent);color:#fff;border-radius:4px;font-size:12px;font-weight:600">{formatRating(release.rating)}</span>
          <span style="padding:3px 8px;background:var(--bg3);border-radius:4px;font-size:12px">{statusLabels[release.status?.id] || release.status?.name}</span>
          {#if release.age_rating > 0}
            <span style="padding:3px 8px;background:var(--bg3);border-radius:4px;font-size:12px">{release.age_rating}+</span>
          {/if}
        </div>
        <div style="display:grid;grid-template-columns:auto 1fr;gap:3px 12px;font-size:13px;margin-bottom:12px">
          <span style="color:var(--text3)">Год</span><span>{release.year}</span>
          <span style="color:var(--text3)">Страна</span><span>{release.country}</span>
          <span style="color:var(--text3)">Жанры</span><span>{release.genres}</span>
          <span style="color:var(--text3)">Студия</span><span>{release.studio}</span>
          <span style="color:var(--text3)">Эпизоды</span><span>{release.episodes_released}/{release.episodes_total || '?'}</span>
          {#if release.duration}
            <span style="color:var(--text3)">Длительность</span><span>{formatDuration(release.duration)}</span>
          {/if}
        </div>
        <p style="font-size:13px;color:var(--text2);line-height:1.5;margin-bottom:8px"
           class:clamp={!descExpanded}>{release.description}</p>
        {#if release.description && release.description.length > 200}
          <button onclick={() => descExpanded = !descExpanded} style="font-size:12px;color:var(--accent)">
            {descExpanded ? 'Скрыть' : 'Показать всё'}
          </button>
        {/if}
      </div>
    </div>

    <!-- Эпизоды -->
    <div style="margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:10px">Озвучка</h3>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        {#each dubbers as d}
          <button
            onclick={() => selectDubber(d.id)}
            style="padding:6px 12px;border-radius:var(--radius-sm);font-size:13px;background:{selectedDubber === d.id ? 'var(--accent)' : 'var(--bg3)'};color:#fff"
          >{d.name}</button>
        {/each}
        {#if dubbers.length === 0}<span style="font-size:13px;color:var(--text3)">Нет доступных озвучек</span>{/if}
      </div>
    </div>

    {#if sources.length > 0}
      <div style="margin-bottom:16px">
        <h3 style="font-size:16px;font-weight:600;margin-bottom:10px">Источник</h3>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          {#each sources as s}
            <button
              onclick={() => selectSource(s.id)}
              style="padding:6px 12px;border-radius:var(--radius-sm);font-size:13px;background:{selectedSource === s.id ? 'var(--accent)' : 'var(--bg3)'};color:#fff"
            >{s.name}</button>
          {/each}
        </div>
      </div>
    {/if}

    {#if episodes.length > 0}
      <div>
        <h3 style="font-size:16px;font-weight:600;margin-bottom:10px">Эпизоды</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:6px">
          {#each episodes as ep}
            <button
              onclick={() => {
                if (ep.iframe) navigate('player', { url: ep.url });
                else navigate('player', { url: ep.url });
              }}
              style="padding:8px;border-radius:var(--radius-sm);font-size:13px;background:var(--bg-card);border:1px solid var(--border);text-align:center"
            >{ep.position}</button>
          {/each}
        </div>
      </div>
    {/if}

    {#if release.recommended_releases?.length}
      <div style="margin-top:28px">
        <h3 style="font-size:16px;font-weight:600;margin-bottom:10px">Рекомендуемые</h3>
        <div style="display:flex;gap:12px;overflow-x:auto;padding-bottom:8px">
          {#each release.recommended_releases as rec}
            <button style="flex-shrink:0;width:120px;background:var(--bg-card);border-radius:var(--radius-md);overflow:hidden;text-align:left;border:none;padding:0;cursor:pointer"
              onclick={() => navigate('release', { id: rec.id })}>
              <div style="aspect-ratio:3/4;background:var(--bg3)">
                {#if rec.poster || rec.image}
                  <img src={posterUrl(rec.poster || rec.image)} alt="" style="width:100%;height:100%;object-fit:cover" loading="lazy" />
                {/if}
              </div>
              <div style="padding:6px 8px;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{rec.title_ru}</div>
            </button>
          {/each}
        </div>
      </div>
    {/if}
  {:else}
    <p style="color:var(--text3)">Релиз не найден</p>
  {/if}
</div>

<style>
  .clamp { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
</style>
