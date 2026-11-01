/* Nusumo — Saved posts & reels */
N.ready(function () {
  const D = N.D;
  let tab = 'posts';

  function savedPosts() { return (D.posts || []).filter(p => p.saved); }
  function savedReels() { return (D.reels || []).filter(r => r.saved); }

  function postCard(p) {
    const u = N.user(p.user);
    return `<article class="post reveal" data-post="${p.id}">
      <div class="post__head">
        ${N.av(u, 36, 'av--hair')}
        <div class="post__who">
          <div class="post__name">${N.esc(u.name)}${u.verified ? N.verified() : ''}</div>
          <div class="post__sub"><span class="post__role">${N.esc(u.role)}</span><span>${p.time}</span></div>
        </div>
        <button class="icon-btn" data-unsave="${p.id}" aria-label="Remove">${N.ic('bookmark')}</button>
      </div>
      <div class="post__body"><p>${N.esc(p.text)}</p></div>
      ${p.media ? `<div class="post__media ${p.media.ratio === 'square' ? 'post__media--tall' : ''}">${N.media(p.media.grad)}</div>` : ''}
      <div class="post__foot">
        <button class="act" data-open-post="${p.id}">${N.ic('chevronRight')}<span>Open</span></button>
        <button class="act act--end" data-unsave="${p.id}">${N.ic('trash')}<span>Remove</span></button>
      </div>
    </article>`;
  }

  function reelTile(r) {
    return `<a class="reel-tile" href="reels.html" style="aspect-ratio:9/16">
      ${N.media(r.grad)}
      <span class="reel-tile__views">${N.ic('eye')}${r.views}</span>
      <span class="reel-tile__badge">${r.time}</span>
      <button class="reel-tile__unsave" data-unsave-reel="${r.id}" aria-label="Remove" style="position:absolute;top:6px;left:6px;z-index:3;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:rgba(6,5,10,.6);color:#fff">${N.ic('x')}</button>
    </a>`;
  }

  function render() {
    const ps = savedPosts();
    const rs = savedReels();
    N.view.innerHTML = `<div class="page">
      <div class="page-head">
        <div>
          <div class="eyebrow">Library</div>
          <h1>Saved</h1>
          <p class="lead">Posts and reels you've saved for later.</p>
        </div>
      </div>
      <div class="feed-tabs" role="tablist">
        <button class="tab-btn ${tab === 'posts' ? 'is-active' : ''}" data-tab="posts">Posts <span class="count">${ps.length}</span></button>
        <button class="tab-btn ${tab === 'reels' ? 'is-active' : ''}" data-tab="reels">Reels <span class="count">${rs.length}</span></button>
      </div>
      <div id="savedContent">
        ${tab === 'posts'
          ? (ps.length ? `<div class="feed" style="gap:12px">${ps.map(postCard).join('')}</div>` : empty('posts'))
          : (rs.length ? `<div class="reel-grid">${rs.map(reelTile).join('')}</div>` : empty('reels'))}
      </div>
    </div>`;
    N.reveal();
    wire();
  }

  function empty(kind) {
    return `<div class="card empty" style="padding:50px 12px;text-align:center;margin-top:12px">
      <div class="empty__icon">${N.ic('bookmark')}</div>
      <h3>No saved ${kind} yet</h3>
      <p>Tap the bookmark icon on any ${kind === 'posts' ? 'post' : 'reel'} to save it here.</p>
      <div class="empty__actions" style="margin-top:12px"><a class="btn btn--primary btn--sm" href="${kind === 'posts' ? 'index.html' : 'reels.html'}">Browse ${kind === 'posts' ? 'feed' : 'reels'}</a></div>
    </div>`;
  }

  function wire() {
    N.view.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => { tab = b.dataset.tab; render(); }));
    N.view.querySelectorAll('[data-unsave]').forEach(b => b.addEventListener('click', () => {
      const p = (D.posts || []).find(x => x.id === b.dataset.unsave);
      if (p) { p.saved = false; N.toast('Removed from saved'); render(); }
    }));
    N.view.querySelectorAll('[data-unsave-reel]').forEach(b => b.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      const r = (D.reels || []).find(x => x.id === b.dataset.unsaveReel);
      if (r) { r.saved = false; N.toast('Removed from saved'); render(); }
    }));
  }

  render();
});