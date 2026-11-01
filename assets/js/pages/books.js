/* Nusumo — Books */
N.ready(function () {
  const D = N.D;
  let filter = 'All';

  function card(b) {
    return `<article class="book-card">
      <div class="book-cover" style="background:var(--media,linear-gradient(135deg,#1a1230,#3a1f55))" ${b.grad.includes('gradient') ? `style="--media:${b.grad}"` : ''}>
        <div class="book-cover__spine"></div>
        <div>
          <div class="book-cover__title">${N.esc(b.title)}</div>
          <div class="book-cover__author">${N.esc(b.author)}</div>
        </div>
        <div class="book-cover__badge">
          ${b.progress === 100 ? `<span class="badge badge--ok">Read</span>` : b.progress > 0 ? `<span class="badge badge--violet">${b.progress}%</span>` : ''}
        </div>
      </div>
      <div style="padding:10px 2px 0">
        <div class="book-title">${N.esc(b.title)}</div>
        <div class="book-sub">${N.esc(b.author)} · ${N.esc(b.category)}</div>
        ${b.progress > 0 && b.progress < 100 ? `<div class="progress" style="margin-top:8px"><i style="width:${b.progress}%"></i></div>` : ''}
      </div>
    </article>`;
  }

  // fix media background via class
  // override card render to set media class
  function card2(b) {
    const cls = b.grad.includes('gradient') ? '' : `media--${b.grad}`;
    return `<article class="book-card">
      <div class="book-cover media ${cls}" ${b.grad.includes('gradient') ? `style="--media:${b.grad}"` : ''}>
        <div class="book-cover__spine"></div>
        <div>
          <div class="book-cover__title">${N.esc(b.title)}</div>
          <div class="book-cover__author">${N.esc(b.author)}</div>
        </div>
        <div class="book-cover__badge">
          ${b.progress === 100 ? `<span class="badge badge--ok">Read</span>` : b.progress > 0 ? `<span class="badge badge--violet">${b.progress}%</span>` : ''}
        </div>
      </div>
      <div style="padding:10px 2px 0">
        <div class="book-title">${N.esc(b.title)}</div>
        <div class="book-sub">${N.esc(b.author)} · ${N.esc(b.category)}</div>
        ${b.progress > 0 && b.progress < 100 ? `<div class="progress" style="margin-top:8px"><i style="width:${b.progress}%"></i></div>` : ''}
      </div>
    </article>`;
  }

  function render() {
    const cats = ['All', ...new Set(D.books.map(b => b.category))];
    const list = filter === 'All' ? D.books : D.books.filter(b => b.category === filter);
    N.view.innerHTML = `<div class="page">
      <div class="page-head">
        <div>
          <div class="eyebrow">Read</div>
          <h1>Books</h1>
          <p class="lead">Long-form writing from the community.</p>
        </div>
        <div class="page-head__actions">
          <button class="btn btn--ghost btn--sm" data-mine>${N.ic('bookmark')}My library</button>
        </div>
      </div>
      <div class="filters" style="margin-bottom:16px">
        <div class="filters__chips">
          ${cats.map(t => `<button class="chip ${filter === t ? 'is-active' : ''}" data-filter="${t}">${t}</button>`).join('')}
        </div>
      </div>
      <div class="book-grid">${list.map(card2).join('')}</div>
    </div>`;
    N.reveal();
    wire();
  }

  function wire() {
    N.view.querySelectorAll('[data-filter]').forEach(b => b.addEventListener('click', () => { filter = b.dataset.filter; render(); }));
    N.view.querySelectorAll('[data-mine]').forEach(b => b.addEventListener('click', () => N.toast('My library')));
  }

  render();
});