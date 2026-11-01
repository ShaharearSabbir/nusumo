/* ==========================================================================
   Nusumo Admin — shell
   Sidebar · topbar · command palette · popovers · menus · sheets · toasts
   ========================================================================== */
(function () {
  const AD = window.ADMIN;
  const A = {};
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));

  /* ---------------------------------------------------------------- icons */
  const P = {
    home: '<path d="M3 10.4 12 3l9 7.4V21a1 1 0 0 1-1 1h-5v-6.4H9V22H4a1 1 0 0 1-1-1Z"/>',
    grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.6"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    users: '<circle cx="9" cy="8.5" r="3.2"/><path d="M2.8 20a6.2 6.2 0 0 1 12.4 0"/><path d="M16.2 5.6a3.2 3.2 0 0 1 0 6M17.5 14.2A5.4 5.4 0 0 1 21.5 19"/>',
    user: '<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>',
    card: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19M6.5 15h4"/>',
    film: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9.5h18M3 14.5h18"/>',
    zap: '<path d="M13 3 5 13.5h6L11 21l8-10.5h-6Z"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2 2 2 0 1 1-4 0 1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 15a2 2 0 1 1 0-4 1.7 1.7 0 0 0 1.4-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 4.6a2 2 0 1 1 4 0A1.7 1.7 0 0 0 16.9 6l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 21 11a2 2 0 1 1 0 4 1.7 1.7 0 0 0-1.6 1Z"/>',
    shield: '<path d="M12 3 5 6v5.5c0 4.6 3 8 7 9.5 4-1.5 7-4.9 7-9.5V6Z"/><path d="m9 12 2 2 4-4"/>',
    search: '<circle cx="11" cy="11" r="6.4"/><path d="m20 20-4.3-4.3"/>',
    bell: '<path d="M18 8.5a6 6 0 1 0-12 0c0 5-2 6.5-2 6.5h16s-2-1.5-2-6.5"/><path d="M10.3 19a2 2 0 0 0 3.4 0"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    chevronDown: '<path d="m6 9.5 6 6 6-6"/>',
    chevronUp: '<path d="m6 14.5 6-6 6 6"/>',
    chevronLeft: '<path d="m14.5 6-6 6 6 6"/>',
    chevronRight: '<path d="m9.5 6 6 6-6 6"/>',
    check: '<path d="m4.5 12.5 5 5 10-11"/>',
    arrowUp: '<path d="M12 20V4M6 10l6-6 6 6"/>',
    arrowDown: '<path d="M12 4v16M6 14l6 6 6-6"/>',
    arrowRight: '<path d="M4 12h16M14 6l6 6-6 6"/>',
    download: '<path d="M12 3v12M7.5 10.5 12 15l4.5-4.5M4 20h16"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.3-4.5M4 13a8 8 0 0 0 14.3 4.5"/><path d="M20 4v7h-7M4 20v-7h7"/>',
    alert: '<path d="M12 4 2.8 20h18.4Z"/><path d="M12 9.5v4.5M12 17h.01"/>',
    server: '<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/>',
    flag: '<path d="M5 21V4h9l1 2h5v9h-6l-1-2H5"/>',
    mail: '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    more: '<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>',
    info: '<circle cx="12" cy="12" r="8.6"/><path d="M12 11v6M12 7.5h.01"/>',
    external: '<path d="M14 4h6v6M20 4 11 13"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    clock: '<circle cx="12" cy="12" r="8.6"/><path d="M12 7.5V12l3.2 2"/>',
    eye: '<path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>',
    wallet: '<path d="M3.5 8.5V18a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-15Z"/><path d="M3.5 8.5V6a2 2 0 0 1 2-2h10"/><circle cx="16.5" cy="14.5" r="1.2"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5Z"/><path d="m3 13 9 5 9-5M3 18l9 5 9-5"/>',
    sliders: '<path d="M4 8h9M17 8h3M4 16h3M11 16h9"/><circle cx="15" cy="8" r="2"/><circle cx="9" cy="16" r="2"/>',
    ban: '<circle cx="12" cy="12" r="8.6"/><path d="m6 6 12 12"/>',
    dollar: '<path d="M12 3v18"/><path d="M17 7.5H9.8a2.8 2.8 0 0 0 0 5.6h4.4a2.8 2.8 0 0 1 0 5.6H6.5"/>',
    hash: '<path d="M5 9h15M4 15h15M10 3 8 21M17 3l-2 18"/>',
    help: '<circle cx="12" cy="12" r="8.6"/><path d="M9.6 9.2a2.5 2.5 0 1 1 3.6 2.3c-.8.4-1.2 1-1.2 1.9M12 17h.01"/>',
    eyeOff: '<path d="m3 3 18 18"/><path d="M10.6 6.1A9.9 9.9 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-3.2 3.9M6.3 6.4C4 8 2.5 12 2.5 12S6 18 12 18a9.7 9.7 0 0 0 4.2-.9"/>'
  };
  A.ic = (name, cls) => `<svg class="icon ${cls || ''}" viewBox="0 0 24 24" aria-hidden="true">${P[name] || P.more}</svg>`;
  A.esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  A.av = (u, size) => {
    const s = size || 32;
    return `<span class="av" style="--s:${s}px;--av-grad:${u.grad}" title="${A.esc(u.name)}" aria-label="${A.esc(u.name)}">${A.esc(u.initials)}</span>`;
  };

  /* ---------------------------------------------------------------- format */
  const NOW = new Date(AD.generatedAt).getTime();
  const nf = new Intl.NumberFormat('en-IN');
  function money(n) {
    const v = Math.round(Number(n) || 0);
    return '৳' + nf.format(v);
  }
  function moneyCompact(n) {
    const v = Math.abs(Number(n) || 0);
    const sign = n < 0 ? '-' : '';
    if (v >= 100000) return sign + '৳' + (v / 100000).toFixed(v >= 1000000 ? 0 : 1).replace(/\.0$/, '') + 'L';
    if (v >= 1000) return sign + '৳' + (v / 1000).toFixed(0) + 'k';
    return sign + '৳' + Math.round(v);
  }
  function num(n) { return nf.format(Math.round(Number(n) || 0)); }
  function compact(n) {
    const v = Math.abs(Number(n) || 0);
    if (v >= 1000000) return (Number(n) / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (v >= 1000) return (Number(n) / 1000).toFixed(v >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'K';
    return String(Math.round(Number(n) || 0));
  }
  function pct(v, digits) {
    const d = digits == null ? 1 : digits;
    return (Math.abs(v) < 0.05 ? 0 : v).toFixed(d) + '%';
  }
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function dateShort(iso) {
    const d = new Date(iso);
    return String(d.getUTCDate()).padStart(2, '0') + ' ' + MONTHS[d.getUTCMonth()];
  }
  function dateFull(iso) {
    const d = new Date(iso);
    return dateShort(iso) + ' ' + d.getUTCFullYear();
  }
  function rel(iso) {
    const diff = NOW - new Date(iso).getTime();
    if (diff < 60000) return 'just now';
    const m = Math.floor(diff / 60000);
    if (m < 60) return m + 'm ago';
    const h = Math.floor(m / 60);
    if (h < 24) return h + 'h ago';
    const d = Math.floor(h / 24);
    if (d < 7) return d + 'd ago';
    return dateShort(iso);
  }
  A.fmt = { money, moneyCompact, num, compact, pct, dateShort, dateFull, rel, now: () => NOW };

  /* ---------------------------------------------------------------- nav config */
  const NAV = [
    { id: 'overview', label: 'Overview', icon: 'grid', items: [
      { key: 'dashboard', label: 'Dashboard', href: 'admin.html', active: true },
      { key: 'analytics', label: 'Analytics', href: '#' },
      { key: 'reports', label: 'Reports', href: '#' }
    ]},
    { id: 'community', label: 'Community', icon: 'users', items: [
      { key: 'users', label: 'Users', href: '#' },
      { key: 'agencies', label: 'Agencies', href: '#' },
      { key: 'social', label: 'Social profiles', href: '#' },
      { key: 'bulk', label: 'Bulk messages', href: '#' },
      { key: 'moderation', label: 'Moderation', href: '#', sub: ['Queue', 'Rules', 'Logs'] }
    ]},
    { id: 'revenue', label: 'Revenue', icon: 'card', badge: 3, items: [
      { key: 'subs', label: 'Subscriptions', href: '#' },
      { key: 'tx', label: 'Transactions', href: '#' },
      { key: 'finance', label: 'Financial reports', href: '#' },
      { key: 'campaigns', label: 'Campaigns & donations', href: '#' },
      { key: 'payouts', label: 'Payouts', href: '#', count: 3 }
    ]},
    { id: 'content', label: 'Content', icon: 'film', items: [
      { key: 'posts', label: 'Posts', href: '#' },
      { key: 'reels', label: 'Reels', href: '#' },
      { key: 'rooms', label: 'Audio rooms', href: '#' },
      { key: 'live', label: 'Live streams', href: '#' },
      { key: 'media', label: 'Media library', href: '#' },
      { key: 'pages', label: 'Pages', href: '#' },
      { key: 'stickers', label: 'Stickers', href: '#' }
    ]},
    { id: 'growth', label: 'Growth', icon: 'zap', items: [
      { key: 'ads', label: 'Ads', href: '#' },
      { key: 'boost', label: 'Boosted posts', href: '#' },
      { key: 'promos', label: 'Promotions', href: '#' },
      { key: 'referrals', label: 'Referrals', href: '#' }
    ]},
    { id: 'config', label: 'Configuration', icon: 'settings', items: [
      { key: 'settings', label: 'Settings', href: '#' },
      { key: 'design', label: 'Design', href: '#' },
      { key: 'storage', label: 'Storage', href: '#' },
      { key: 'langs', label: 'Languages', href: '#' },
      { key: 'api', label: 'API keys', href: '#' },
      { key: 'integrations', label: 'Integrations', href: '#' }
    ]},
    { id: 'system', label: 'System', icon: 'shield', badge: 1, items: [
      { key: 'diag', label: 'Diagnostics', href: '#' },
      { key: 'jobs', label: 'Queues & jobs', href: '#' },
      { key: 'logs', label: 'Logs', href: '#' },
      { key: 'backups', label: 'Backups', href: '#' },
      { key: 'health', label: 'Health', href: '#' }
    ]}
  ];
  A.NAV = NAV;

  /* ---------------------------------------------------------------- storage */
  function readJSON(key, fallback) {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
    catch (e) { return fallback; }
  }
  function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* private mode */ }
  }
  let openGroups = new Set(readJSON('nusumo.admin.groups', ['overview']));
  let rail = readJSON('nusumo.admin.rail', false) === true;

  /* ---------------------------------------------------------------- nav markup */
  function navItem(item, inFlyout) {
    const extra = item.active ? 'is-active' : '';
    const href = item.href || '#';
    const count = item.count ? `<span class="a-nav-item__count">${item.count}</span>` : '';
    const main = `<a class="a-nav-item ${extra}" href="${href}" data-nav="${item.key}"${item.active ? ' aria-current="page"' : ''}>
        <span>${A.esc(item.label)}</span>${count}
      </a>`;
    if (!item.sub || inFlyout) return main;
    return main + item.sub.map((label, i) => `<a class="a-nav-item a-nav-item--sub" href="#" data-nav="${item.key}-${i + 1}"><span>${A.esc(label)}</span></a>`).join('');
  }

  function groupMarkup(g) {
    const open = openGroups.has(g.id);
    const current = g.items.some(it => it.active);
    return `<div class="a-group" data-group="${g.id}">
      <button class="a-group__head ${open ? 'is-open' : ''} ${current ? 'is-current' : ''}" data-action="toggle-group" data-group="${g.id}" aria-expanded="${open}" aria-controls="grp-${g.id}">
        <span class="a-group__icon">${A.ic(g.icon)}</span>
        <span class="a-group__label">${A.esc(g.label)}</span>
        ${g.badge ? `<span class="a-group__count">${g.badge}</span>` : ''}
        ${A.ic('chevronDown', 'a-group__caret')}
      </button>
      <div class="a-group__body" id="grp-${g.id}"${open ? '' : ' hidden'}>
        ${g.items.map(it => navItem(it, false)).join('')}
      </div>
      <div class="a-group__flyout">
        <div class="a-group__flyout-label">${A.esc(g.label)}</div>
        ${g.items.map(it => navItem(it, true)).join('')}
      </div>
    </div>`;
  }

  function renderSidebar() {
    const side = document.getElementById('aSide');
    side.innerHTML = `
      <div class="a-brand">
        <span class="a-brand__mark">N</span>
        <span class="a-brand__text">
          <span class="a-brand__name">Nusumo</span>
          <span class="a-brand__sub">Admin console</span>
        </span>
        <span class="a-brand__env">PROD</span>
        <button class="a-rail-btn" data-action="toggle-rail" aria-label="Collapse sidebar" aria-pressed="${rail}">${A.ic('chevronLeft')}</button>
      </div>

      <button class="a-account" data-action="account-menu" aria-haspopup="menu">
        ${A.av(AD.me, 32)}
        <span class="a-account__meta">
          <span class="a-account__name">${A.esc(AD.me.name)}</span>
          <span class="a-account__role">${A.esc(AD.me.role)}</span>
        </span>
        ${A.ic('chevronDown')}
      </button>

      <button class="a-search-btn" data-action="open-palette">
        ${A.ic('search')}<span>Search anything…</span><kbd>⌘K</kbd>
      </button>

      <nav class="a-nav" aria-label="Sections">
        ${NAV.map(groupMarkup).join('')}
      </nav>

      <div class="a-side__foot">
        <button data-action="system-health-pop">${'<span class="a-dot a-dot--warn"></span>'}<span>1 system warning</span></button>
        <span class="a-ver">v2.0</span>
        <button class="a-rail-btn a-rail-btn--foot" data-action="toggle-rail" aria-label="Expand sidebar" aria-expanded="false" aria-pressed="${rail}">${A.ic('chevronRight')}</button>
      </div>`;

    if (rail) document.body.classList.add('is-rail');
  }

  /* ---------------------------------------------------------------- topbar */
  const RANGES = [
    { key: '7d', label: '7d' },
    { key: '30d', label: '30d' },
    { key: '90d', label: '90d' },
    { key: '12m', label: '12m' }
  ];
  let currentRange = '30d';

  function rangeMarkup() {
    return `<div class="a-seg" role="group" aria-label="Date range">
      ${RANGES.map(r => `<button data-action="range" data-range="${r.key}" class="${r.key === currentRange ? 'is-active' : ''}" aria-pressed="${r.key === currentRange}">${r.label}</button>`).join('')}
    </div>`;
  }

  function renderTopbar() {
    const top = document.getElementById('aTop');
    const pendingCount = AD.attention.reduce((s, a) => s + a.count, 0);
    top.innerHTML = `
      <button class="a-icon-btn a-top__menu" data-action="open-drawer" aria-label="Open navigation">${A.ic('menu')}</button>
      <div class="a-top__titles">
        <span class="a-top__title">Dashboard</span>
        <span class="a-top__crumb">Admin <i>/</i> Overview <i>/</i> Dashboard</span>
      </div>
      <div class="a-top__actions">
        ${rangeMarkup()}
        <button class="a-pill" id="aPillTasks" data-action="tasks-pop" aria-haspopup="dialog" aria-expanded="false">
          Pending tasks <span class="a-pill__count">${pendingCount}</span>
        </button>
        <button class="a-pill a-pill--warn" data-action="health-pop" aria-haspopup="dialog" aria-expanded="false">
          <span class="a-dot a-dot--warn"></span><span class="a-pill__text">System health</span>
        </button>
        <button class="a-icon-btn" data-action="notif-pop" aria-label="Notifications" aria-haspopup="dialog" aria-expanded="false">
          ${A.ic('bell')}<span class="a-icon-btn__dot"></span>
        </button>
        <button class="a-avatar-btn" data-action="account-menu" aria-label="Account menu" aria-haspopup="menu">${A.av(AD.me, 30)}</button>
        <button class="a-top__kbd" data-action="open-palette" aria-label="Search">⌘K</button>
      </div>`;
  }

  function setRangeUI(range) {
    currentRange = range;
    $$('[data-action="range"]').forEach(b => {
      const on = b.dataset.range === range;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }
  A.setRangeUI = setRangeUI;

  /* ---------------------------------------------------------------- tabbar */
  function renderTabbar() {
    const bar = document.getElementById('aTabbar');
    bar.innerHTML = `<div class="a-tabbar__inner">
      <a class="a-tabbar__item is-active" href="admin.html" aria-current="page">${A.ic('grid')}<span>Overview</span></a>
      <button class="a-tabbar__item" data-nav="tab-revenue">${A.ic('card')}<span>Revenue</span></button>
      <button class="a-tabbar__item" data-nav="tab-community">${A.ic('users')}<span>Community</span></button>
      <button class="a-tabbar__item" data-action="open-drawer">${A.ic('menu')}<span>Menu</span></button>
    </div>`;
  }

  /* ---------------------------------------------------------------- toast */
  function toast(message, opts) {
    const root = document.getElementById('aToastRoot');
    if (!root) return;
    const o = typeof opts === 'string' ? { kind: opts } : (opts || {});
    const el = document.createElement('div');
    el.className = 'a-toast' + (o.kind ? ' a-toast--' + o.kind : '');
    el.innerHTML = `${A.ic(o.kind === 'bad' ? 'alert' : o.kind === 'warn' ? 'info' : 'check')}<span>${A.esc(message)}</span>` +
      (o.action ? `<button data-toast-action>${A.esc(o.action.label)}</button>` : '');
    root.appendChild(el);
    const remove = () => { el.classList.add('is-out'); setTimeout(() => el.remove(), 240); };
    if (o.action) el.querySelector('[data-toast-action]').addEventListener('click', () => { o.action.onClick && o.action.onClick(); remove(); });
    setTimeout(remove, o.duration || 3400);
  }
  A.toast = toast;

  /* ---------------------------------------------------------------- popover */
  const popEl = document.getElementById('aPop');
  let popAnchor = null;
  function onDocPointer(e) {
    if (!popAnchor) return;
    if (popEl.contains(e.target) || popAnchor.contains(e.target)) return;
    closePopover();
  }
  function closePopover() {
    if (!popAnchor) return;
    popEl.classList.remove('is-open');
    popEl.hidden = true;
    popAnchor.setAttribute('aria-expanded', 'false');
    const anchor = popAnchor;
    popAnchor = null;
    document.removeEventListener('pointerdown', onDocPointer, true);
    return anchor;
  }
  A.closePopover = closePopover;

  function popover(anchor, html) {
    if (popAnchor === anchor) { closePopover(); return; }
    if (popAnchor) closePopover();
    popEl.innerHTML = html;
    popEl.hidden = false;
    popEl.style.left = '0px'; popEl.style.top = '0px';
    const r = anchor.getBoundingClientRect();
    const w = popEl.offsetWidth;
    const h = popEl.offsetHeight;
    let left = Math.min(Math.max(10, r.right - w), window.innerWidth - w - 10);
    let top = r.bottom + 8;
    if (top + h > window.innerHeight - 10) top = Math.max(10, r.top - h - 8);
    popEl.style.left = left + 'px';
    popEl.style.top = top + 'px';
    requestAnimationFrame(() => popEl.classList.add('is-open'));
    anchor.setAttribute('aria-expanded', 'true');
    popAnchor = anchor;
    setTimeout(() => document.addEventListener('pointerdown', onDocPointer, true), 0);
  }
  A.popover = popover;

  /* ---------------------------------------------------------------- menu */
  let menuEl = null, menuAnchor = null;
  function closeMenu() {
    if (!menuEl) return;
    menuEl.classList.remove('is-open');
    const el = menuEl, anchor = menuAnchor;
    menuEl = null; menuAnchor = null;
    setTimeout(() => el.remove(), 140);
    if (anchor) anchor.setAttribute('aria-expanded', 'false');
  }
  function menu(anchor, items) {
    if (menuEl && menuAnchor === anchor) { closeMenu(); return; }
    closeMenu();
    const el = document.createElement('div');
    el.className = 'a-menu';
    el.setAttribute('role', 'menu');
    el.innerHTML = items.map((it, i) => {
      if (it.sep) return '<div class="a-menu__sep"></div>';
      if (it.label) return `<div class="a-menu__label">${A.esc(it.label)}</div>`;
      return `<button class="a-menu__item" role="menuitem" data-mi="${i}">${it.icon ? A.ic(it.icon) : ''}<span>${A.esc(it.text)}</span></button>`;
    }).join('');
    document.body.appendChild(el);
    el.style.left = '0px'; el.style.top = '0px';
    const r = anchor.getBoundingClientRect();
    const w = el.offsetWidth, h = el.offsetHeight;
    let left = Math.min(Math.max(8, r.right - w), window.innerWidth - w - 8);
    let top = r.bottom + 6;
    if (top + h > window.innerHeight - 8) top = Math.max(8, r.top - h - 6);
    el.style.left = left + 'px';
    el.style.top = top + 'px';
    requestAnimationFrame(() => el.classList.add('is-open'));
    el.addEventListener('click', e => {
      const btn = e.target.closest('[data-mi]');
      if (!btn) return;
      const it = items[Number(btn.dataset.mi)];
      closeMenu();
      if (it && it.onClick) it.onClick();
    });
    menuEl = el; menuAnchor = anchor;
    anchor.setAttribute('aria-expanded', 'true');
    setTimeout(() => {
      document.addEventListener('pointerdown', function off(ev) {
        if (menuEl && !menuEl.contains(ev.target) && !anchor.contains(ev.target)) {
          closeMenu();
        }
        if (!menuEl) document.removeEventListener('pointerdown', off, true);
      }, true);
    }, 0);
  }
  A.menu = menu;

  /* ---------------------------------------------------------------- sheet */
  const sheetRoot = document.getElementById('aSheetRoot');
  let sheetPrevFocus = null, sheetEsc = null;
  function trapFocus(container) {
    return function (e) {
      if (e.key !== 'Tab') return;
      const f = $$('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])', container)
        .filter(x => x.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
  }
  function closeSheet() {
    if (!sheetRoot.classList.contains('is-open')) return;
    sheetRoot.classList.remove('is-open');
    if (sheetEsc) { document.removeEventListener('keydown', sheetEsc.trap); document.removeEventListener('keydown', sheetEsc.esc); sheetEsc = null; }
    if (sheetPrevFocus && sheetPrevFocus.focus) sheetPrevFocus.focus();
    setTimeout(() => { if (!sheetRoot.classList.contains('is-open')) sheetRoot.innerHTML = ''; }, 260);
  }
  function sheet(opts) {
    sheetPrevFocus = document.activeElement;
    sheetRoot.innerHTML = `
      <div class="a-sheet-backdrop" data-close-sheet></div>
      <section class="a-sheet" role="dialog" aria-modal="true" aria-label="${A.esc(opts.title || 'Details')}" tabindex="-1">
        <div class="a-sheet__head">
          <div><h2>${A.esc(opts.title || '')}</h2>${opts.sub ? `<p>${opts.sub}</p>` : ''}</div>
          <button class="a-icon-btn" data-close-sheet aria-label="Close">${A.ic('x')}</button>
        </div>
        <div class="a-sheet__body">${opts.body || ''}</div>
        ${opts.foot ? `<div class="a-sheet__foot">${opts.foot}</div>` : ''}
      </section>`;
    requestAnimationFrame(() => sheetRoot.classList.add('is-open'));
    const panel = sheetRoot.querySelector('.a-sheet');
    sheetRoot.querySelectorAll('[data-close-sheet]').forEach(b => b.addEventListener('click', closeSheet));
    const trap = trapFocus(panel);
    const esc = (e) => { if (e.key === 'Escape') closeSheet(); };
    document.addEventListener('keydown', trap);
    document.addEventListener('keydown', esc);
    sheetEsc = { trap, esc };
    panel.focus();
    if (opts.onMount) opts.onMount(panel, closeSheet);
    return { panel, close: closeSheet };
  }
  A.sheet = sheet;
  A.closeSheet = closeSheet;

  /* ---------------------------------------------------------------- palette */
  const palette = document.getElementById('aPalette');
  const ACTIONS = [
    { key: 'export', label: 'Export dashboard CSV', icon: 'download', action: () => document.dispatchEvent(new CustomEvent('admin:export')) },
    { key: 'invite', label: 'Invite a user', icon: 'plus', action: () => A.inviteSheet() },
    { key: 'announce', label: 'Create an announcement', icon: 'bell', action: () => A.announceSheet() },
    { key: 'health', label: 'Run a health check', icon: 'shield', action: () => A.runHealthCheck() }
  ];

  const PAGE_ITEMS = NAV.reduce((acc, g) => acc.concat(g.items.map(it => ({
    label: it.label, icon: g.icon, sub: g.label, key: it.key, href: it.href
  }))), []);

  let paletteResults = [];
  let paletteSel = 0;

  function paletteItemsHTML(list) {
    return list.map((r, i) => `<button class="a-palette__item ${i === paletteSel ? 'is-sel' : ''}" data-pi="${i}" role="option" aria-selected="${i === paletteSel}">
      ${A.ic(r.icon || 'arrowRight')}<span>${A.esc(r.label)}</span>${r.sub ? `<small>${A.esc(r.sub)}</small>` : ''}
    </button>`).join('');
  }

  function buildPalette(query) {
    const q = (query || '').trim().toLowerCase();
    const score = (text) => {
      if (!q) return 0;
      const t = text.toLowerCase();
      if (t.startsWith(q)) return 100;
      if (t.includes(q)) return 60;
      let ti = 0;
      for (let i = 0; i < q.length; i++) {
        const idx = t.indexOf(q[i], ti);
        if (idx < 0) return -1;
        ti = idx + 1;
      }
      return 25;
    };
    const match = (list) => list
      .map(it => ({ it, s: q ? score(it.label + ' ' + (it.sub || '')) : 1 }))
      .filter(x => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .map(x => x.it);

    const groups = [];
    const pages = match(PAGE_ITEMS).slice(0, 8);
    if (pages.length) groups.push({ label: 'Pages', items: pages });

    if (q) {
      const users = match(AD.usersIndex.concat([{ id: AD.me.id, name: AD.me.name, handle: AD.me.handle }]).map(u => ({ label: u.name, sub: u.handle, icon: 'user', key: u.id }))).slice(0, 6);
      if (users.length) groups.push({ label: 'Users', items: users });

      const pay = match(AD.activity.filter(a => a.amount && (a.kind === 'payment' || a.kind === 'payout')).map(a => ({
        label: `${a.user.name} · ${money(a.amount)}`, sub: a.kind === 'payout' ? 'Payout' : a.product, icon: 'card', key: a.id
      }))).slice(0, 4);
      if (pay.length) groups.push({ label: 'Payments', items: pay });

      const acts = match(ACTIONS.map(a => ({ label: a.label, sub: 'Action', icon: a.icon, key: a.key, action: a.action }))).slice(0, 4);
      if (acts.length) groups.push({ label: 'Actions', items: acts });
    } else {
      groups.push({ label: 'Actions', items: ACTIONS.slice(0, 4).map(a => ({ label: a.label, sub: 'Action', icon: a.icon, key: a.key, action: a.action })) });
    }

    paletteResults = [];
    const body = groups.map(g => {
      const start = paletteResults.length;
      paletteResults = paletteResults.concat(g.items);
      return `<div class="a-palette__group"><div class="a-palette__group-label">${g.label}</div>
        <div role="listbox" aria-label="${g.label}">${g.items.map((it, i) => `<button class="a-palette__item ${paletteResults.length - g.items.length + i === paletteSel ? 'is-sel' : ''}" data-pi="${start + i}" role="option" aria-selected="${start + i === paletteSel}">
          ${A.ic(it.icon || 'arrowRight')}<span>${A.esc(it.label)}</span>${it.sub ? `<small>${A.esc(it.sub)}</small>` : ''}
        </button>`).join('')}</div></div>`;
    }).join('');

    const bodyEl = palette.querySelector('.a-palette__body');
    bodyEl.innerHTML = body || `<div class="a-palette__empty">No results for “${A.esc(query)}”</div>`;
    const input = palette.querySelector('input');
    input.setAttribute('aria-activedescendant', '');
  }

  function openPalette() {
    if (!palette.hidden) return;
    palette.hidden = false;
    paletteSel = 0;
    palette.innerHTML = `
      <div class="a-palette__panel">
        <div class="a-palette__search">
          ${A.ic('search')}
          <input type="text" placeholder="Search pages, users, payments…" aria-label="Search admin" autocomplete="off">
          <span class="a-palette__esc">ESC</span>
        </div>
        <div class="a-palette__body"></div>
        <div class="a-palette__foot"><span><kbd>↑</kbd><kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> open</span><span><kbd>esc</kbd> close</span></div>
      </div>`;
    buildPalette('');
    const input = palette.querySelector('input');
    input.focus();
    input.addEventListener('input', () => { paletteSel = 0; buildPalette(input.value); });
    palette.addEventListener('click', e => {
      if (e.target === palette) closePalette();
      const item = e.target.closest('[data-pi]');
      if (item) runPaletteItem(Number(item.dataset.pi));
    });
    palette.addEventListener('keydown', e => {
      const count = paletteResults.length;
      if (e.key === 'ArrowDown') { e.preventDefault(); paletteSel = Math.min(count - 1, paletteSel + 1); paintSel(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); paletteSel = Math.max(0, paletteSel - 1); paintSel(); }
      else if (e.key === 'Enter') { e.preventDefault(); runPaletteItem(paletteSel); }
      else if (e.key === 'Escape') { e.preventDefault(); closePalette(); }
    });
    function paintSel() {
      $$('.a-palette__item', palette).forEach((el, i) => {
        const on = i === paletteSel;
        el.classList.toggle('is-sel', on);
        el.setAttribute('aria-selected', on ? 'true' : 'false');
        if (on) {
          const body = palette.querySelector('.a-palette__body');
          const top = el.offsetTop - 8;
          if (el.offsetTop < body.scrollTop || el.offsetTop + el.offsetHeight > body.scrollTop + body.clientHeight) {
            body.scrollTop = top;
          }
        }
      });
    }
    paletteInputPaint = paintSel;
  }
  let paletteInputPaint = null;

  function closePalette() {
    palette.hidden = true;
    palette.innerHTML = '';
  }

  function runPaletteItem(i) {
    const it = paletteResults[i];
    if (!it) return;
    closePalette();
    if (it.action) { it.action(); return; }
    if (it.href === 'admin.html') { document.getElementById('aMain').scrollTo({ top: 0, behavior: 'smooth' }); toast('You are on the dashboard'); return; }
    if (it.href) { toast(`${it.label} is not part of this build`, 'warn'); return; }
    if (it.sub && it.sub.indexOf('@') === 0) { toast(`Opened ${it.label}`, { kind: 'ok' }); return; }
    toast(`Opened ${it.label}`, { kind: 'ok' });
  }

  A.openPalette = openPalette;
  A.closePalette = closePalette;

  /* ---------------------------------------------------------------- sheets used across the shell */
  A.inviteSheet = function () {
    sheet({
      title: 'Invite a user',
      sub: 'Send an invitation to join Nusumo.',
      body: `<div class="a-field"><label for="ivEmail">Email address</label><input class="a-input" id="ivEmail" type="email" placeholder="name@studio.com"></div>
        <div class="a-field"><label for="ivRole">Role</label><select class="a-select" id="ivRole"><option>Creator</option><option>Moderator</option><option>Finance</option><option>Administrator</option></select></div>
        <p class="a-form-note">Invitations expire after 7 days. The recipient sees your name and the workspace in the email.</p>`,
      foot: `<button class="a-btn a-btn--primary" data-send-invite>${A.ic('mail')}Send invitation</button><span class="a-spacer"></span><button class="a-btn a-btn--ghost" data-close-sheet>Cancel</button>`,
      onMount(panel, close) {
        panel.querySelector('[data-send-invite]').addEventListener('click', () => {
          const email = panel.querySelector('#ivEmail').value.trim();
          if (!email || email.indexOf('@') < 0) { panel.querySelector('#ivEmail').focus(); toast('Enter a valid email address', 'warn'); return; }
          close();
          toast(`Invitation sent to ${email}`);
        });
        panel.querySelectorAll('[data-close-sheet]').forEach(b => b.addEventListener('click', close));
      }
    });
  };

  A.announceSheet = function () {
    sheet({
      title: 'New announcement',
      sub: 'Shown to every user in their feed.',
      body: `<div class="a-field"><label for="anTitle">Title</label><input class="a-input" id="anTitle" placeholder="Scheduled maintenance on Sunday"></div>
        <div class="a-field"><label for="anBody">Message</label><textarea class="a-textarea" id="anBody" placeholder="Keep it short and specific."></textarea></div>
        <div class="a-field"><label for="anWhen">Publish</label><select class="a-select" id="anWhen"><option>Immediately</option><option>Tonight at 20:00</option><option>Save as draft</option></select></div>`,
      foot: `<button class="a-btn a-btn--primary" data-publish>Publish announcement</button><span class="a-spacer"></span><button class="a-btn a-btn--ghost" data-close-sheet>Cancel</button>`,
      onMount(panel, close) {
        panel.querySelector('[data-publish]').addEventListener('click', () => {
          const title = panel.querySelector('#anTitle').value.trim();
          if (!title) { panel.querySelector('#anTitle').focus(); toast('Give the announcement a title', 'warn'); return; }
          close();
          toast('Announcement published');
        });
        panel.querySelectorAll('[data-close-sheet]').forEach(b => b.addEventListener('click', close));
      }
    });
  };

  A.runHealthCheck = function () {
    toast('Running health check…', { kind: 'warn', duration: 1200 });
    setTimeout(() => toast('All checks complete · 1 warning', 'warn'), 1200);
  };

  /* ---------------------------------------------------------------- popover contents */
  function pendingHTML() {
    const pending = AD.attention.filter(a => a.kind === 'payouts_due' || a.kind === 'flagged_posts').slice(0, 3);
    return `<div class="a-pop__head"><h3>Pending tasks</h3><span class="a-badge">${pending.length}</span></div>
      ${pending.map(a => `<button class="a-pop__item" data-action="attention-pop-item" data-id="${a.id}">
        <span class="a-dot ${a.severity === 'bad' ? 'a-dot--bad' : 'a-dot--warn'}"></span>
        <span class="a-pop__item__meta"><span class="a-pop__item__title">${A.esc(a.title)}</span><span class="a-pop__item__sub">${A.esc(a.meta)}</span></span>
        <span class="a-badge ${a.severity === 'bad' ? 'a-badge--bad' : 'a-badge--warn'}">${a.count}</span>
      </button>`).join('')}
      <div class="a-pop__foot"><button data-action="open-attention-sheet">Review all tasks ${A.ic('arrowRight')}</button></div>`;
  }

  function healthHTML() {
    return `<div class="a-pop__head"><h3>System health</h3><span class="a-badge a-badge--warn">1 warning</span></div>
      ${AD.system.map(s => `<div class="a-pop__item">
        <span class="a-dot ${s.status === 'ok' ? 'a-dot--ok' : s.status === 'warn' ? 'a-dot--warn' : 'a-dot--bad'}"></span>
        <span class="a-pop__item__meta"><span class="a-pop__item__title">${A.esc(s.label)}</span><span class="a-pop__item__sub">${A.esc(s.note)}</span></span>
        <b style="font-size:11.5px;font-variant-numeric:tabular-nums">${A.esc(s.value)}</b>
      </div>`).join('')}
      <div class="a-pop__foot"><button data-action="run-health">Run health check ${A.ic('refresh')}</button></div>`;
  }

  function notifHTML() {
    return `<div class="a-pop__head"><h3>Notifications</h3><button data-action="read-all">Mark all read</button></div>
      ${AD.notifications.map(n => `<button class="a-pop__item" data-action="notif-item">
        <span class="a-dot ${n.kind === 'bad' ? 'a-dot--bad' : n.kind === 'warn' ? 'a-dot--warn' : 'a-dot--ok'}"></span>
        <span class="a-pop__item__meta"><span class="a-pop__item__title">${A.esc(n.title)}</span><span class="a-pop__item__sub">${A.esc(n.meta)}</span></span>
      </button>`).join('')}
      <div class="a-pop__foot"><button data-action="notif-all">View all notifications ${A.ic('arrowRight')}</button></div>`;
  }

  /* ---------------------------------------------------------------- attention sheet (shared) */
  A.openAttention = function (id) {
    const item = AD.attention.find(a => a.id === id);
    if (!item) return;
    sheet({
      title: item.title,
      sub: `${item.meta} · ${item.count} item${item.count === 1 ? '' : 's'}`,
      body: `<div class="a-sheet-list">${item.items.map((it, i) => `
        <div class="a-sheet-row">
          ${it.user ? A.av(it.user, 30) : `<span class="a-feed__lead a-feed__lead--warn" style="width:30px;height:30px">${A.ic('alert')}</span>`}
          <span class="a-sheet-row__meta"><b>${A.esc(it.label || (it.user && it.user.name))}</b><span>${A.esc(it.meta || (it.amount ? money(it.amount) : item.meta))}</span></span>
          <span style="font-size:11px;color:var(--a-faint)">${A.esc(it.due || '')}</span>
          <button class="a-btn a-btn--sm" data-resolve="${i}">Resolve</button>
        </div>`).join('')}</div>`,
      foot: `<button class="a-btn a-btn--primary" data-resolve-all>Resolve all ${item.count}</button><span class="a-spacer"></span><span class="a-form-note">${item.amount ? 'Total ' + money(item.amount) : 'Moderation queue'}</span>`,
      onMount(panel, close) {
        panel.querySelectorAll('[data-resolve]').forEach(b => b.addEventListener('click', () => {
          b.closest('.a-sheet-row').remove();
          toast('Item marked as resolved', { kind: 'ok' });
        }));
        panel.querySelector('[data-resolve-all]').addEventListener('click', () => {
          close();
          document.dispatchEvent(new CustomEvent('admin:resolve-attention', { detail: { id: item.id } }));
          toast('Queue cleared', { kind: 'ok' });
        });
        panel.querySelectorAll('[data-close-sheet]').forEach(b => b.addEventListener('click', close));
      }
    });
  };

  /* ---------------------------------------------------------------- account menu */
  function accountMenu(anchor) {
    menu(anchor, [
      { label: 'Signed in as' },
      { text: AD.me.name + ' · ' + AD.me.handle, icon: 'user', onClick: () => toast('Profile is not part of this build', 'warn') },
      { sep: true },
      { text: 'Back to Nusumo app', icon: 'home', onClick: () => { window.location.href = 'index.html'; } },
      { text: 'Admin settings', icon: 'settings', onClick: () => toast('Settings is not part of this build', 'warn') },
      { text: 'Sign out', icon: 'logout', onClick: () => toast('Sign out is disabled in the prototype', 'warn') }
    ]);
  }

  /* ---------------------------------------------------------------- drawer */
  function openDrawer() {
    document.body.classList.add('is-drawer');
    const scrim = document.querySelector('.a-scrim');
    scrim.hidden = false;
    requestAnimationFrame(() => scrim.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
    const first = document.querySelector('.a-side [data-action="toggle-group"]');
    if (first) first.focus();
  }
  function closeDrawer() {
    document.body.classList.remove('is-drawer');
    const scrim = document.querySelector('.a-scrim');
    scrim.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => { if (!document.body.classList.contains('is-drawer')) scrim.hidden = true; }, 240);
  }
  A.openDrawer = openDrawer;
  A.closeDrawer = closeDrawer;

  /* ---------------------------------------------------------------- global actions */
  function handleAction(action, el, e) {
    if (!action) return false;
    switch (action) {
      case 'toggle-group': {
        const id = el.dataset.group;
        const body = document.getElementById('grp-' + id);
        const open = openGroups.has(id);
        if (open) openGroups.delete(id); else openGroups.add(id);
        el.classList.toggle('is-open', !open);
        el.setAttribute('aria-expanded', open ? 'false' : 'true');
        body.hidden = open;
        writeJSON('nusumo.admin.groups', Array.from(openGroups));
        return true;
      }
      case 'toggle-rail': {
        if (document.body.classList.contains('is-drawer')) return true;
        rail = !rail;
        document.body.classList.toggle('is-rail', rail);
        writeJSON('nusumo.admin.rail', rail);
        return true;
      }
      case 'open-drawer': openDrawer(); return true;
      case 'close-drawer': closeDrawer(); return true;
      case 'open-palette': openPalette(); return true;
      case 'account-menu': accountMenu(el); return true;
      case 'range': {
        const range = el.dataset.range;
        setRangeUI(range);
        document.dispatchEvent(new CustomEvent('admin:range', { detail: { range } }));
        return true;
      }
      case 'tasks-pop': popover(el, pendingHTML()); return true;
      case 'health-pop':
      case 'system-health-pop': popover(el, healthHTML()); return true;
      case 'notif-pop': popover(el, notifHTML()); return true;
      case 'attention-pop-item': {
        closePopover();
        A.openAttention(el.dataset.id);
        return true;
      }
      case 'open-attention-sheet': closePopover(); A.openAttention('at1'); return true;
      case 'run-health': closePopover(); A.runHealthCheck(); return true;
      case 'read-all': closePopover(); toast('All notifications marked read'); return true;
      case 'notif-item': closePopover(); toast('Notification opened', 'ok'); return true;
      case 'notif-all': closePopover(); toast('Notifications page is not part of this build', 'warn'); return true;
      default: return false;
    }
  }
  A.handleAction = handleAction;

  /* ---------------------------------------------------------------- bind once */
  function bindGlobal() {
    document.addEventListener('click', e => {
      const navGuard = e.target.closest('[data-nav]');
      if (navGuard) {
        const href = navGuard.getAttribute('href');
        if (!href || href === '#') {
          e.preventDefault();
          const label = navGuard.querySelector('span') ? navGuard.querySelector('span').textContent : navGuard.dataset.nav;
          toast(`${label} is not part of this build`, 'warn');
          closeDrawer();
        }
        return;
      }
      const actionEl = e.target.closest('[data-action]');
      if (actionEl && handleAction(actionEl.dataset.action, actionEl, e)) {
        if (actionEl.dataset.action === 'close-drawer') closeDrawer();
        if (actionEl.dataset.action === 'toggle-rail') { /* no close */ }
        if (actionEl.dataset.action === 'open-drawer') e.preventDefault();
        return;
      }
      const close = e.target.closest('[data-close-sheet]');
      if (close) closeSheet();
    });

    document.addEventListener('keydown', e => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) || document.activeElement.isContentEditable;
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); openPalette(); return; }
      if (e.key === '/' && !typing) { e.preventDefault(); openPalette(); return; }
      if (e.key === 'Escape') {
        if (!palette.hidden) { closePalette(); return; }
        if (popAnchor) { closePopover(); return; }
        if (menuEl) { closeMenu(); return; }
        if (document.body.classList.contains('is-drawer')) { closeDrawer(); return; }
      }
    });

    let rt = null;
    window.addEventListener('resize', () => {
      if (rt) clearTimeout(rt);
      rt = setTimeout(() => {
        if (window.innerWidth >= 1024 && document.body.classList.contains('is-drawer')) closeDrawer();
        if (popAnchor) closePopover();
        if (menuEl) closeMenu();
      }, 120);
    });
  }

  /* ---------------------------------------------------------------- boot */
  A.boot = function () {
    renderSidebar();
    renderTopbar();
    renderTabbar();
    bindGlobal();
    document.querySelector('.a-scrim').addEventListener('click', closeDrawer);
    if (window.innerWidth < 1024) closeDrawer();
  };
  window.A = A;
})();
