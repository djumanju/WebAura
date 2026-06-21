<script lang="ts">
  let { page, navigate, class: className = '' }: {
    page: string; navigate: (p: string) => void; class?: string;
  } = $props();
</script>

<nav class="sidebar {className}">
  <div class="sidebar-logo">Aura</div>
  <button class="nav-item" class:active={page === 'home'} onclick={() => navigate('home')}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 12 9-9 9 9"/><path d="M5 10v10a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V10"/></svg>
    Главная
  </button>
  <button class="nav-item" class:active={page === 'search'} onclick={() => navigate('search')}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
    Поиск
  </button>
  <button class="nav-item" class:active={page === 'schedule'} onclick={() => navigate('schedule')}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
    Расписание
  </button>
  <button class="nav-item" class:active={page === 'bookmarks'} onclick={() => navigate('bookmarks')}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
    Закладки
  </button>
  <button class="nav-item" class:active={page === 'profile'} onclick={() => navigate('profile')}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    Профиль
  </button>
</nav>
