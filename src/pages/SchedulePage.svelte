<script lang="ts">
  import { onMount } from 'svelte';
  import type { IRelease } from '../lib/types';
  import * as api from '../lib/api';
  import ReleaseCard from '../lib/ReleaseCard.svelte';

  let { token, navigate }: {
    token: string | null; navigate: (p: string, params?: any) => void;
  } = $props();

  let schedule = $state<Record<string, IRelease[]>>({});
  let loading = $state(true);
  let activeDay = $state('');

  const dayNames: Record<string, string> = {
    monday: 'Пн', tuesday: 'Вт', wednesday: 'Ср', thursday: 'Чт',
    friday: 'Пт', saturday: 'Сб', sunday: 'Вс'
  };
  const dayOrder = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

  onMount(async () => {
    try {
      schedule = await api.getSchedule(token || undefined);
      const today = new Date().getDay();
      const idx = today === 0 ? 6 : today - 1;
      activeDay = dayOrder[idx];
    } catch (e) { console.error(e); } finally { loading = false; }
  });
</script>

<div style="max-width:1000px">
  <h2 style="font-size:18px;font-weight:600;margin-bottom:12px">Расписание</h2>

  {#if loading}
    <p style="color:var(--text3)">Загрузка...</p>
  {:else}
    <div style="display:flex;gap:6px;margin-bottom:20px;flex-wrap:wrap">
      {#each dayOrder as d}
        <button
          onclick={() => activeDay = d}
          style="padding:8px 14px;border-radius:var(--radius-sm);font-size:13px;background:{activeDay === d ? 'var(--accent)' : 'var(--bg3)'};color:#fff;flex:1;min-width:50px"
        >{dayNames[d] || d}</button>
      {/each}
    </div>

    {#if activeDay && schedule[activeDay]?.length}
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px">
        {#each schedule[activeDay] as item}
          <ReleaseCard release={item} {navigate} />
        {/each}
      </div>
    {:else if activeDay}
      <p style="color:var(--text3)">Нет релизов на этот день</p>
    {/if}
  {/if}
</div>
