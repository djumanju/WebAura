<script lang="ts">
  import * as api from '../lib/api';

  let { navigate, onLogin }: {
    navigate: (p: string, params?: any) => void; onLogin: (token: string) => void;
  } = $props();

  let login = $state('');
  let password = $state('');
  let error = $state('');
  let loading = $state(false);

  async function doLogin(e: Event) {
    e.preventDefault();
    error = '';
    loading = true;
    try {
      const token = await api.loginAnix(login, password);
      if (token) onLogin(token);
      else error = 'Неверный логин или пароль';
    } catch (e: any) {
      error = e.message || 'Ошибка входа';
    } finally {
      loading = false;
    }
  }
</script>

<div style="max-width:380px;margin:60px auto">
  <h2 style="font-size:22px;font-weight:700;margin-bottom:20px;text-align:center">Вход</h2>
  <form onsubmit={doLogin} style="display:flex;flex-direction:column;gap:12px">
    <input type="text" placeholder="Логин" bind:value={login} required />
    <input type="password" placeholder="Пароль" bind:value={password} required />
    {#if error}
      <p style="color:var(--red);font-size:13px">{error}</p>
    {/if}
    <button type="submit" disabled={loading} style="padding:12px;background:var(--accent);color:#fff;border-radius:var(--radius-sm);font-size:14px;font-weight:600;width:100%">
      {loading ? 'Вход...' : 'Войти'}
    </button>
  </form>
  <button onclick={() => navigate('home')} style="width:100%;text-align:center;margin-top:12px;font-size:13px;color:var(--text3)">
    На главную
  </button>
</div>
