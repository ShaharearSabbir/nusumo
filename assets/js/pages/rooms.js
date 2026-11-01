/* Nusumo — Audio rooms */
N.ready(function () {
  const D = N.D;
  const CATS = ['All', 'Following', 'Music', 'Talk', 'Learning', 'Gaming'];
  let cat = 'All';
  let sort = 'Active';
  let extra = 0;
  const reminded = {};

  const secs = (t) => (t || '0:0').split(':').reduce((a, v) => a * 60 + (+v), 0);

  function filtered() {
    let list = D.rooms.filter(r => !r.featured);
    if (cat === 'Following') list = list.filter(r => N.user(r.user).following);
    else if (cat !== 'All') list = list.filter(r => r.category === cat);

    if (sort === 'Active') list = list.slice().sort((a, b) => b.listeners - a.listeners);
    if (sort === 'Newest') list = list.slice().sort((a, b) => secs(a.elapsed) - secs(b.elapsed));
    if (sort === 'Starting soon') list = list.slice().sort((a, b) => (a.status === 'soon' ? -1 : 1) - (b.status === 'soon' ? -1 : 1));

    if (extra) {
      const more = D.rooms.filter(r => !r.featured).slice(0, extra).map((r, i) => ({
        ...r, id: r.id + '-x' + i,
        listeners: Math.max(9, r.listeners - 30 * (i + 1)),
        elapsed: '0' + (6 + i * 4) + ':' + String(20 + i * 9).padStart(2, '0')
      }));
      list = list.concat(more);
    }
    return list;
  }

  function speakerStack(r, size) {
    const px = size || 24;
    const s = r.speakers.slice(0, 3);
    return `<span class="av-stack" style="--s:${px}px">${s.map(id => N.av(id, px, 'av--hair', true)).join('')}
      ${r.extra ? `<span class="av-more" style="--s:${px}px">+${r.extra}</span>` : ''}
    </span>`;
  }

  function card(r) {
    const u = N.user(r.user);
    const soon = r.status === 'soon';
    return `<article class="room-card reveal">
      <a class="room-card__art media--${r.grad || 'violet'}" href="room.html?id=${r.id}" aria-label="${N.esc(r.title)}">
        <span class="room-card__badges">
          ${soon ? `<span class="badge badge--warn">${N.ic('clock')}${N.esc(r.startsIn)}</span>` : `<span class="live-badge live-badge--solid"><span class="live-dot"></span>Live</span>`}
          <span class="badge">${N.esc(r.category)}</span>
        </span>
        <span class="room-card__glyph">${N.ic('headphones')}</span>
        <span class="room-card__wave"><i></i><i></i><i></i><i></i><i></i></span>
      </a>
      <div class="room-card__body">
        <a class="room-card__title" href="room.html?id=${r.id}">${N.esc(r.title)}</a>
        <div class="room-card__host">${N.av(u, 22, 'av--hair')}<span>Hosted by ${N.esc(u.name)}</span>${u.verified ? N.verified() : ''}</div>
        <div class="room-card__speakers">
          ${speakerStack(r)}
          <span class="row" style="gap:4px">${N.ic('users')}${r.listeners} listening</span>
        </div>
      </div>
      <div class="room-card__foot">
        <span class="row" style="gap:5px">${soon ? N.ic('calendar') : N.ic('clock')}${soon ? 'Starting soon' : r.elapsed}</span>
        <span class="row" style="gap:4px">
          ${soon
            ? `<button class="btn btn--ghost btn--sm" data-notify="${r.id}">${N.ic('bell')}${reminded[r.id] ? 'Reminded' : 'Notify'}</button>`
            : `<a class="btn btn--primary btn--sm" href="room.html?id=${r.id}">${N.ic('headphones')}Join</a>`}
          <button class="icon-btn" style="width:24px;height:24px" data-room-menu="${r.id}" aria-label="Room options">${N.ic('more')}</button>
        </span>
      </div>
    </article>`;
  }

  function featured() {
    const r = D.rooms.find(x => x.featured) || D.rooms[0];
    const u = N.user(r.user);
    return `<div class="featured-room reveal">
      <div class="featured-room__art">${N.ic('headphones')}</div>
      <div class="featured-room__main">
        <div class="row row--wrap" style="gap:7px">
          <span class="live-badge live-badge--solid"><span class="live-dot"></span>Live now</span>
          <span class="chip chip--sm">${N.esc(r.category)}</span>
          <span class="badge">${r.elapsed}</span>
          <span class="badge badge--violet">${N.ic('zap')}Featured</span>
        </div>
        <h2 class="featured-room__title">${N.esc(r.title)}</h2>
        <div class="row" style="gap:8px">
          ${N.av(u, 30, 'av--hair')}
          <div class="tiny"><b class="white" style="font-weight:600">${N.esc(u.name)}</b>${u.verified ? N.verified() : ''}<div class="faint">${N.esc(u.role)} · ${u.followers} followers</div></div>
        </div>
        <div class="featured-room__meta">
          ${speakerStack(r, 28)}
          <span class="tiny faint">${r.speakers.length + r.extra} on stage</span>
          <span class="dot-sep"></span>
          <span class="row tiny" style="gap:5px">${N.ic('users')}${r.listeners} listening</span>
        </div>
      </div>
      <div class="featured-room__side">
        <a class="btn btn--primary btn--lg" href="room.html?id=${r.id}">${N.ic('headphones')}Join room</a>
        <button class="btn btn--ghost btn--sm" data-notify="${r.id}">${N.ic('bell')}Remind me</button>
      </div>
    </div>`;
  }

  function pkSection() {
    const list = (D.pkBattles || []).filter(b => b.mode === 'audio').slice(0, 3);
    const src = list.length ? list : (D.pkBattles || []).slice(0, 3);
    const mini = (b) => {
      const h = N.user(b.host), o = N.user(b.opponent);
      const share = Math.round(b.hostScore / (b.hostScore + b.oppScore) * 100);
      return `<a class="pk-mini reveal" href="pk-battle.html?mode=audio&id=${b.id}">
        <div class="pk-mini__duo">
          <span class="pk-mini__ava">${N.av(h, 34, 'av--ring')}</span>
          <span class="pk-mini__vs">VS</span>
          <span class="pk-mini__ava">${N.av(o, 34, 'av--ring')}</span>
          <span class="pk-mini__timer">${N.ic('clock')}${b.timer}</span>
        </div>
        <div class="pk-mini__names">${N.esc(h.name.split(' ')[0])} <span class="faint">vs</span> ${N.esc(o.name.split(' ')[0])}</div>
        <div class="pk-mini__meta">
          <span class="pk-mini__mode">${N.ic(b.mode === 'audio' ? 'headphones' : 'video')}${b.mode === 'audio' ? 'Audio' : 'Video'}</span>
          <span class="pk-mini__cat">${N.esc(b.category)}</span>
        </div>
        <div class="pk-mini__meter" role="img" aria-label="${share}% to ${N.esc(h.name)}">
          <span style="width:${share}%"></span>
        </div>
        <div class="pk-mini__foot">
          <span>${N.fmt(b.hostScore)} <span class="faint">:</span> ${N.fmt(b.oppScore)}</span>
          <span class="faint">Round ${b.round}/${b.rounds} · ${b.viewers} listening</span>
        </div>
      </a>`;
    };
    return `<section class="pk-spotlight reveal" aria-labelledby="pkSpotTitle">
      <div class="pk-spotlight__head">
        <span class="pk-spotlight__mark">${N.ic('swords')}</span>
        <div>
          <h2 id="pkSpotTitle">PK battles · audio</h2>
          <p>Two creators, one scoreboard. Jump into a voice battle or challenge a rival.</p>
        </div>
        <div class="pk-spotlight__actions">
          <a class="btn btn--ghost btn--sm" href="pk-battle.html?mode=audio&tab=matchmaking">${N.ic('target')}Find a rival</a>
          <a class="btn btn--pk btn--sm" href="pk-battle.html?mode=audio">${N.ic('swords')}Enter arena</a>
        </div>
      </div>
      <div class="pk-spotlight__grid">
        ${src.length ? src.map(mini).join('') : `<div class="empty" style="padding:20px"><p>No audio battles running right now.</p></div>`}
      </div>
    </section>`;
  }

  function renderGrid() {
    const host = document.getElementById('roomResults');
    if (!host) return;
    const list = filtered();
    if (!list.length) {
      host.innerHTML = `<div class="card empty reveal">
        <div class="empty__icon">${N.ic('headphones')}</div>
        <h3>No rooms in this lane</h3>
        <p>Nothing is happening in ${cat === 'Following' ? 'the rooms you follow' : cat.toLowerCase()} right now. Start a room and bring people in.</p>
        <div class="empty__actions">
          ${cat !== 'All' ? `<button class="btn btn--ghost" data-reset>Show all rooms</button>` : ''}
          <button class="btn btn--primary" data-start-room>${N.ic('mic')}Start a room</button>
        </div>
      </div>`;
      N.reveal(host);
      return;
    }
    host.innerHTML = `<div class="room-grid">${list.map(card).join('')}</div>
      <button class="btn btn--ghost btn--block" data-load-more style="height:40px;margin-top:16px">Load more rooms</button>`;
    N.reveal(host);
  }

  N.view.innerHTML = `<div class="page page--tight">
    <div class="page-head">
      <div>
        <div class="eyebrow">Listen in</div>
        <h1>Audio rooms</h1>
        <p class="lead">Live conversations, listening sessions and critiques — drop in, raise a hand, or just listen.</p>
      </div>
      <div class="page-head__actions">
        <a class="btn btn--ghost" href="live.html">${N.ic('live')}Live streams</a>
        <a class="btn btn--pk" href="pk-battle.html?mode=audio">${N.ic('swords')}PK battle</a>
        <button class="btn btn--primary" data-start-room>${N.ic('mic')}Start a room</button>
      </div>
    </div>

    ${featured()}

    ${pkSection()}

    <div class="filters">
      <div class="filters__chips">
        ${CATS.map(c => `<button class="chip ${cat === c ? 'is-active' : ''}" data-cat="${c}">${c}</button>`).join('')}
      </div>
      <div class="filters__right">
        <button class="filters__sort" data-sort aria-haspopup="menu">${N.ic('sliders')}<span data-sort-label>${sort}</span>${N.ic('chevronDown')}</button>
      </div>
    </div>

    <div id="roomResults"></div>
  </div>`;

  renderGrid();
  N.reveal();

  function startRoomSheet() { N.startRoomSheet(); }

  function roomMenu(r, anchor) {
    N.openMenu(anchor, [
      { icon:'share', label:'Share room', onClick() { N.copy(location.origin + '/room/' + r.id); } },
      { icon:'link', label:'Copy link', onClick() { N.copy(location.origin + '/room/' + r.id); } },
      { icon:'bell', label:'Notify me when it starts', onClick() { N.toast('We’ll remind you 10 minutes before'); } },
      { sep:true },
      { icon:'ban', label:'Not interested', onClick() { N.toast('We’ll show fewer rooms like this'); } },
      { icon:'flag', label:'Report room', danger:true, onClick() { N.confirmDialog({ title:'Report this room?', message:'Our moderation team reviews reports within 24 hours.', confirmLabel:'Report', danger:true, onConfirm() { N.toast('Report submitted'); } }); } }
    ]);
  }

  document.addEventListener('click', function (e) {
    const chip = e.target.closest('[data-cat]');
    if (chip) {
      cat = chip.dataset.cat;
      document.querySelectorAll('[data-cat]').forEach(c => c.classList.toggle('is-active', c === chip));
      renderGrid();
      return;
    }
    if (e.target.closest('[data-reset]')) {
      cat = 'All';
      document.querySelectorAll('[data-cat]').forEach(c => c.classList.toggle('is-active', c.dataset.cat === 'All'));
      renderGrid();
      return;
    }
    const sortBtn = e.target.closest('[data-sort]');
    if (sortBtn) {
      N.openMenu(sortBtn, ['Active', 'Newest', 'Starting soon'].map(label => ({
        icon: label === 'Active' ? 'zap' : label === 'Newest' ? 'clock' : 'calendar', label,
        onClick() {
          sort = label;
          const lbl = document.querySelector('[data-sort-label]');
          if (lbl) lbl.textContent = sort;
          renderGrid();
        }
      })));
      return;
    }
    const notify = e.target.closest('[data-notify]');
    if (notify) {
      reminded[notify.dataset.notify] = true;
      notify.innerHTML = `${N.ic('bell')}Reminded`;
      N.toast('We’ll remind you 10 minutes before');
      return;
    }
    const menuBtn = e.target.closest('[data-room-menu]');
    if (menuBtn) {
      const r = D.rooms.find(x => x.id === menuBtn.dataset.roomMenu);
      if (r) roomMenu(r, menuBtn);
      return;
    }
    if (e.target.closest('[data-start-room]')) return startRoomSheet();
    if (e.target.closest('[data-load-more]')) {
      const btn = e.target.closest('[data-load-more]');
      btn.textContent = 'Loading…';
      setTimeout(() => { extra = Math.min(extra + 2, 4); renderGrid(); N.toast('More rooms loaded'); }, 450);
      return;
    }
  });
});
