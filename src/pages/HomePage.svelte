<script lang="ts">
  import { onMount } from 'svelte';
  import type { IRelease } from '../lib/types';
  import * as api from '../lib/api';
  import Shelf from '../lib/Shelf.svelte';

  let { navigate, token }: { navigate: (p: string, params?: any) => void; token: string | null } = $props();

  let featured = $state<IRelease[]>([]);
  let newReleases = $state<IRelease[]>([]);
  let popular = $state<IRelease[]>([]);
  let loading = $state(true);

  onMount(async () => {
    try {
      const [f, n, p] = await Promise.all([
        api.filterReleases({ sort: 13, types: '1,2,3,4,5,6,7,8,9,10' }, 0, token || undefined),
        api.filterReleases({ sort: 5, types: '1,2,3,4,5,6,7,8,9,10' }, 0, token || undefined),
        api.filterReleases({ sort: 11, types: '1,2,3,4,5,6,7,8,9,10' }, 0, token || undefined),
      ]);
      featured = f.slice(0, 20);
      newReleases = n.slice(0, 20);
      popular = p.slice(0, 20);
    } catch (e) {
      console.error('Home load error', e);
    } finally {
      loading = false;
    }
  });
</script>

<div style="max-width:1200px">
  {#if loading}
    <p style="color:var(--text3)">Загрузка...</p>
  {:else}
    <Shelf title="Топ" items={featured} {navigate} />
    <Shelf title="Новинки" items={newReleases} {navigate} />
    <Shelf title="Популярное" items={popular} {navigate} />
  {/if}
</div>
