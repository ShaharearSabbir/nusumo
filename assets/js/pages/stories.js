/* Nusumo — Stories */
N.ready(function () {
  const D = N.D;
  const stories = D.stories || [];

  let active = null; // story id
  let itemIndex = 0;
  let timer = null;

  function ring(s) {
    const u = N.user(s.user);
    return `<button class="story-ring ${s.viewed ? 'is-viewed' : ''}" data-story="${s.id}">
      <span class="story-ring__art" style="--g:${u.grad}">${N.av(s.user, 52, 'av--hair')}</span>
      <span class="story-ring__name">${N.esc(u.name.split(' ')[0])}</span>
      ${s.items > 1 ? `<span class="story-ring__count">${s.items}</span>` : ''}
    </button>`;
  }

  function card(s) {
    const u = N.user(s.user);
    return `<article class="story-card reveal" data-story="${s.id}">
      <div class="story-card__media">${N.media(s.grad)}<span class="story-card__time">${s.time}</span></div>
      <div class="story-card__foot">
        ${N.av(s.user, 26, 'av--hair')}
        <div class="story-card__meta">
          <div class="story-card__name">${N.esc(u.name)}${u.verified ? N.verified() : ''}</div>
          <div class="story-card__sub">${s.items} item${s.items > 1 ? 's' : ''} · ${s.time}</div>
        </div>
        <button class="icon-btn" data-story-menu="${s.id}" aria-label="Options">${N.ic('more')}</button>
      </div>
    </article>`;
  }

  N.view.innerHTML = `<div class="page">
    <div class="page-head">
      <div>
        <div class="eyebrow">Moments</div>
        <h1>Stories</h1>
        <p class="lead">24-hour snapshots from creators you follow.</p>
      </div>
      <div class="page-head__actions">
        <button class="btn btn--primary btn--sm" data-create-story>${N.ic('plus')}Your story</button>
      </div>
    </div>

    <section class="card" style="padding:16px;margin-bottom:18px">
      <div style="display:flex;align-items:center;gap:14px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none">
        <button class="story-add" data-create-story>
          <span class="story-add__art">${N.av('me', 52, 'av--hair')}<span class="story-add__plus">${N.ic('plus')}</span></span>
          <span class="story-add__name">Your story</span>
        </button>
        ${stories.map(ring).join('')}
      </div>
    </section>

    <div class="section-head" style="margin:4px 0 9px"><h2>Recent</h2><span class="count">${stories.length}</span></div>
    <div class="story-grid">${stories.map(card).join('')}</div>
  </div>`;

  // inject minimal styles
  const style = document.createElement('style');
  style.textContent = `
    .story-ring{display:flex;flex-direction:column;align-items:center;gap:6px;background:none;border:0;padding:0;cursor:pointer;flex-shrink:0}
    .story-ring__art{width:62px;height:62px;border-radius:50%;display:grid;place-items:center;padding:3px;background:linear-gradient(135deg,#a678ff,#ff6ad5);position:relative}
    .story-ring.is-viewed .story-ring__art{background:rgba(var(--overlay-rgb),.12)}
    .story-ring__art .av{--s:54px;border:3px solid var(--bg)}
    .story-ring__name{font-size:10px;color:var(--muted);max-width:64px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .story-ring__count{position:absolute;right:-2px;bottom:-2px;width:18px;height:18px;border-radius:50%;background:var(--grad);color:#180a26;font-size:9px;font-weight:700;display:grid;place-items:center;border:2px solid var(--bg)}
    .story-add{display:flex;flex-direction:column;align-items:center;gap:6px;background:none;border:0;padding:0;cursor:pointer;flex-shrink:0}
    .story-add__art{width:62px;height:62px;border-radius:50%;display:grid;place-items:center;padding:3px;background:rgba(var(--overlay-rgb),.1);position:relative}
    .story-add__art .av{--s:54px;border:3px solid var(--bg)}
    .story-add__plus{position:absolute;right:2px;bottom:2px;width:20px;height:20px;border-radius:50%;background:var(--grad);color:#180a26;display:grid;place-items:center;border:2px solid var(--bg)}
    .story-add__plus .icon{width:11px;height:11px;stroke-width:2.6}
    .story-add__name{font-size:10px;color:var(--muted)}
    .story-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
    .story-card{border:1px solid var(--border);border-radius:14px;overflow:hidden;background:var(--surface);cursor:pointer;transition:transform .2s,border-color .2s}
    .story-card:hover{transform:translateY(-2px);border-color:var(--border-strong)}
    .story-card__media{position:relative;aspect-ratio:9/16}
    .story-card__media .media{position:absolute;inset:0}
    .story-card__time{position:absolute;top:8px;right:8px;z-index:2;font-size:9.5px;height:19px;padding:0 6px;border-radius:4px;background:rgba(6,5,10,.65);backdrop-filter:blur(6px);display:grid;place-items:center}
    .story-card__foot{display:flex;align-items:center;gap:9px;padding:10px 12px}
    .story-card__meta{min-width:0;flex:1}
    .story-card__name{font-size:12px;font-weight:600;display:flex;align-items:center;gap:4px}
    .story-card__sub{font-size:10px;color:var(--faint);margin-top:2px}
    .story-viewer{position:fixed;inset:0;z-index:80;background:#000;display:flex;flex-direction:column}
    .story-viewer__bar{display:flex;gap:4px;padding:10px 12px}
    .story-viewer__seg{flex:1;height:3px;border-radius:2px;background:rgba(var(--overlay-rgb),.25);overflow:hidden}
    .story-viewer__seg i{display:block;height:100%;width:0;background:#fff;transition:width .1s linear}
    .story-viewer__seg.is-done i{width:100%}
    .story-viewer__seg.is-active i{width:60%}
    .story-viewer__head{display:flex;align-items:center;gap:10px;padding:6px 12px 10px}
    .story-viewer__media{flex:1;position:relative;overflow:hidden}
    .story-viewer__media .media{position:absolute;inset:0}
    .story-viewer__reply{display:flex;align-items:center;gap:8px;padding:10px 12px calc(12px + env(safe-area-inset-bottom));background:linear-gradient(180deg,transparent,rgba(0,0,0,.5))}
    .story-viewer__reply input{flex:1;height:38px;border-radius:99px;border:1px solid rgba(var(--overlay-rgb),.16);background:rgba(var(--overlay-rgb),.08);padding:0 14px;color:#fff;font-size:12px}
    .story-viewer__nav{position:absolute;top:50%;transform:translateY(-50%);width:36px;height:36px;border-radius:50%;display:grid;place-items:center;background:rgba(0,0,0,.35);color:#fff;border:1px solid rgba(var(--overlay-rgb),.16);z-index:5}
    .story-viewer__nav--prev{left:10px}
    .story-viewer__nav--next{right:10px}
  `;
  document.head.appendChild(style);

  N.reveal();

  function openViewer(id) {
    const s = stories.find(x => x.id === id);
    if (!s) return;
    active = id; itemIndex = 0;
    s.viewed = true;
    const u = N.user(s.user);
    const overlay = document.createElement('div');
    overlay.className = 'story-viewer';
    overlay.innerHTML = `
      <div class="story-viewer__bar">${Array.from({length:s.items}).map((_,i)=>`<div class="story-viewer__seg ${i===0?'is-active':''}" data-seg="${i}"><i></i></div>`).join('')}</div>
      <div class="story-viewer__head">
        ${N.av(s.user, 34, 'av--hair')}
        <div style="min-width:0;flex:1">
          <div style="font-size:13px;font-weight:600">${N.esc(u.name)}${u.verified?N.verified():''}</div>
          <div style="font-size:10.5px;color:rgba(var(--overlay-rgb),.6)">${s.time} · ${s.items} item${s.items>1?'s':''}</div>
        </div>
        <button class="icon-btn" data-close style="color:#fff">${N.ic('x')}</button>
      </div>
      <div class="story-viewer__media">${N.media(s.grad)}<span style="position:absolute;inset:0;display:grid;place-items:center;color:rgba(var(--overlay-rgb),.85);font-size:13px;font-weight:600;z-index:2;text-align:center;padding:20px">“${N.esc(u.name.split(' ')[0])}’s story — item ${itemIndex+1} of ${s.items}”</span></div>
      <button class="story-viewer__nav story-viewer__nav--prev" data-prev>${N.ic('chevronLeft')}</button>
      <button class="story-viewer__nav story-viewer__nav--next" data-next>${N.ic('chevronRight')}</button>
      <div class="story-viewer__reply">
        <button class="icon-btn" style="color:#fff">${N.ic('heart')}</button>
        <input id="storyReply" name="storyReply" placeholder="Reply to ${N.esc(u.name.split(' ')[0])}…" data-reply>
        <button class="icon-btn" style="color:#fff">${N.ic('send')}</button>
      </div>`;
    document.body.appendChild(overlay);
    const close = () => { overlay.remove(); active=null; if(timer) clearTimeout(timer); };
    overlay.querySelector('[data-close]').addEventListener('click', close);
    overlay.addEventListener('click', (e)=>{ if(e.target===overlay) close(); });
    const advance = (dir) => {
      if (dir>0 && itemIndex < s.items-1) { itemIndex++; N.toast('Next item'); }
      else if (dir>0) { close(); N.toast('Story ended'); return; }
      else if (itemIndex>0) { itemIndex--; }
      overlay.querySelector('.story-viewer__media span').textContent = `“${u.name.split(' ')[0]}’s story — item ${itemIndex+1} of ${s.items}”`;
    };
    overlay.querySelector('[data-prev]').addEventListener('click', ()=>advance(-1));
    overlay.querySelector('[data-next]').addEventListener('click', ()=>advance(1));
    overlay.querySelector('[data-reply]').addEventListener('keydown', e=>{ if(e.key==='Enter'){ const v=e.target.value.trim(); if(v){ N.toast('Reply sent'); e.target.value=''; } } });
    // mark viewed ring
    document.querySelectorAll(`[data-story="${id}"]`).forEach(el=>el.classList.add('is-viewed'));
  }

  document.addEventListener('click', (e) => {
    const r = e.target.closest('[data-story]');
    if (r) { openViewer(r.dataset.story); return; }
    if (e.target.closest('[data-create-story]')) { N.toast('Opening camera…'); return; }
    const m = e.target.closest('[data-story-menu]');
    if (m) {
      N.openMenu(m, [
        { icon:'bookmark', label:'Save story', onClick(){ N.toast('Saved'); } },
        { icon:'link', label:'Copy link', onClick(){ N.copy(location.origin+'/story/'+m.dataset.storyMenu); } },
        { icon:'ban', label:'Hide', onClick(){ N.toast('Hidden'); } },
        { sep:true },
        { icon:'flag', label:'Report', danger:true, onClick(){ N.toast('Reported'); } }
      ]);
      return;
    }
  });
});