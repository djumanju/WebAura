<script lang="ts">
  import { onMount } from 'svelte';
  import type { IProfile } from '../lib/types';
  import * as api from '../lib/api';

  let { token, navigate, onLogout }: {
    token: string | null; navigate: (p: string, params?: any) => void; onLogout: () => void;
  } = $props();

  let profile = $state<IProfile | null>(null);
  let loading = $state(true);

  onMount(async () => {
    if (!token) { loading = false; return; }
    try {
      profile = await api.getMyProfile(token);
    } catch (e) { console.error(e); }
    loading = false;
  });

  function handleLogout() {
    onLogout();
  }
</script>

<div style="max-width:600px;margin:0 auto;text-align:center">
  {#if loading}
    <p style="color:var(--text3)">Загрузка...</p>
  {:else if !token}
    <div style="padding:40px 0">
      <p style="color:var(--text3);margin-bottom:16px">Вы не авторизованы</p>
      <button onclick={() => navigate('login')} style="padding:10px 24px;background:var(--accent);color:#fff;border-radius:var(--radius-sm);font-size:14px">Войти</button>
    </div>
  {:else if profile}
    <img src={profile.avatar} alt="" style="width:80px;height:80px;border-radius:50%;object-fit:cover;margin-bottom:12px" />
    <h2 style="font-size:20px;font-weight:600;margin-bottom:4px">{profile.login}</h2>
    {#if profile.about}
      <p style="font-size:13px;color:var(--text2);margin-bottom:20px">{profile.about}</p>
    {/if}
    <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:24px">
      <button onclick={() => navigate('bookmarks')} style="padding:8px 16px;background:var(--bg3);border-radius:var(--radius-sm);font-size:13px">Закладки</button>
    </div>
    <button onclick={handleLogout} style="padding:8px 16px;background:var(--red);border-radius:var(--radius-sm);font-size:13px;color:#fff">Выйти</button>
  {:else}
    <p style="color:var(--text3)">Профиль не найден</p>
  {/if}
</div>
