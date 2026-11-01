/* Nusumo — Notifications */
N.ready(function () {
  const D = N.D;
  let filter = 'all';
  const notes = D.notifications.map(n => ({ ...n }));

  const iconFor = (n) => {
    if (n.type === 'live') return ['live','notif-row__icon--live'];
    if (n.type === 'follow') return ['user',''];
    if (n.type === 'like') return ['heart',''];
    if (n.type === 'comment') return ['comment',''];
    if (n.type === 'room') return ['headphones','notif-row__icon--live'];
    if (n.type === 'mention') return ['chat',''];
    return ['bell','notif-row__icon--ok'];
  };

  function filtered() {
    if (filter === 'all') return notes;
    if (filter === 'unread') return notes.filter(n => n.unread);
    return notes.filter(n => n.type === filter);
  }

  function row(n) {
    const u = n.user ? N.user(n.user) : null;
    const [ic, cls] = iconFor(n);
    return `<button class="notif-row ${n.unread ? 'is-unread' : ''}" data-id="${n.id}">
      <span class="notif-row__icon ${cls}">${N.ic(ic)}</span>
      <div class="notif-row__body">
        <div>${N.esc(n.title)}</div>
        <div style="font-size:11px;color:var(--faint);margin-top:2px">${N.esc(n.body)}</div>
        <div class="notif-row__time">${n.time}</div>
      </div>
      ${n.thumb ? `<div class="notif-row__thumb">${N.media(n.thumb)}</div>` : (u ? N.av(u, 32, 'av--hair') : '')}
    </button>`;
  }

  function render() {
    const list = filtered();
    const groups = {};
    list.forEach(n => {
      const key = n.time.includes('m') || n.time.includes('h') ? 'Recent' : 'Earlier';
      (groups[key] = groups[key] || []).push(n);
    });
    N.view.innerHTML = `<div class="page">
      <div class="page-head">
        <div>
          <div class="eyebrow">Inbox</div>
          <h1>Notifications</h1>
          <p class="lead">Everything that happened while you were away.</p>
        </div>
        <div class="page-head__actions">
          <button class="btn btn--ghost btn--sm" data-mark-all>${N.ic('check')}Mark all read</button>
          <button class="btn btn--ghost btn--sm" data-settings>${N.ic('settings')}</button>
        </div>
      </div>
      <div class="filters" style="margin-bottom:14px">
        <div class="filters__chips">
          ${[['all','All'],['unread','Unread'],['live','Live'],['follow','Follows'],['like','Likes'],['comment','Comments'],['system','System']].map(([k,l]) =>
            `<button class="chip ${filter === k ? 'is-active' : ''}" data-filter="${k}">${l}</button>`).join('')}
        </div>
      </div>
      <div class="notif-list">
        ${list.length ? list.map(row).join('') : `<div style="padding:60px 12px;text-align:center;color:var(--faint);font-size:12px">${N.ic('bell')}<div style="margin-top:8px">You're all caught up.</div></div>`}
      </div>
    </div>`;
    N.reveal();
    wire();
  }

  function wire() {
    N.view.querySelectorAll('[data-filter]').forEach(b => b.addEventListener('click', () => { filter = b.dataset.filter; render(); }));
    N.view.querySelectorAll('[data-id]').forEach(b => b.addEventListener('click', () => {
      const n = notes.find(x => x.id === b.dataset.id);
      if (n) n.unread = false;
      b.classList.remove('is-unread');
      N.toast('Opened');
    }));
    N.view.querySelectorAll('[data-mark-all]').forEach(b => b.addEventListener('click', () => {
      notes.forEach(n => n.unread = false);
      render();
      N.toast('All marked read');
    }));
    N.view.querySelectorAll('[data-settings]').forEach(b => b.addEventListener('click', () => N.toast('Notification settings')));
  }

  render();
});