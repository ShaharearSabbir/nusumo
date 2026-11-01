/* Nusumo — Courses */
N.ready(function () {
  const D = N.D;
  let filter = 'All';

  function card(c) {
    const pct = c.progress;
    return `<article class="course-card">
      <div class="course-card__media">${N.media(c.grad)}
        <span class="course-card__level badge ${c.level === 'Beginner' ? 'badge--ok' : c.level === 'Advanced' ? 'badge--warn' : 'badge--violet'}">${c.level}</span>
        <span class="course-card__lesson">${c.lessons} lessons</span>
      </div>
      <div class="course-card__body">
        <div class="course-card__title">${N.esc(c.title)}</div>
        <div class="course-card__sub">${N.esc(c.author)} · ${N.esc(c.tag)}</div>
        <div class="course-card__progress"><div class="progress"><i style="width:${pct}%"></i></div>
          <span>${pct === 100 ? 'Completed' : pct + '% complete'}</span></div>
        <div class="course-card__foot">
          <span class="row" style="gap:4px">${N.ic('clock')}${c.lessons * 8} min</span>
          <button class="btn btn--primary btn--sm" data-open="${c.id}">${pct === 100 ? 'Review' : (pct > 0 ? 'Continue' : 'Start')}</button>
        </div>
      </div>
    </article>`;
  }

  function render() {
    const list = filter === 'All' ? D.courses : D.courses.filter(c => c.tag === filter);
    const tags = ['All', ...new Set(D.courses.map(c => c.tag))];
    N.view.innerHTML = `<div class="page">
      <div class="page-head">
        <div>
          <div class="eyebrow">Learn</div>
          <h1>Courses</h1>
          <p class="lead">Structured learning from creators you already follow.</p>
        </div>
        <div class="page-head__actions">
          <button class="btn btn--ghost btn--sm" data-mine>${N.ic('bookmark')}My learning</button>
        </div>
      </div>
      <div class="filters" style="margin-bottom:16px">
        <div class="filters__chips">
          ${tags.map(t => `<button class="chip ${filter === t ? 'is-active' : ''}" data-filter="${t}">${t}</button>`).join('')}
        </div>
      </div>
      <div class="course-grid">${list.map(card).join('')}</div>
    </div>`;
    N.reveal();
    wire();
  }

  function wire() {
    N.view.querySelectorAll('[data-filter]').forEach(b => b.addEventListener('click', () => { filter = b.dataset.filter; render(); }));
    N.view.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => N.toast('Opening course…')));
    N.view.querySelectorAll('[data-mine]').forEach(b => b.addEventListener('click', () => N.toast('My learning')));
  }

  render();
});