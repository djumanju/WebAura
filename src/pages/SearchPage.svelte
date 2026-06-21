<script lang="ts">
  import { onMount } from 'svelte';
  import type { IRelease } from '../lib/types';
  import * as api from '../lib/api';
  import ReleaseCard from '../lib/ReleaseCard.svelte';

  let { query, navigate, token }: {
    query: string; navigate: (p: string, params?: any) => void; token: string | null;
  } = $props();

  let results = $state<IRelease[]>([]);
  let loading = $state(false);

  let filterGenres = $state('');
  let filterCategory = $state('');
  let filterStatus = $state('');
  let filterSort = $state(0);
  let showFilters = $state(false);

  async function doSearch() {
    loading = true;
    try {
      if (query.trim()) {
        results = await api.searchReleases(query, 0, token || undefined);
      } else {
        results = await api.filterReleases({
          genres: filterGenres || undefined,
          category_id: filterCategory ? Number(filterCategory) : undefined,
          status_id: filterStatus ? Number(filterStatus) : undefined,
          sort: filterSort || undefined,
          types: '1,2,3,4,5,6,7,8,9,10'
        }, 0, token || undefined);
      }
    } catch (e) {
      console.error('Search error', e);
    } finally {
      loading = false;
    }
  }

  onMount(doSearch);
  $effect(() => { query; doSearch(); });
</script>

<div style="max-width:1200px">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;flex-wrap:wrap">
    <button onclick={() => showFilters = !showFilters} style="padding:8px 14px;background:var(--bg3);border-radius:var(--radius-sm);font-size:13px">
      Фильтры
    </button>
  </div>

  {#if showFilters}
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;padding:12px;background:var(--bg2);border-radius:var(--radius-md)">
      <input placeholder="Жанры (через запятую)" bind:value={filterGenres} style="width:160px" />
      <select bind:value={filterCategory} style="padding:8px 12px;background:var(--bg-input);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text);font-size:13px">
        <option value="">Категория</option>
        <option value="1">Аниме</option>
        <option value="2">Манга</option>
        <option value="3">Ранобэ</option>
      </select>
      <select bind:value={filterStatus} style="padding:8px 12px;background:var(--bg-input);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text);font-size:13px">
        <option value="">Статус</option>
        <option value="1">Онгоинг</option>
        <option value="2">Вышел</option>
        <option value="3">Анонс</option>
      </select>
      <select bind:value={filterSort} style="padding:8px 12px;background:var(--bg-input);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text);font-size:13px">
        <option value={0}>По дате</option>
        <option value={11}>По рейтингу</option>
        <option value={5}>По названию</option>
      </select>
      <button onclick={doSearch} style="padding:8px 16px;background:var(--accent);border-radius:var(--radius-sm);color:#fff;font-size:13px">Применить</button>
    </div>
  {/if}

  {#if loading}
    <p style="color:var(--text3)">Поиск...</p>
  {:else if results.length === 0}
    <p style="color:var(--text3)">Ничего не найдено</p>
  {:else}
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px">
      {#each results as item}
        <ReleaseCard release={item} {navigate} />
      {/each}
    </div>
  {/if}
</div>
