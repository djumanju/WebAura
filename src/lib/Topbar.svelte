<script lang="ts">
  let { page, navigate, handleSearch, onMenuClick, token, user }: {
    page: string; navigate: (p: string) => void; handleSearch: (q: string) => void;
    onMenuClick: () => void; token: string | null; user: any;
  } = $props();

  let searchVal = $state('');

  function doSearch(e: Event) {
    e.preventDefault();
    handleSearch(searchVal);
  }
</script>

<header class="topbar">
  <button onclick={onMenuClick} aria-label="Меню" style="display:flex;align-items:center;padding:4px;background:none;border:none;color:var(--text2)">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
  </button>
  <form class="topbar-search" onsubmit={doSearch}>
    <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
    <input type="text" placeholder="Поиск..." bind:value={searchVal} />
  </form>
  <div style="margin-left:auto;display:flex;align-items:center;gap:10px">
    {#if token && user}
      <button class="nav-item" style="padding:4px 8px" onclick={() => navigate('profile')}>
        <img src={user.avatar} alt="" style="width:28px;height:28px;border-radius:50%;object-fit:cover" />
        <span style="font-size:13px">{user.login}</span>
      </button>
    {:else}
      <button class="nav-item" style="padding:4px 8px" onclick={() => navigate('login')}>Войти</button>
    {/if}
  </div>
</header>
