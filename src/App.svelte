<script lang="ts">
  import './global.scss';
  import Sidebar from './lib/Sidebar.svelte';
  import Topbar from './lib/Topbar.svelte';
  import HomePage from './pages/HomePage.svelte';
  import SearchPage from './pages/SearchPage.svelte';
  import ReleasePage from './pages/ReleasePage.svelte';
  import PlayerPage from './pages/PlayerPage.svelte';
  import LoginPage from './pages/LoginPage.svelte';
  import ProfilePage from './pages/ProfilePage.svelte';
  import SchedulePage from './pages/SchedulePage.svelte';
  import BookmarksPage from './pages/BookmarksPage.svelte';
  let page = $state('home');
  let params = $state({}) as Record<string, any>;
  let sidebarOpen = $state(false);
  let token = $state(localStorage.getItem('aura_token'));
  let user = $state(null) as any | null;

  function navigate(target: string, p: Record<string, any> | null = null) {
    page = target;
    params = p ?? {};
    sidebarOpen = false;
    const path = target === 'home' ? '/' : `/${target}`;
    history.pushState({ page: target, params: p ?? {} }, '', path);
  }

  function openToStart() {
    const path = location.pathname.slice(1);
    if (path) {
      const segs = path.split('/');
      page = segs[0];
      params = segs.length > 1 ? { id: Number(segs[1]) || segs[1] } : {};
    }
  }

  function handleSearch(q: string) {
    if (q.trim()) {
      navigate('search', { q: q.trim() });
    }
  }

  $effect(() => {
    if (token) {
      localStorage.setItem('aura_token', token);
      import('./lib/api').then(m => m.getMyProfile(token!)).then(p => { if (p) user = p; });
    } else {
      localStorage.removeItem('aura_token');
      user = null;
    }
  });

  $effect(() => {
    const handler = () => openToStart();
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  });

  openToStart();
</script>

<div class="app-layout">
  {#if sidebarOpen}
    <div class="sidebar-backdrop show" role="button" tabindex="-1" onclick={() => sidebarOpen = false} onkeydown={() => {}}></div>
  {/if}
  <Sidebar {page} {navigate} class={sidebarOpen ? 'open' : ''} />
  <div class="main-area">
    <Topbar {page} {navigate} {handleSearch} onMenuClick={() => sidebarOpen = !sidebarOpen} {token} {user} />
    <div class="page-content">
      {#if page === 'home'}
        <HomePage {navigate} {token} />
      {:else if page === 'search'}
        <SearchPage query={params.q || ''} {navigate} {token} />
      {:else if page === 'release'}
        <ReleasePage id={Number(params.id)} {navigate} {token} />
      {:else if page === 'player'}
        <PlayerPage url={params.url || ''} />
      {:else if page === 'login'}
        <LoginPage {navigate} onLogin={(t) => { token = t; navigate('home'); }} />
      {:else if page === 'profile'}
        <ProfilePage {token} {navigate} onLogout={() => { token = null; navigate('home'); }} />
      {:else if page === 'schedule'}
        <SchedulePage {token} {navigate} />
      {:else if page === 'bookmarks'}
        <BookmarksPage {token} {navigate} onLoginNeeded={() => navigate('login')} />
      {/if}
    </div>
  </div>
</div>
