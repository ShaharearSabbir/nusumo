/* Nusumo — Members */
N.ready(function () {
  const D = N.D;
  let query = '';
  let tag = 'All';
  const followed = new Set();

  function card(m) {
    const u = N.user(m.user);
    return `<article class="member-card">
      ${N.av(u, 56, 'av--hair')}
      <div class="member-card__name">${N.esc(u.name)}${u.verified ? N.verified() : ''}</div>
      <div class="member-card__role">${N.esc(m.role)}</div>
      <div class="member-card__tags">${m.tags.map(t => `<span class="chip chip--sm">${t}</span>`).join('')}</div>
      <button class="btn ${followed.has(m.user) ? 'btn--ghost' : 'btn--primary'} btn--sm" data-follow="${m.user}">${followed.has(m.user) ? 'Following' : 'Follow'}</button>
    </article>`;
  }

  function render() {
    const tags = ['All', ...new Set(D.members.flatMap(m => m.tags))];
    let list = D.members;
    if (tag !== 'All') list = list.filter(m => m.tags.includes(tag));
    if (query) list = list.filter(m => {
      const u = N.user(m.user);
      return (u.name + ' ' + m.role + ' ' + m.tags.join(' ')).toLowerCase().includes(query.toLowerCase());
    });
    N.view.innerHTML = `<div class="page">
      <div class="page-head">
        <div>
          <div class="eyebrow">Community</div>
          <h1>Members</h1>
          <p class="lead">${D.members.length} creators and listeners in the Nusumo circle.</p>
        </div>
        <div class="page-head__actions">
          <button class="btn btn--primary btn--sm" data-invite>${N.ic('plus')}Invite</button>
        </div>
      </div>
      <div class="row" style="gap:8px;margin-bottom:16px;flex-wrap:wrap">
        <input class="input" style="flex:1;min-width:200px;height:36px" placeholder="Search members" aria-label="Search members" data-q value="${N.esc(query)}">
      </div>
      <div class="filters" style="margin-bottom:16px">
        <div class="filters__chips">
          ${tags.map(t => `<button class="chip ${tag === t ? 'is-active' : ''}" data-tag="${t}">${t}</button>`).join('')}
        </div>
      </div>
      <div class="member-grid">${list.map(card).join('') || `<div style="grid-column:1/-1;text-align:center;padding:60px 12px;color:var(--faint);font-size:12px">${N.ic('users')}<div style="margin-top:8px">No members match.</div></div>`}</div>
    </div>`;
    N.reveal();
    wire();
  }

  function wire() {
    const q = N.view.querySelector('[data-q]');
    if (q) q.addEventListener('input', (e) => { query = e.target.value; render(); });
    N.view.querySelectorAll('[data-tag]').forEach(b => b.addEventListener('click', () => { tag = b.dataset.tag; render(); }));
    N.view.querySelectorAll('[data-follow]').forEach(b => b.addEventListener('click', () => {
      const id = b.dataset.follow;
      if (followed.has(id)) followed.delete(id); else followed.add(id);
      b.textContent = followed.has(id) ? 'Following' : 'Follow';
      b.classList.toggle('btn--primary', !followed.has(id));
      b.classList.toggle('btn--ghost', followed.has(id));
    }));
    N.view.querySelectorAll('[data-invite]').forEach(b => b.addEventListener('click', () => N.toast('Invite link copied')));
  }

  render();
});