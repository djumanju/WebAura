<script lang="ts">
  import type { IRelease } from './types';
  import ReleaseCard from './ReleaseCard.svelte';

  let { title, items, navigate }: {
    title: string; items: IRelease[]; navigate: (p: string, params?: any) => void;
  } = $props();
</script>

<section style="margin-bottom:28px">
  <h2 style="font-size:18px;font-weight:600;margin-bottom:12px">{title}</h2>
  <div style="display:flex;gap:12px;overflow-x:auto;padding-bottom:8px">
    {#each items as item}
      <ReleaseCard release={item} {navigate} />
    {/each}
  </div>
</section>
