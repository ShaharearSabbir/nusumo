/* Nusumo — Live */
N.ready(function () {
  const D = N.D;
  const CATS = ['All', 'Following', 'Music', 'Talk', 'Learning', 'Gaming'];
  let cat = 'All';
  let sort = 'Popular';
  let view = 'grid';
  let extra = 0;

  const secs = (t) => t.split(':').reduce((a, v) => a * 60 + (+v), 0);
  const welcomed = {};

  function filtered() {
    let list = D.liveStreams.filter(s => !s.featured);
    if (cat === 'Following') list = list.filter(s => N.user(s.user).following);
    else if (cat !== 'All') list = list.filter(s => s.category === cat);

    if (sort === 'Popular') list = list.slice().sort((a, b) => b.viewers - a.viewers);
    if (sort === 'Newest') list = list.slice().sort((a, b) => secs(a.elapsed) - secs(b.elapsed));

    if (extra) {
      const more = D.liveStreams.filter(s => !s.featured).slice(0, extra).map((s, i) => ({
        ...s,
        id: s.id + '-x' + i,
        viewers: Math.max(18, s.viewers - 140 * (i + 1)),
        viewersLabel: N.fmt(Math.max(18, s.viewers - 140 * (i + 1))),
        elapsed: '0' + (8 + i * 3) + ':' + String(12 + i * 7).padStart(2, '0')
      }));
      list = list.concat(more);
    }
    return list;
  }

  function statusChip(s) {
    if (s.ending) return `<span class="badge badge--live">Ending soon</span>`;
    if (N.user(s.user).following) return `<span class="row tiny faint" style="gap:6px"><span class="follow-dot"></span>Following</span>`;
    return `<button class="btn btn--ghost btn--sm" data-notify="${s.id}">${N.ic('bell')}${welcomed[s.id] ? 'Notified' : 'Notify'}</button>`;
  }

  function cohostStack(s) {
    if (!s.cohost) return '';
    return `<span class="row" style="margin-left:auto;gap:5px">
      <span class="tiny faint nowrap">with</span>
      ${N.av(s.cohost, 24, 'av--hair')}
      <span class="badge" style="height:20px;font-size:9.5px">+1</span>
    </span>`;
  }

  function card(s) {
    const u = N.user(s.user);
    return `<article class="live-card reveal" data-live="${s.id}">
      <a class="live-card__thumb" href="watch.html?id=${s.id}" aria-label="Watch ${N.esc(s.title)}">
        ${N.media(s.grad)}
        <span class="scrim-t" style="opacity:.55"></span>
        <span class="scrim-b"></span>
        <span class="live-card__art">${N.ic(s.category === 'Music' ? 'volume' : s.category === 'Gaming' ? 'zap' : s.category === 'Learning' ? 'school' : 'chat')}</span>
        <div class="live-card__top">
          <span class="live-badge live-badge--solid"><span class="live-dot"></span>Live</span>
          <span class="live-card__time">${s.elapsed}</span>
        </div>
        <div class="live-card__bottom">
          <span class="badge" style="background:rgba(8,7,13,.62);backdrop-filter:blur(8px)">${N.esc(s.category)}</span>
          <span class="live-card__watch">${N.ic('eye')}${s.viewersLabel}</span>
        </div>
      </a>
      <div class="live-card__body">
        ${N.av(u, 36, 'av--hair')}
        <div class="live-card__host">
          <div class="live-card__name">${N.esc(u.name)}${u.verified ? N.verified() : ''}</div>
          <div class="live-card__followers">${u.followers} followers</div>
        </div>
        ${cohostStack(s)}
      </div>
      <a class="live-card__title" href="watch.html?id=${s.id}">${N.esc(s.title)}</a>
      <div class="live-card__foot">
        <span class="row">${N.ic('eye')}${s.viewersLabel} watching</span>
        <span class="row" style="gap:6px;margin-left:auto">
          ${statusChip(s)}
          <button class="icon-btn" style="width:24px;height:24px" data-live-menu="${s.id}" aria-label="Stream options">${N.ic('more')}</button>
        </span>
      </div>
    </article>`;
  }

  function featured() {
    const s = D.liveStreams.find(x => x.featured) || D.liveStreams[0];
    const u = N.user(s.user);
    return `<a class="featured reveal" href="watch.html?id=${s.id}">
      ${N.media(s.grad)}
      <span class="scrim-b"></span>
      <div class="featured__top">
        <span class="live-badge live-badge--solid"><span class="live-dot"></span>Live now</span>
        <span class="featured__viewers">${N.ic('eye')}${s.viewersLabel} watching</span>
      </div>
      <div class="featured__body">
        <div class="featured__main">
          <div class="featured__host">
            ${N.av(u, 40, 'av--ring')}
            <div>
              <div class="featured__hostname">${N.esc(u.name)}${u.verified ? N.verified() : ''}</div>
              <div class="featured__hostsub">${N.esc(u.role)} · ${u.followers} followers</div>
            </div>
          </div>
          <h2 class="featured__title">${N.esc(s.title)}</h2>
          <div class="featured__meta">
            <span class="chip chip--sm">${N.esc(s.category)}</span>
            <span class="badge">${s.elapsed}</span>
            <span class="badge badge--violet">Featured</span>
          </div>
        </div>
        <div class="featured__cta">
          <span class="btn btn--primary btn--lg">${N.ic('play')}Watch live</span>
        </div>
      </div>
    </a>`;
  }

  function pkSection() {
    const list = (D.pkBattles || []).slice(0, 3);
    const mini = (b) => {
      const h = N.user(b.host), o = N.user(b.opponent);
      const share = Math.round(b.hostScore / (b.hostScore + b.oppScore) * 100);
      return `<a class="pk-mini reveal" href="pk-battle.html?mode=video&id=${b.id}">
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
          <span class="faint">Round ${b.round}/${b.rounds} · ${b.viewers} watching</span>
        </div>
      </a>`;
    };
    return `<section class="pk-spotlight reveal" aria-labelledby="pkSpotTitle">
      <div class="pk-spotlight__head">
        <span class="pk-spotlight__mark">${N.ic('swords')}</span>
        <div>
          <h2 id="pkSpotTitle">PK battles live</h2>
          <p>Two creators, one scoreboard. Jump in or challenge someone.</p>
        </div>
        <div class="pk-spotlight__actions">
          <a class="btn btn--ghost btn--sm" href="pk-battle.html?tab=matchmaking">${N.ic('target')}Find a rival</a>
          <a class="btn btn--primary btn--sm" href="pk-battle.html">${N.ic('swords')}Enter arena</a>
        </div>
      </div>
      <div class="pk-spotlight__grid">
        ${list.length ? list.map(mini).join('') : `<div class="empty" style="padding:20px"><p>No battles running right now.</p></div>`}
      </div>
    </section>`;
  }

  function gridHTML() {
    const list = filtered();
    if (!list.length) {
      return `<div class="card empty reveal">
        <div class="empty__icon">${N.ic('live')}</div>
        <h3>No live streams here yet</h3>
        <p>${cat === 'Following' ? 'The creators you follow are offline right now. Follow a few more to fill this space.' : 'Nothing is streaming in this category. Try another filter or start your own broadcast.'}</p>
        <div class="empty__actions">
          ${cat !== 'All' ? `<button class="btn btn--ghost" data-reset>Show all streams</button>` : `<a class="btn btn--ghost" href="members.html">Find creators</a>`}
          <a class="btn btn--primary" href="studio.html">${N.ic('video')}Go live</a>
        </div>
      </div>`;
    }
    return `<div class="live-grid ${view === 'list' ? 'live-grid--list' : ''}" id="liveGrid">${list.map(card).join('')}</div>
      <button class="btn btn--ghost btn--block" data-load-more style="height:40px;margin-top:16px">Load more streams</button>`;
  }

  function renderGrid() {
    const host = document.getElementById('liveResults');
    if (!host) return;
    host.innerHTML = gridHTML();
    N.reveal(host);
  }

  N.view.innerHTML = `<div class="page page--tight">
    <div class="page-head">
      <div>
        <div class="eyebrow">Happening now</div>
        <h1>Live</h1>
        <p class="lead">Studio tours, listening sessions and late-night hangs — happening in real time.</p>
      </div>
      <div class="page-head__actions">
        <a class="btn btn--ghost" href="hangout.html">${N.ic('headphones')}Audio rooms</a>
        <a class="btn btn--pk" href="pk-battle.html">${N.ic('swords')}PK battle</a>
        <a class="btn btn--primary" href="studio.html">${N.ic('video')}Go live</a>
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
        <div class="view-toggle" role="group" aria-label="Layout">
          <button class="${view === 'grid' ? 'is-active' : ''}" data-view="grid" aria-label="Grid view">${N.ic('grid')}</button>
          <button class="${view === 'list' ? 'is-active' : ''}" data-view="list" aria-label="List view">${N.ic('list')}</button>
        </div>
      </div>
    </div>

    <div id="liveResults"></div>
  </div>`;

  renderGrid();
  N.reveal();

  function streamMenu(s, anchor) {
    N.openMenu(anchor, [
      { icon:'share', label:'Share stream', onClick() { N.copy(location.origin + '/live/' + s.id); } },
      { icon:'bell', label:'Notify me next time', onClick() { welcomed[s.id] = true; N.toast('We’ll ping you when ' + N.user(s.user).name + ' goes live'); renderGrid(); } },
      { icon:'bookmark', label:'Save for later', onClick() { N.toast('Saved to your watchlist'); } },
      { sep:true },
      { icon:'ban', label:'Not interested', onClick() { N.toast('We’ll show fewer streams like this'); } },
      { icon:'flag', label:'Report stream', danger:true, onClick() { N.confirmDialog({ title:'Report this stream?', message:'Our moderation team reviews reports within 24 hours.', confirmLabel:'Report', danger:true, onConfirm() { N.toast('Report submitted'); } }); } }
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
    if (e.target.closest('[data-reset]')) { cat = 'All'; renderGrid(); document.querySelectorAll('[data-cat]').forEach(c => c.classList.toggle('is-active', c.dataset.cat === 'All')); return; }

    const sortBtn = e.target.closest('[data-sort]');
    if (sortBtn) {
      N.openMenu(sortBtn, ['Popular', 'Newest'].map(label => ({
        icon: label === 'Popular' ? 'zap' : 'clock', label,
        onClick() {
          sort = label;
          const lbl = document.querySelector('[data-sort-label]');
          if (lbl) lbl.textContent = sort;
          renderGrid();
        }
      })));
      return;
    }

    const viewBtn = e.target.closest('[data-view]');
    if (viewBtn) {
      view = viewBtn.dataset.view;
      document.querySelectorAll('[data-view]').forEach(b => b.classList.toggle('is-active', b === viewBtn));
      renderGrid();
      return;
    }

    const notify = e.target.closest('[data-notify]');
    if (notify) {
      welcomed[notify.dataset.notify] = true;
      notify.innerHTML = `${N.ic('bell')}Notified`;
      N.toast('You’ll be notified when this stream starts');
      return;
    }

    const menuBtn = e.target.closest('[data-live-menu]');
    if (menuBtn) {
      const s = D.liveStreams.find(x => x.id === menuBtn.dataset.liveMenu);
      if (s) streamMenu(s, menuBtn);
      return;
    }

    if (e.target.closest('[data-load-more]')) {
      const btn = e.target.closest('[data-load-more]');
      btn.textContent = 'Loading…';
      setTimeout(() => { extra = Math.min(extra + 2, 4); renderGrid(); N.toast('More streams loaded'); }, 450);
      return;
    }
  });
});
