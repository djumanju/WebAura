<script lang="ts">
  import type { IRelease } from './types';
  import { posterUrl, formatRating } from './helpers';

  let { release, navigate }: {
    release: IRelease; navigate: (p: string, params?: any) => void;
  } = $props();
</script>

<button style="flex-shrink:0;text-align:left;background:var(--bg-card);border-radius:var(--radius-md);overflow:hidden;width:150px;cursor:pointer;border:none;padding:0;transition:transform 0.15s"
  onclick={() => navigate('release', { id: release.id })}
  onmouseenter={(e) => (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)'}
  onmouseleave={(e) => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
>
  <div style="position:relative;aspect-ratio:3/4;background:var(--bg3)">
    {#if release.poster || release.image}
      <img src={posterUrl(release.poster || release.image)} alt={release.title_ru} style="width:100%;height:100%;object-fit:cover" loading="lazy" />
    {/if}
    <div style="position:absolute;top:6px;right:6px;background:var(--accent);color:#fff;font-size:11px;font-weight:700;padding:2px 6px;border-radius:4px">
      {formatRating(release.rating)}
    </div>
  </div>
  <div style="padding:8px 10px 10px">
    <div style="font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{release.title_ru || release.title_original}</div>
    <div style="font-size:11px;color:var(--text3);margin-top:2px">
      {release.category?.name} · {release.year}
    </div>
  </div>
</button>
