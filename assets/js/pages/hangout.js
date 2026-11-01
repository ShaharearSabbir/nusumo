/* Nusumo — Hangout (mobile hub for Live + Audio rooms) */
N.ready(function () {
  const D = N.D;
  let tab = N.Q.get('tab') === 'rooms' ? 'rooms' : 'live';

  const liveList = D.liveStreams.slice(0, 6);
  const roomList = D.rooms.slice(0, 6);

  function liveRow(s) {
    const u = N.user(s.user);
    return `<a class="live-row" href="watch.html?id=${s.id}">
      <div class="live-row__thumb">
        ${N.media(s.grad)}
        <span class="scrim-b"></span>
        <span class="live-badge live-badge--solid"><i class="live-dot"></i>Live</span>
        <span class="row">${N.ic('eye')}${s.viewersLabel}</span>
      </div>
      <div class="live-row__meta">
        <div class="live-row__title">${N.esc(s.title)}</div>
        <div class="live-row__host">
          ${N.av(u, 18, 'av--hair')}
          <span>${N.esc(u.name)}</span>
          ${u.verified ? N.verified() : ''}
          <span class="dot-sep"></span>
          <span>${N.esc(s.category)}</span>
        </div>
      </div>
      <span class="live-row__go">${N.ic('play')}</span>
    </a>`;
  }

  function roomRow(r) {
    const u = N.user(r.user);
    return `<a class="room-row" href="room.html?id=${r.id}">
      <span class="room-row__art">${N.ic('headphones')}</span>
      <div class="room-row__meta">
        <div class="room-row__title">${N.esc(r.title)}</div>
        <div class="room-row__sub">
          <span class="av-stack" style="--s:18px">
            ${r.speakers.slice(0, 3).map(id => N.av(id, 18, 'av--hair', true)).join('')}
          </span>
          <span>${N.esc(u.name)}</span>
          <span class="dot-sep"></span>
          <span class="row" style="gap:4px">${N.ic('users')}${r.listeners}</span>
        </div>
      </div>
      <span class="btn btn--primary btn--sm room-row__join">Join</span>
    </a>`;
  }

  function sectionHead(icon, label, count, href, live) {
    return `<div class="hangout__head">
      <div class="hangout__title">${live ? '<i class="live-dot"></i>' : N.ic(icon)}${label}
        <span class="hangout__count">${count}</span></div>
      <a class="hangout__link" href="${href}">See all${N.ic('chevronRight')}</a>
    </div>`;
  }

  N.view.innerHTML = `<div class="page page--tight page--hangout">
    <div class="page-head">
      <div>
        <div class="eyebrow">Right now</div>
        <h1>Hangout</h1>
        <p class="lead">Everything happening in this moment — jump into a stream or pull up a chair in a room.</p>
      </div>
      <div class="page-head__actions hangout-actions">
        <button class="btn btn--ghost" data-start-room>${N.ic('headphones')}Start a room</button>
        <a class="btn btn--primary" href="studio.html">${N.ic('video')}Go live</a>
      </div>
    </div>

    <div class="segmented hangout-switch" role="tablist" aria-label="Hangout type">
      <button role="tab" data-tab="live" class="${tab === 'live' ? 'is-active' : ''}" aria-selected="${tab === 'live'}">
        ${N.ic('live')}Live <span class="count">${D.liveStreams.length}</span>
      </button>
      <button role="tab" data-tab="rooms" class="${tab === 'rooms' ? 'is-active' : ''}" aria-selected="${tab === 'rooms'}">
        ${N.ic('headphones')}Audio rooms <span class="count">${D.rooms.length}</span>
      </button>
    </div>

    <div class="hangout-cols">
      <section class="hangout__section ${tab !== 'live' ? 'is-off' : ''}" data-section="live" aria-label="Live streams">
        ${sectionHead('live', 'Live now', D.liveStreams.length + ' streams', 'live.html', true)}
        <div class="hangout__list">${liveList.map(liveRow).join('')}</div>
      </section>

      <section class="hangout__section ${tab !== 'rooms' ? 'is-off' : ''}" data-section="rooms" aria-label="Audio rooms">
        ${sectionHead('headphones', 'Audio rooms', D.rooms.length + ' rooms', 'audio-rooms.html')}
        <div class="hangout__list">${roomList.map(roomRow).join('')}</div>
      </section>
    </div>

    <button class="hangout-fab" data-fab>
      ${N.ic(tab === 'live' ? 'video' : 'headphones')}
      <span data-fab-label>${tab === 'live' ? 'Go live' : 'Start a room'}</span>
    </button>
  </div>`;

  const fab = N.view.querySelector('[data-fab]');

  function syncFab() {
    fab.innerHTML = `${N.ic(tab === 'live' ? 'video' : 'headphones')}<span data-fab-label>${tab === 'live' ? 'Go live' : 'Start a room'}</span>`;
  }

  function setTab(next) {
    tab = next;
    N.view.querySelectorAll('[data-tab]').forEach(b => {
      const on = b.dataset.tab === tab;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', String(on));
    });
    N.view.querySelectorAll('[data-section]').forEach(s => s.classList.toggle('is-off', s.dataset.section !== tab));
    syncFab();
  }

  N.view.querySelectorAll('[data-tab]').forEach(b => {
    b.addEventListener('click', () => {
      if (b.dataset.tab === tab) return;
      setTab(b.dataset.tab);
      N.view.querySelector('[data-section="' + tab + '"]').scrollIntoView({ behavior:'smooth', block:'start' });
    });
  });

  fab.addEventListener('click', () => {
    if (tab === 'live') location.href = 'studio.html';
    else N.startRoomSheet();
  });

  N.view.querySelectorAll('[data-start-room]').forEach(b => b.addEventListener('click', () => N.startRoomSheet()));
});
