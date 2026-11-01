/* ==========================================================================
   Nusumo — UI kit: icons, avatars, app shell, overlays, helpers
   ========================================================================== */
(function () {
  const D = window.DATA;

  /* ----------------------------- icons ----------------------------- */
  const P = {
    home: '<path d="M3 10.4 12 3l9 7.4V21a1 1 0 0 1-1 1h-5v-6.4H9V22H4a1 1 0 0 1-1-1Z"/>',
    film: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9.5h18M3 14.5h18"/>',
    live: '<circle cx="12" cy="12" r="2"/><path d="M8.2 15.8a5.4 5.4 0 0 1 0-7.6M15.8 8.2a5.4 5.4 0 0 1 0 7.6M5.1 18.9a9.8 9.8 0 0 1 0-13.8M18.9 5.1a9.8 9.8 0 0 1 0 13.8"/>',
    headphones: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><path d="M4 14h2.5a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z"/><path d="M20 14h-2.5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1H19a1 1 0 0 0 1-1Z"/>',
    user: '<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>',
    more: '<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>',
    search: '<circle cx="11" cy="11" r="6.4"/><path d="m20 20-4.3-4.3"/>',
    bell: '<path d="M18 8.5a6 6 0 1 0-12 0c0 5-2 6.5-2 6.5h16s-2-1.5-2-6.5"/><path d="M10.3 19a2 2 0 0 0 3.4 0"/>',
    chat: '<path d="M20.5 11.5a8 8 0 0 1-8 8H5l-1.5 2v-10a8 8 0 0 1 8-8h1a8 8 0 0 1 8 8Z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    heart: '<path d="M12 20.3 4.6 13a4.8 4.8 0 0 1 6.8-6.8l.6.6.6-.6a4.8 4.8 0 0 1 6.8 6.8Z"/>',
    comment: '<path d="M20.5 11.6a8 8 0 0 1-8 8H5l-1.5 2v-10a8 8 0 0 1 8-8h1a8 8 0 0 1 8 8Z"/>',
    share: '<circle cx="18" cy="5.5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="18.5" r="2.6"/><path d="m8.3 10.8 7.4-4M8.3 13.2l7.4 4"/>',
    bookmark: '<path d="M6 4.5h12a1 1 0 0 1 1 1V21l-7-4.5L5 21V5.5a1 1 0 0 1 1-1Z"/>',
    play: '<path d="M8 5.5v13l11-6.5Z"/>',
    pause: '<path d="M9 5v14M15 5v14"/>',
    volume: '<path d="M11 5 6.5 9H3v6h3.5L11 19Z"/><path d="M15 9a4 4 0 0 1 0 6M17.8 6.2a8 8 0 0 1 0 11.6"/>',
    volumeOff: '<path d="M11 5 6.5 9H3v6h3.5L11 19Z"/><path d="m16 9 5 6M21 9l-5 6"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3"/>',
    micOff: '<path d="m4 4 16 16"/><path d="M9 6v5a3 3 0 0 0 4.5 2.6M15 10V6a3 3 0 0 0-5.6-1.5"/><path d="M5.5 11.5a6.5 6.5 0 0 0 10 5.5M12 18v3"/>',
    chevronDown: '<path d="m6 9.5 6 6 6-6"/>',
    chevronUp: '<path d="m6 14.5 6-6 6 6"/>',
    chevronLeft: '<path d="m14.5 6-6 6 6 6"/>',
    chevronRight: '<path d="m9.5 6 6 6-6 6"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    check: '<path d="m4.5 12.5 5 5 10-11"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2 2 2 0 1 1-4 0 1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 15a2 2 0 1 1 0-4 1.7 1.7 0 0 0 1.4-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 4.6a2 2 0 1 1 4 0A1.7 1.7 0 0 0 16.9 6l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 21 11a2 2 0 1 1 0 4 1.7 1.7 0 0 0-1.6 1Z"/>',
    download: '<path d="M12 3v12M7.5 10.5 12 15l4.5-4.5M4 20h16"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 3H20v18H6.5A2.5 2.5 0 0 1 4 18.5v-13A2.5 2.5 0 0 1 6.5 3Z"/>',
    school: '<path d="M2.5 9 12 4l9.5 5L12 14Z"/><path d="M6.5 11v5c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3v-5M21 9v6"/>',
    card: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19M6.5 15h4"/>',
    users: '<circle cx="9" cy="8.5" r="3.2"/><path d="M2.8 20a6.2 6.2 0 0 1 12.4 0"/><path d="M16.2 5.6a3.2 3.2 0 0 1 0 6M17.5 14.2A5.4 5.4 0 0 1 21.5 19"/>',
    send: '<path d="M21 3 10.5 13.5M21 3l-6.8 18-3.7-7.5L3 9.8Z"/>',
    smile: '<circle cx="12" cy="12" r="8.6"/><path d="M8.5 14.2a4.2 4.2 0 0 0 7 0M9 9.5h.01M15 9.5h.01"/>',
    gift: '<rect x="3.5" y="8.5" width="17" height="12" rx="2"/><path d="M3.5 12.5h17M12 8.5V21"/><path d="M12 8.5S10.8 4 8.2 4a2.2 2.2 0 0 0 0 4.5ZM12 8.5S13.2 4 15.8 4a2.2 2.2 0 0 1 0 4.5Z"/>',
    flag: '<path d="M5 21V4h9l1 2h5v9h-6l-1-2H5"/>',
    link: '<path d="M10 13.5a4 4 0 0 0 5.6 0l2.4-2.4a4 4 0 0 0-5.6-5.6l-1.3 1.3"/><path d="M14 10.5a4 4 0 0 0-5.6 0L6 12.9a4 4 0 0 0 5.6 5.6l1.3-1.3"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    camera: '<path d="M4 7.5h3l1.4-2h7.2L17 7.5h3a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8.5a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13.5" r="3.4"/>',
    video: '<rect x="2.5" y="6" width="13" height="12" rx="2"/><path d="m15.5 10.5 6-3.5v10l-6-3.5"/>',
    grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>',
    list: '<path d="M8.5 6h12M8.5 12h12M8.5 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
    arrowLeft: '<path d="M20 12H4M10 6l-6 6 6 6"/>',
    arrowRight: '<path d="M4 12h16M14 6l6 6-6 6"/>',
    arrowUp: '<path d="M12 20V4M6 10l6-6 6 6"/>',
    pin: '<path d="m9 3 6 0-1 5 3.5 3.5H5.5L9 8Z"/><path d="M12 11.5V21"/>',
    clock: '<circle cx="12" cy="12" r="8.6"/><path d="M12 7.5V12l3.2 2"/>',
    location: '<path d="M20 10.5c0 5.5-8 11-8 11s-8-5.5-8-11a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10.3" r="2.7"/>',
    globe: '<circle cx="12" cy="12" r="8.6"/><path d="M3.5 12h17M12 3.4c2.4 2.3 3.6 5.3 3.6 8.6s-1.2 6.3-3.6 8.6c-2.4-2.3-3.6-5.3-3.6-8.6S9.6 5.7 12 3.4Z"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    eye: '<path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>',
    maximize: '<path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/>',
    sliders: '<path d="M4 8h9M17 8h3M4 16h3M11 16h9"/><circle cx="15" cy="8" r="2"/><circle cx="9" cy="16" r="2"/>',
    shield: '<path d="M12 3 5 6v5.5c0 4.6 3 8 7 9.5 4-1.5 7-4.9 7-9.5V6Z"/><path d="m9 12 2 2 4-4"/>',
    zap: '<path d="M13 3 5 13.5h6L11 21l8-10.5h-6Z"/>',
    ban: '<circle cx="12" cy="12" r="8.6"/><path d="m6 6 12 12"/>',
    trash: '<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13M10 11v6M14 11v6"/>',
    lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    diamond: '<path d="m12 3 8 5-8 13L4 8Z"/><path d="M4 8h16M9 8l3 13M15 8l-3 13"/>',
    mail: '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
    info: '<circle cx="12" cy="12" r="8.6"/><path d="M12 11v6M12 7.5h.01"/>',
    hand: '<path d="M8 12V6.5a1.5 1.5 0 0 1 3 0V11M11 11V5a1.5 1.5 0 0 1 3 0v6M14 11V6.5a1.5 1.5 0 0 1 3 0V13M17 13V9.5a1.5 1.5 0 0 1 3 0V16a5 5 0 0 1-5 5h-2a6 6 0 0 1-4.8-2.4L5 14.5a1.6 1.6 0 0 1 2.4-2.1L9 14"/>',
    swords: '<path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/><path d="M19 21l2-2"/><path d="M9.5 6.5 21 18v3h-3L6.5 9.5"/><path d="M5 14l-2 2"/><path d="M8 17l-4 4"/>',
    trophy: '<path d="M6 4h12v4a6 6 0 0 1-12 0Z"/><path d="M6 6H3v2a4 4 0 0 0 4 4M18 6h3v2a4 4 0 0 1-4 4"/><path d="M12 14v4M8 21h8M10 18h4"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 15.5-6.3L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.5 6.3L3 16"/><path d="M3 21v-5h5"/>',
    flame: '<path d="M12 22c4.4 0 7-2.8 7-6.2 0-2.3-1.3-4.4-3.1-5.8.2 1.7-.6 3.2-2 3.9.4-3.4-1.3-6.6-3.9-8.4.2 2.5-1.4 4.1-3 5.5C5.5 12.3 5 13.9 5 15.8 5 19.2 7.6 22 12 22Z"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3"/>',
    crown: '<path d="M3 8l4 3 5-6 5 6 4-3-2 10H5Z"/><path d="M5 21h14"/>'
  };
  const ic = (name, cls) => `<svg class="icon ${cls || ''}" viewBox="0 0 24 24" aria-hidden="true">${P[name] || P.more}</svg>`;
  const verified = () => '<svg class="verified" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.8l2.6 2 3.2-.2 1 3.1 2.6 1.9-1.2 3 1.2 3-2.6 1.9-1 3.1-3.2-.2-2.6 2-2.6-2-3.2.2-1-3.1L2.6 15l1.2-3-1.2-3 2.6-1.9 1-3.1 3.2.2Z"/><path d="m8.2 11.9 2.6 2.6 5-5.2" fill="none" stroke="#0b0912" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  const fmt = (n) => {
    if (typeof n === 'string') return n;
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace('.0', '') + 'M';
    if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace('.0', '') + 'K';
    return String(n);
  };
  const user = (id) => (typeof id === 'string' ? D.users[id] : id) || D.users.me;
  function av(id, size, cls, one) {
    const u = user(id);
    const s = size || 36;
    const letters = one ? String(u.initials).slice(0, 1) : u.initials;
    return `<span class="av ${cls || ''}" style="--s:${s}px;--av-grad:${u.grad}" title="${esc(u.name)}" aria-label="${esc(u.name)}">${esc(letters)}</span>`;
  }
  const media = (grad, cls) => {
    const g = String(grad || 'violet');
    const inline = g.includes('gradient') ? `style="--media:${g}"` : '';
    const mod = g.includes('gradient') ? '' : `media--${g}`;
    return `<div class="media ${mod} ${cls || ''}" ${inline}><span class="media__grain"></span></div>`;
  };
  const ts = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  /* ----------------------------- shell ----------------------------- */
  const TITLES = {
    home:'Home', reels:'Reels', live:'Live', hangout:'Hangout', 'audio-rooms':'Audio rooms',
    'pk-battle':'PK battle', watch:'Live', studio:'Live studio', room:'Audio room', profile:'Profile',
    messages:'Chats', notifications:'Notifications', courses:'Courses', books:'Books',
    memberships:'Memberships', members:'Members', settings:'Settings', login:'Sign in',
    stories:'Stories', chat:'Chat', 'video-call':'Video call', requests:'Exclusive requests',
    exclusive:'Exclusive', story:'Story', saved:'Saved', analytics:'Analytics'
  };
  const Q = new URLSearchParams(location.search);
  const PAGE = document.body.dataset.page || 'home';
  const title = TITLES[PAGE] || 'Nusumo';

  const NAV = [
    { key:'home', icon:'home', label:'Home', href:'index.html' },
    { key:'reels', icon:'film', label:'Reels', href:'reels.html' },
    { key:'live', icon:'live', label:'Live', href:'live.html' },
    { key:'audio-rooms', icon:'headphones', label:'Audio rooms', href:'audio-rooms.html' },
    { key:'profile', icon:'user', label:'Profile', href:'profile.html' }
  ];
  const MORE_GROUPS = [
    { label:'Your space', items:[
      { key:'messages', icon:'chat', label:'Chats', href:'messages.html', badge:3 },
      { key:'chat', icon:'chat', label:'Group chat', href:'chat.html', badge:2 },
      { key:'stories', icon:'plus', label:'Stories', href:'stories.html' },
      { key:'saved', icon:'bookmark', label:'Saved', href:'saved.html' },
      { key:'notifications', icon:'bell', label:'Notifications', href:'notifications.html', badge:4 }
    ]},
    { label:'Create & connect', items:[
      { key:'video-call', icon:'video', label:'Video call', href:'video-call.html' },
      { key:'requests', icon:'gift', label:'Exclusive requests', href:'requests.html', badge:1 },
      { key:'exclusive', icon:'lock', label:'Exclusive content', href:'exclusive.html' },
      { key:'analytics', icon:'sliders', label:'Analytics', href:'analytics.html' }
    ]},
    { label:'Learn', items:[
      { key:'courses', icon:'school', label:'Courses', href:'courses.html' },
      { key:'books', icon:'book', label:'Books', href:'books.html' },
      { key:'memberships', icon:'card', label:'Memberships', href:'memberships.html' }
    ]},
    { label:'App', items:[
      { key:'members', icon:'users', label:'Members', href:'members.html' },
      { key:'settings', icon:'settings', label:'Settings', href:'settings.html' },
      { key:'install', icon:'download', label:'Install app', action:'install' }
    ]}
  ];
  const activeKey = ({ 'pk-battle':'live', watch:'live', studio:'live', room:'audio-rooms' })[PAGE] || PAGE;
  const inMore = MORE_GROUPS.some(g => g.items.some(i => i.key === activeKey));

  function moreLink(it) {
    const tag = it.href ? 'a' : 'button';
    const attrs = it.href ? `href="${it.href}"` : `data-action="${it.action}"`;
    return `<${tag} class="more-link ${it.key === activeKey ? 'is-active' : ''}" ${attrs}>
      ${ic(it.icon)}<span>${it.label}</span>${it.badge ? `<span class="nav-badge">${it.badge}</span>` : ''}
    </${tag}>`;
  }

  function shellHTML() {
    const sidebar = `
    <aside class="sidebar">
      <a class="brand" href="index.html" aria-label="Nusumo home">
        <span class="brand__mark">N</span>
        <span><span class="brand__name">Nusumo</span><span class="brand__sub">Creator guild</span></span>
      </a>
      <nav class="nav" aria-label="Primary">
        ${NAV.map(n => `<a class="nav-item ${activeKey === n.key ? 'is-active' : ''}" href="${n.href}">${ic(n.icon)}<span>${n.label}</span></a>`).join('')}
        <div class="nav-divider"></div>
        <button class="nav-item ${inMore ? 'is-active' : ''}" data-more-toggle aria-expanded="${inMore}">
          ${ic('more')}<span>More</span>${ic('chevronDown', 'nav-caret')}
        </button>
        <div class="more-panel ${inMore ? 'is-open' : ''}" id="morePanel">
          ${MORE_GROUPS.map(g => `<div class="more-panel__label">${g.label}</div>${g.items.map(moreLink).join('')}`).join('')}
        </div>
      </nav>
      <div class="sidebar__spacer"></div>
      <a class="side-user" href="profile.html">
        ${av('me', 32, 'av--hair')}
        <span class="side-user__meta">
          <span class="side-user__name">${D.me.name}</span>
          <span class="side-user__handle">${D.me.handle}</span>
        </span>
        ${ic('chevronRight')}
      </a>
    </aside>`;

    const topbar = `
    <header class="topbar">
      <span class="topbar__title">${title}</span>
      <span class="topbar__spacer"></span>
      <label class="search">
        ${ic('search')}
        <input type="search" name="q" placeholder="Search creators, rooms, reels" aria-label="Search" data-search>
        <kbd>/</kbd>
      </label>
      <div class="topbar__actions">
        <button class="icon-btn" data-notif-popover aria-label="Notifications">${ic('bell')}<span class="icon-btn__dot" data-notif-dot></span></button>
        <button class="icon-btn" data-msg-popover aria-label="Messages">${ic('chat')}<span class="icon-btn__count" data-msg-count>2</span></button>
        <button class="avatar-btn" data-user-menu aria-label="Account menu" style="margin-left:4px">${av('me', 32, 'av--hair')}</button>
      </div>
    </header>`;

    const mobileBar = `
    <header class="mobile-bar">
      <a href="index.html" class="brand__mark" aria-label="Nusumo home">N</a>
      <span class="mobile-bar__title">${title}</span>
      <div class="mobile-bar__actions">
        <button class="icon-btn" data-search-open aria-label="Search">${ic('search')}</button>
        <button class="icon-btn" data-notif-popover aria-label="Notifications">${ic('bell')}<span class="icon-btn__dot" data-notif-dot></span></button>
        <a href="profile.html" aria-label="Profile" style="margin-left:2px">${av('me', 27, 'av--hair')}</a>
      </div>
    </header>`;

    return `<div class="app">${sidebar}<div class="main">${topbar}${mobileBar}<div class="view" id="view"></div></div></div>
      <nav class="tabbar" aria-label="Mobile">
        <div class="tabbar__inner">
          <a class="tab ${PAGE === 'home' ? 'is-active' : ''}" href="index.html">${ic('home')}<span>Home</span></a>
          <a class="tab ${PAGE === 'reels' ? 'is-active' : ''}" href="reels.html">${ic('film')}<span>Reels</span></a>
          <a class="tab ${['hangout','live','audio-rooms','watch','studio','room','pk-battle'].includes(PAGE) ? 'is-active' : ''}" href="hangout.html">${ic('live')}<span>Hangout</span></a>
          <a class="tab ${PAGE === 'profile' ? 'is-active' : ''}" href="profile.html">${ic('user')}<span>Profile</span></a>
          <button class="tab ${(!['home','reels','hangout','live','audio-rooms','watch','studio','room','pk-battle','profile'].includes(PAGE)) ? 'is-active' : ''}" data-more-sheet>${ic('more')}<span>More</span></button>
        </div>
      </nav>
      <div class="toast-root" id="toastRoot"></div>`;
  }

  /* ----------------------------- overlays ----------------------------- */
  function toast(message, kind) {
    const root = document.getElementById('toastRoot');
    if (!root) return;
    const el = document.createElement('div');
    el.className = 'toast ' + (kind === 'live' ? 'toast--live' : '');
    el.innerHTML = `<span style="display:flex">${ic(kind === 'live' ? 'live' : 'check')}</span><span>${esc(message)}</span>`;
    root.appendChild(el);
    setTimeout(() => { el.classList.add('is-out'); setTimeout(() => el.remove(), 260); }, 2600);
  }

  let sheetEl = null, sheetBack = null, onSheetClose = null;
  function closeSheet() {
    if (!sheetEl) return;
    sheetEl.classList.remove('is-open');
    sheetBack.classList.remove('is-open');
    const s = sheetEl, b = sheetBack;
    sheetEl = null; sheetBack = null;
    setTimeout(() => { s.remove(); b.remove(); }, 320);
    if (onSheetClose) { const fn = onSheetClose; onSheetClose = null; fn(); }
  }
  function openSheet(opts) {
    closeSheet();
    const back = document.createElement('div');
    back.className = 'sheet-backdrop';
    const sheet = document.createElement('div');
    sheet.className = 'sheet ' + (opts.tall ? 'sheet--tall' : '');
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    sheet.innerHTML = `
      <div class="sheet__grab"></div>
      <div class="sheet__head">
        <div><h2>${opts.title || ''}</h2>${opts.sub ? `<div class="sub">${opts.sub}</div>` : ''}</div>
        <button class="icon-btn" data-sheet-close aria-label="Close">${ic('x')}</button>
      </div>
      <div class="sheet__body">${opts.body || ''}</div>
      ${opts.foot ? `<div class="sheet__foot">${opts.foot}</div>` : ''}`;
    document.body.appendChild(back);
    document.body.appendChild(sheet);
    sheetEl = sheet; sheetBack = back; onSheetClose = opts.onClose || null;
    requestAnimationFrame(() => { back.classList.add('is-open'); sheet.classList.add('is-open'); });
    back.addEventListener('click', closeSheet);
    sheet.querySelectorAll('[data-sheet-close]').forEach(b => b.addEventListener('click', closeSheet));
    if (opts.onMount) opts.onMount(sheet);
    return sheet;
  }

  let modalBack = null;
  function confirmDialog(opts) {
    const back = document.createElement('div');
    back.className = 'modal-backdrop';
    back.innerHTML = `<div class="modal" role="dialog" aria-modal="true">
        <h3>${esc(opts.title || 'Are you sure?')}</h3>
        <p>${opts.message || ''}</p>
        <div class="modal__actions">
          <button class="btn btn--ghost" data-cancel>${esc(opts.cancelLabel || 'Cancel')}</button>
          <button class="btn ${opts.danger ? 'btn--danger' : 'btn--primary'}" data-confirm>${esc(opts.confirmLabel || 'Confirm')}</button>
        </div>
      </div>`;
    document.body.appendChild(back);
    modalBack = back;
    requestAnimationFrame(() => back.classList.add('is-open'));
    const close = () => { back.classList.remove('is-open'); setTimeout(() => back.remove(), 220); if (modalBack === back) modalBack = null; };
    back.addEventListener('click', (e) => { if (e.target === back) close(); });
    back.querySelector('[data-cancel]').addEventListener('click', close);
    back.querySelector('[data-confirm]').addEventListener('click', () => { close(); opts.onConfirm && opts.onConfirm(); });
    return back;
  }

  function startRoomSheet() {
    openSheet({
      title:'Start an audio room',
      sub:'Pick a lane and invite your people',
      body:`<div class="field"><label for="roomTitle">Room title</label>
          <input class="input" id="roomTitle" name="roomTitle" placeholder="Late Night Beats &amp; Conversations"></div>
        <div class="field"><label for="roomCat">Category</label>
          <select class="select" id="roomCat" name="roomCat"><option>Music</option><option>Talk</option><option>Learning</option><option>Gaming</option></select></div>
        <div class="field"><label for="roomWho">Who can join</label>
          <select class="select" id="roomWho" name="roomWho"><option>Anyone can listen</option><option>Followers only</option><option>Invite only</option></select></div>
        <div class="switch-row" style="border:0;padding-top:2px">
          <div class="switch-row__text"><strong>Record this room</strong><span>You can publish the replay later</span></div>
          <button class="switch" role="switch" aria-checked="false" aria-label="Record this room" data-switch></button>
        </div>`,
      foot:`<button class="btn btn--primary btn--block" data-create-room>${ic('mic')}Create room</button>`,
      onMount(sheet) {
        sheet.querySelectorAll('[data-switch]').forEach(sw => sw.addEventListener('click', () => {
          sw.setAttribute('aria-checked', sw.getAttribute('aria-checked') === 'true' ? 'false' : 'true');
        }));
        const create = () => {
          const t = sheet.querySelector('#roomTitle');
          if (!t.value.trim()) { t.focus(); toast('Give your room a title first'); return; }
          closeSheet();
          toast('Room created — taking you inside');
          setTimeout(() => { location.href = 'room.html?host=1'; }, 600);
        };
        sheet.querySelector('[data-create-room]').addEventListener('click', create);
        sheet.querySelector('#roomTitle').addEventListener('keydown', e => { if (e.key === 'Enter') create(); });
      }
    });
  }

  let menuEl = null;
  function closeMenu() { if (menuEl) { menuEl.remove(); menuEl = null; } }  function openMenu(anchor, items) {
    closeMenu();
    const r = anchor.getBoundingClientRect();
    const menu = document.createElement('div');
    menu.className = 'menu';
    menu.style.position = 'fixed';
    menu.innerHTML = items.map(it => it.sep
      ? '<div class="menu__sep"></div>'
      : `<button class="menu__item ${it.danger ? 'menu__item--danger' : ''}" data-i="${items.indexOf(it)}">${it.icon ? ic(it.icon) : ''}<span>${esc(it.label)}</span></button>`
    ).join('');
    document.body.appendChild(menu);
    menuEl = menu;
    const w = menu.offsetWidth, h = menu.offsetHeight;
    let left = Math.min(Math.max(10, r.right - w), innerWidth - w - 10);
    let top = r.bottom + 6;
    if (top + h > innerHeight - 10) top = Math.max(10, r.top - h - 6);
    menu.style.left = left + 'px';
    menu.style.top = top + 'px';
    menu.querySelectorAll('[data-i]').forEach(btn => {
      btn.addEventListener('click', () => {
        const it = items[+btn.dataset.i];
        closeMenu();
        it.onClick && it.onClick();
      });
    });
    setTimeout(() => document.addEventListener('click', closeMenu, { once: true }), 0);
    return menu;
  }

  function installApp() {
    openSheet({
      title:'Install Nusumo',
      sub:'Keep the community one tap away',
      body:`<div class="stack">
        <div class="banner">${ic('download')}<span>Add Nusumo to your home screen for offline reels, live notifications and a faster launch.</span></div>
        <div class="card" style="padding:14px">
          <div class="row" style="margin-bottom:10px"><strong style="font-size:12.5px">On desktop</strong></div>
          <ol style="font-size:12px;color:var(--muted);line-height:1.9;padding-left:18px;list-style:decimal">
            <li>Open your browser menu</li><li>Choose “Install” or “Add to Home Screen”</li><li>Confirm — Nusumo opens in its own window</li>
          </ol>
        </div>
        <div class="copy-row">${ic('link')}<code>nusumo.app/install</code><button class="btn btn--ghost btn--sm" data-copy>Copy</button></div>
      </div>`,
      onMount(sheet) {
        sheet.querySelector('[data-copy]').addEventListener('click', () => { toast('Link copied'); });
      }
    });
  }

  function moreSheet() {
    openSheet({
      title:'More',
      sub:`${D.me.name} · ${D.me.handle}`,
      body:`<div class="more-grid">
        ${MORE_GROUPS.flatMap(g => g.items).map(it => {
          const tag = it.href ? 'a' : 'button';
          const attrs = it.href ? `href="${it.href}"` : `data-action="${it.action}"`;
          return `<${tag} class="more-tile" ${attrs}>${ic(it.icon)}<span>${it.label}</span></${tag}>`;
        }).join('')}
        <button class="more-tile" data-logout>${ic('logout')}<span>Log out</span></button>
      </div>
      <div class="divider"></div>
      <div class="row" style="justify-content:space-between;font-size:11px;color:var(--faint)">
        <span>Nusumo v2.0</span><span>Creator guild</span>
      </div>`,
      onMount(sheet) {
        sheet.querySelectorAll('[data-action="install"]').forEach(b => b.addEventListener('click', () => { closeSheet(); installApp(); }));
        sheet.querySelectorAll('[data-logout]').forEach(b => b.addEventListener('click', () => { closeSheet(); confirmDialog({ title:'Log out of Nusumo?', message:'You can sign back in any time with your email.', confirmLabel:'Log out', onConfirm:() => location.href = 'login.html' }); }));
      }
    });
  }

  function searchSheet() {
    const results = [
      ...Object.values(D.users).slice(1, 7).map(u => ({ label:u.name, sub:`${u.handle} · ${u.role}`, av:u.id, href:'profile.html' })),
      ...D.liveStreams.slice(0, 3).map(l => ({ label:l.title, sub:`Live · ${fmt(l.viewers)} watching`, icon:'live', href:'watch.html' })),
      ...D.rooms.slice(0, 3).map(r => ({ label:r.title, sub:`Audio room · ${r.listeners} listening`, icon:'headphones', href:'room.html' }))
    ];
    const row = (r) => `<a class="chat-item" href="${r.href}">
        ${r.av ? av(r.av, 34, 'av--hair') : `<span class="notif-row__icon">${ic(r.icon || 'search')}</span>`}
        <span class="chat-item__meta"><span class="chat-item__name">${esc(r.label)}</span><span class="chat-item__last">${esc(r.sub)}</span></span>
        ${ic('chevronRight')}
      </a>`;
    openSheet({
      title:'Search', sub:'Members, live channels and rooms',
      body:`<label class="search" style="width:100%;margin-bottom:12px">${ic('search')}<input type="search" name="q" placeholder="Try “audio”, “Farah”, “synth”" data-search-sheet></label>
        <div style="font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--faint);margin-bottom:6px">Suggested</div>
        <div data-results>${results.map(row).join('')}</div>`,
      onMount(sheet) {
        const input = sheet.querySelector('[data-search-sheet]');
        const box = sheet.querySelector('[data-results]');
        setTimeout(() => input.focus(), 220);
        input.addEventListener('input', () => {
          const q = input.value.toLowerCase().trim();
          const filtered = results.filter(r => (r.label + r.sub).toLowerCase().includes(q));
          box.innerHTML = filtered.length ? filtered.map(row).join('') : `<div class="empty" style="padding:30px 10px"><div class="empty__icon">${ic('search')}</div><p>No results for “${esc(q)}”</p></div>`;
        });
      }
    });
  }

  /* ----------------------------- popovers ----------------------------- */
  let popoverEl = null, popoverBack = null;
  function closePopover() {
    if (popoverEl) { popoverEl.remove(); popoverEl = null; }
    if (popoverBack) { popoverBack.remove(); popoverBack = null; }
  }
  function openPopover(anchor, html) {
    closePopover();
    const back = document.createElement('div');
    back.className = 'popover-backdrop';
    const pop = document.createElement('div');
    pop.className = 'popover';
    pop.innerHTML = html;
    document.body.appendChild(back);
    document.body.appendChild(pop);
    popoverBack = back; popoverEl = pop;
    const r = anchor.getBoundingClientRect();
    const w = 360;
    let left = Math.min(Math.max(8, r.right - w), innerWidth - w - 8);
    let top = r.bottom + 8;
    if (top + 420 > innerHeight) top = Math.max(8, r.top - 420 - 8);
    pop.style.left = left + 'px';
    pop.style.top = top + 'px';
    pop.style.width = w + 'px';
    requestAnimationFrame(() => { back.classList.add('is-open'); pop.classList.add('is-open'); });
    back.addEventListener('click', closePopover);
    setTimeout(() => document.addEventListener('click', closeOnOutside, { once: true }), 0);
    function closeOnOutside(e) {
      if (popoverEl && !popoverEl.contains(e.target) && !anchor.contains(e.target)) closePopover();
      else if (popoverEl) document.addEventListener('click', closeOnOutside, { once: true });
    }
    return pop;
  }

  function notifItem(n) {
    const iconMap = { live:'live', follow:'user', like:'heart', comment:'comment', room:'headphones', mention:'chat', system:'info' };
    const iconCls = n.type === 'live' ? 'notif-row__icon--live' : (n.type === 'system' ? 'notif-row__icon--ok' : '');
    return `<div class="notif-pop-row ${n.unread?'is-unread':''}" data-notif-id="${n.id}">
      <span class="notif-row__icon ${iconCls}">${ic(iconMap[n.type]||'bell')}</span>
      <div class="notif-pop-body">
        <div class="notif-pop-title">${esc(n.title)}</div>
        <div class="notif-pop-text">${esc(n.body||'')}</div>
        <div class="notif-pop-time">${esc(n.time)}</div>
      </div>
      ${n.thumb ? `<div class="notif-row__thumb">${media(n.thumb)}</div>` : ''}
      <button class="notif-pop-dismiss" data-dismiss-notif="${n.id}" aria-label="Dismiss">${ic('x')}</button>
    </div>`;
  }

  function notifPopoverHTML() {
    const list = (D.notifications || []).slice(0, 6);
    const unread = (D.notifications || []).filter(n => n.unread).length;
    return `
      <div class="popover__head">
        <div><h3>Notifications</h3><div class="sub">${unread} unread</div></div>
        <button class="btn btn--ghost btn--sm" data-mark-all-read>${ic('check')}Mark all read</button>
      </div>
      <div class="popover__body">
        ${list.length ? list.map(notifItem).join('') : `<div class="empty" style="padding:24px 8px"><div class="empty__icon">${ic('bell')}</div><p>No notifications</p></div>`}
      </div>
      <div class="popover__foot">
        <a class="btn btn--primary btn--sm btn--block" href="notifications.html">${ic('chevronRight')}See all notifications</a>
      </div>`;
  }

  function msgItem(c) {
    const u = user(c.user);
    return `<a class="msg-pop-row" href="messages.html" data-open-chat="${c.id}">
      ${av(c.user, 34, 'av--hair')}
      <div class="msg-pop-meta">
        <div class="msg-pop-name">${esc(u.name)}${u.verified?verified():''}${c.unread?`<span class="nav-badge" style="margin-left:6px">${c.unread}</span>`:''}</div>
        <div class="msg-pop-last">${esc(c.last)}</div>
      </div>
      <div class="msg-pop-time">${esc(c.time)}</div>
    </a>`;
  }

  function messagesPopoverHTML() {
    const list = (D.chats || []).slice(0, 5);
    const unread = (D.chats || []).reduce((a,c)=>a+(c.unread||0),0);
    return `
      <div class="popover__head">
        <div><h3>Messages</h3><div class="sub">${unread} unread</div></div>
        <button class="btn btn--ghost btn--sm" data-new-msg>${ic('plus')}New</button>
      </div>
      <div class="popover__body">
        ${list.length ? list.map(msgItem).join('') : `<div class="empty" style="padding:24px 8px"><div class="empty__icon">${ic('chat')}</div><p>No messages</p></div>`}
      </div>
      <div class="popover__foot">
        <a class="btn btn--primary btn--sm btn--block" href="messages.html">${ic('chevronRight')}See all messages</a>
      </div>`;
  }

  function wirePopover() {
    if (!popoverEl) return;
    popoverEl.querySelectorAll('[data-dismiss-notif]').forEach(b => b.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = b.dataset.dismissNotif;
      const n = (D.notifications || []).find(x => x.id === id);
      if (n) n.unread = false;
      const row = popoverEl.querySelector(`[data-notif-id="${id}"]`);
      if (row) row.remove();
      // update badge
      const unreadN = (D.notifications || []).filter(x => x.unread).length;
      const nd = document.querySelector('[data-notif-dot]');
      if (nd) nd.style.display = unreadN ? '' : 'none';
    }));
    const markAll = popoverEl.querySelector('[data-mark-all-read]');
    if (markAll) markAll.addEventListener('click', () => {
      (D.notifications || []).forEach(n => n.unread = false);
      popoverEl.querySelectorAll('.notif-pop-row').forEach(r => r.classList.remove('is-unread'));
      const nd = document.querySelector('[data-notif-dot]');
      if (nd) nd.style.display = 'none';
      if (popoverEl.querySelector('.popover__head .sub')) popoverEl.querySelector('.popover__head .sub').textContent = '0 unread';
      toast('All marked as read');
    });
    const newMsg = popoverEl.querySelector('[data-new-msg]');
    if (newMsg) newMsg.addEventListener('click', () => { closePopover(); N.toast('New message'); });
  }

  /* ----------------------------- interaction wiring ----------------------------- */
  function wire() {
    document.addEventListener('click', (e) => {
      const mt = e.target.closest('[data-more-toggle]');
      if (mt) {
        const panel = document.getElementById('morePanel');
        const open = panel.classList.toggle('is-open');
        mt.setAttribute('aria-expanded', open);
      }
      if (e.target.closest('[data-more-sheet]')) moreSheet();
      if (e.target.closest('[data-search-open]')) searchSheet();
      if (e.target.closest('[data-action="install"]')) installApp();
      if (e.target.closest('[data-search]')) {
        e.preventDefault();
        searchSheet();
      }
      if (e.target.closest('[data-theme-toggle]')) {
        const html = document.documentElement;
        const light = html.classList.toggle('light');
        try { localStorage.setItem('nusumo-theme', light ? 'light' : 'dark'); } catch(e){}
        N.toast(light ? 'Light mode' : 'Dark mode');
      }
      const np = e.target.closest('[data-notif-popover]');
      if (np) { e.preventDefault(); e.stopPropagation(); openPopover(np, notifPopoverHTML()); wirePopover(); return; }
      const mp = e.target.closest('[data-msg-popover]');
      if (mp) { e.preventDefault(); e.stopPropagation(); openPopover(mp, messagesPopoverHTML()); wirePopover(); return; }
      const um = e.target.closest('[data-user-menu]');
      if (um) { e.preventDefault(); e.stopPropagation();
        openMenu(um, [
          { icon:'user', label:D.me.name, onClick(){ location.href='profile.html'; } },
          { sep:true },
          { icon:'bookmark', label:'Saved', onClick(){ location.href='saved.html'; } },
          { icon:'sliders', label:'Analytics', onClick(){ location.href='analytics.html'; } },
          { icon:'settings', label:'Settings', onClick(){ location.href='settings.html'; } },
          { icon:'lock', label:'Exclusive content', onClick(){ location.href='exclusive.html'; } },
          { sep:true },
          { icon:'sliders', label: document.documentElement.classList.contains('light') ? 'Dark mode' : 'Light mode', onClick(){ document.documentElement.classList.toggle('light'); const light = document.documentElement.classList.contains('light'); try { localStorage.setItem('nusumo-theme', light ? 'light' : 'dark'); localStorage.setItem('nusumo-pref-theme', String(light)); } catch(e){} N.toast(light ? 'Light mode' : 'Dark mode'); } },
          { sep:true },
          { icon:'logout', label:'Log out', danger:true, onClick(){ confirmDialog({ title:'Log out of Nusumo?', message:'You can sign back in any time.', confirmLabel:'Log out', onConfirm(){ location.href='login.html'; } }); } }
        ]);
        return;
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { closeSheet(); closeMenu(); closePopover(); if (modalBack) modalBack.querySelector('[data-cancel]').click(); }
      if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) {
        const s = document.querySelector('[data-search]');
        if (s) { e.preventDefault(); s.focus(); }
        else if (!document.getElementById('sheet')) searchSheet();
      }
      if (e.key === '?' && !/input|textarea|select/i.test(document.activeElement.tagName)) {
        e.preventDefault();
        openSheet({
          title:'Keyboard shortcuts',
          sub:'Work faster',
          body:`<div style="display:flex;flex-direction:column;gap:8px">
            ${[['/','Focus search'],['?','Show this help'],['Esc','Close dialogs'],['Enter','Send message / submit']].map(([k,v])=>`<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)"><kbd style="padding:3px 8px;border-radius:6px;border:1px solid var(--border);background:rgba(var(--overlay-rgb),.05);font-size:11px">${k}</kbd><span style="font-size:12px;color:var(--muted)">${v}</span></div>`).join('')}
          </div>`
        });
      }
    });
  }

  /* ----------------------------- popover styles ----------------------------- */
  const popStyle = document.createElement('style');
  popStyle.textContent = `
    .popover-backdrop{position:fixed;inset:0;z-index:55;background:rgba(0,0,0,.18);opacity:0;transition:opacity .18s}
    .popover-backdrop.is-open{opacity:1}
    .popover{position:fixed;z-index:56;background:var(--surface);border:1px solid var(--border-strong);border-radius:14px;box-shadow:0 24px 60px -24px rgba(0,0,0,.8);opacity:0;transform:translateY(-6px);transition:opacity .18s,transform .18s;overflow:hidden;display:flex;flex-direction:column;max-height:70vh}
    .popover.is-open{opacity:1;transform:none}
    .popover__head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 14px;border-bottom:1px solid var(--border)}
    .popover__head h3{font-size:13px;font-weight:650}
    .popover__head .sub{font-size:10.5px;color:var(--faint);margin-top:2px}
    .popover__body{overflow:auto;padding:6px 8px;flex:1}
    .popover__foot{padding:10px 12px;border-top:1px solid var(--border)}
    .notif-pop-row{display:flex;align-items:flex-start;gap:10px;padding:9px 8px;border-radius:9px;position:relative;transition:background .16s}
    .notif-pop-row:hover{background:rgba(var(--overlay-rgb),.04)}
    .notif-pop-row.is-unread{background:rgba(166,120,255,.04)}
    .notif-pop-body{min-width:0;flex:1}
    .notif-pop-title{font-size:12px;font-weight:600;line-height:1.4}
    .notif-pop-text{font-size:10.5px;color:var(--muted);margin-top:2px;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
    .notif-pop-time{font-size:9.5px;color:var(--faint);margin-top:3px}
    .notif-pop-dismiss{width:22px;height:22px;border-radius:6px;display:grid;place-items:center;color:var(--faint);flex-shrink:0;opacity:0;transition:opacity .16s}
    .notif-pop-row:hover .notif-pop-dismiss{opacity:1}
    .notif-pop-dismiss:hover{background:rgba(var(--overlay-rgb),.08);color:#fff}
    .msg-pop-row{display:flex;align-items:center;gap:10px;padding:9px 8px;border-radius:9px;transition:background .16s}
    .msg-pop-row:hover{background:rgba(var(--overlay-rgb),.04)}
    .msg-pop-meta{min-width:0;flex:1}
    .msg-pop-name{font-size:12px;font-weight:600;display:flex;align-items:center;gap:4px}
    .msg-pop-last{font-size:10.5px;color:var(--faint);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .msg-pop-time{font-size:9.5px;color:var(--faint);flex-shrink:0}
  `;
  document.head.appendChild(popStyle);

  // theme init
  (function(){ try { if (localStorage.getItem('nusumo-theme') === 'light') document.documentElement.classList.add('light'); } catch(e){} })();

  /* ----------------------------- boot ----------------------------- */
  if (PAGE !== 'login') {
    const appHost = document.getElementById('app');
    if (appHost) appHost.outerHTML = shellHTML();
    document.body.classList.toggle('immersive', ['watch','studio','room'].includes(PAGE) && innerWidth <= 1024);
    if (['watch','studio','room'].includes(PAGE)) document.body.classList.add('immersive');
    wire();
    // update header badges
    try {
      const nd = document.querySelector('[data-notif-dot]');
      const unreadN = (D.notifications || []).filter(n => n.unread).length;
      if (nd) nd.style.display = unreadN ? '' : 'none';
      const mc = document.querySelector('[data-msg-count]');
      const unreadM = (D.chats || []).reduce((a,c) => a + (c.unread||0), 0);
      if (mc) { mc.textContent = unreadM; mc.style.display = unreadM ? '' : 'none'; }
    } catch(e) {}
  }

  const revealObserver = ('IntersectionObserver' in window) ? new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); revealObserver.unobserve(en.target); } });
  }, { rootMargin:'0px 0px -8% 0px', threshold:.05 }) : null;

  window.N = {
    D, PAGE, Q, ic, av, media, user, fmt, esc, verified, ts,
    view: document.getElementById('view'),
    toast, openSheet, closeSheet, confirmDialog, openMenu, closeMenu, startRoomSheet,
    moreSheet, searchSheet, installApp,
    reveal(root) {
      (root || document).querySelectorAll('.reveal:not(.is-in)').forEach(el => revealObserver ? revealObserver.observe(el) : el.classList.add('is-in'));
    },
    async copy(text) {
      try { await navigator.clipboard.writeText(text); toast('Copied to clipboard'); }
      catch { toast('Copy not available in this browser'); }
    },
    ready(fn) {
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
      else fn();
    },
    go(href) { location.href = href; }
  };
})();
