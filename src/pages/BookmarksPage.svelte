<script lang="ts">
  import { onMount } from 'svelte';
  import type { IRelease } from '../lib/types';
  import * as api from '../lib/api';
  import ReleaseCard from '../lib/ReleaseCard.svelte';

  let { token, navigate, onLoginNeeded }: {
    token: string | null; navigate: (p: string, params?: any) => void; onLoginNeeded: () => void;
  } = $props();

  let releases = $state<IRelease[]>([]);
  let loading = $state(true);
  let activeTab = $state(0);

  const tabs = [
    { id: 0, name: 'Просмотрено' },
    { id: 1, name: 'Смотрю' },
    { id: 2, name: 'Буду смотреть' },
    { id: 3, name: 'Брошено' },
    { id: 4, name: 'Любимое' },
  ];

  async function load() {
    if (!token) { loading = false; return; }
    loading = true;
    try {
      if (activeTab === 4) {
        releases = await api.getFavorites(0, token);
      } else {
        releases = await api.getProfileList(activeTab, 0, token);
      }
    } catch (e) { console.error(e); } finally { loading = false; }
  }

  onMount(() => { if (!token) onLoginNeeded(); else load(); });
  $effect(() => { activeTab; load(); });
</script>

<div style="max-width:1000px">
  <h2 style="font-size:18px;font-weight:600;margin-bottom:12px">Закладки</h2>

  {#if !token}
    <p style="color:var(--text3)">Войдите, чтобы увидеть закладки</p>
  {:else}
    <div style="display:flex;gap:6px;margin-bottom:20px;flex-wrap:wrap">
      {#each tabs as tab}
        <button
          onclick={() => activeTab = tab.id}
          style="padding:8px 14px;border-radius:var(--radius-sm);font-size:13px;background:{activeTab === tab.id ? 'var(--accent)' : 'var(--bg3)'};color:#fff"
        >{tab.name}</button>
      {/each}
    </div>

    {#if loading}
      <p style="color:var(--text3)">Загрузка...</p>
    {:else if releases.length === 0}
      <p style="color:var(--text3)">Пусто</p>
    {:else}
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px">
        {#each releases as item}
          <ReleaseCard release={item} {navigate} />
        {/each}
      </div>
    {/if}
  {/if}
</div>
