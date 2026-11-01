/* Nusumo — Exclusive content (OnlyFans-style) */
N.ready(function () {
  const D = N.D;
  const posts = D.exclusivePosts || [];
  const subs = D.creatorSubs || [];
  let tab = 'discover';

  function typeBadge(p) {
    return p.type === 'video'
      ? `<span class="badge badge--violet">${N.ic('video')} ${p.duration}</span>`
      : `<span class="badge badge--violet">${N.ic('book')} ${p.pages} pages</span>`;
  }

  function postCard(p) {
    const u = N.user(p.creator);
    const locked = p.locked;
    return `<article class="ex-card reveal">
      <div class="ex-card__media">
        ${N.media(p.grad)}
        <div class="ex-card__scrim"></div>
        ${locked ? `<div class="ex-card__lock">${N.ic('lock')}<span>Subscribers only</span></div>` : `<div class="ex-card__play">${N.ic('play')}</div>`}
        <div class="ex-card__top">
          ${typeBadge(p)}
          ${!locked ? `<span class="badge badge--ok">Unlocked</span>` : ''}
        </div>
      </div>
      <div class="ex-card__body">
        ${N.av(p.creator, 30, 'av--hair')}
        <div class="ex-card__meta">
          <div class="ex-card__title">${N.esc(p.title)}</div>
          <div class="ex-card__sub">${N.esc(u.name)}${u.verified?N.verified():''} · ${N.fmt(p.likes)} likes</div>
          <div class="ex-card__desc">${N.esc(p.desc)}</div>
        </div>
        <div class="ex-card__foot">
          <div class="ex-card__price">${locked ? `৳${p.price}<small>/mo to unlock</small>` : `<span style="color:var(--ok)">Included</span>`}</div>
          ${locked
            ? `<button class="btn btn--primary btn--sm" data-subscribe="${p.creator}">${N.ic('lock')}Subscribe</button>`
            : `<button class="btn btn--ghost btn--sm" data-view="${p.id}">${N.ic('eye')}View</button>`}
        </div>
      </div>
    </article>`;
  }

  function subRow(s) {
    const u = N.user(s.creator);
    return `<div class="sub-row">
      ${N.av(s.creator, 44, 'av--hair')}
      <div class="sub-row__meta">
        <div class="sub-row__name">${N.esc(u.name)}${u.verified?N.verified():''} <span class="badge badge--violet" style="margin-left:6px">${s.tier}</span></div>
        <div class="sub-row__sub">Since ${s.since} · renews ${s.renewal} · ৳${s.price}/mo</div>
        <div class="sub-row__perks">${s.perks.map(p=>`<span class="chip chip--sm">${N.esc(p)}</span>`).join('')}</div>
      </div>
      <div class="sub-row__actions">
        <button class="btn btn--ghost btn--sm" data-manage-sub="${s.creator}">${N.ic('settings')}Manage</button>
        <button class="btn btn--ghost btn--sm" data-cancel-sub="${s.creator}">${N.ic('x')}Cancel</button>
      </div>
    </div>`;
  }

  function discoverHTML() {
    return `<div class="ex-grid">${posts.map(postCard).join('')}</div>`;
  }

  function subsHTML() {
    if (!subs.length) return `<div class="card empty" style="padding:40px 12px;text-align:center"><div class="empty__icon">${N.ic('lock')}</div><h3>No subscriptions yet</h3><p>Subscribe to a creator to unlock their exclusive content.</p></div>`;
    return `<div style="display:flex;flex-direction:column;gap:12px">${subs.map(subRow).join('')}</div>
      <div class="card" style="padding:16px;margin-top:18px;display:flex;align-items:center;gap:14px;flex-wrap:wrap">
        <div style="flex:1;min-width:220px">
          <div style="font-size:12.5px;font-weight:600">Total monthly</div>
          <div style="font-size:10.5px;color:var(--faint);margin-top:3px">৳${subs.reduce((a,s)=>a+s.price,0)}/mo · ${subs.length} creators</div>
        </div>
        <button class="btn btn--ghost btn--sm" data-browse>${N.ic('search')}Discover more</button>
      </div>`;
  }

  function earningsHTML() {
    const earned = 1240, subsCount = 86, requests = 12;
    return `<div class="stats-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:18px">
      <div class="stat-box"><span>Earnings (30d)</span><b>৳${earned}</b></div>
      <div class="stat-box"><span>Subscribers</span><b>${subsCount}</b></div>
      <div class="stat-box"><span>Exclusive posts</span><b>${posts.filter(p=>p.creator==='me' || true).length}</b></div>
      <div class="stat-box"><span>Requests</span><b>${requests}</b></div>
    </div>
    <div class="card" style="padding:16px">
      <h3 style="font-size:12.5px;font-weight:650;margin-bottom:10px">Your exclusive posts</h3>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${posts.slice(0,4).map(p=>`
          <div class="ex-row">
            <div class="ex-row__art">${N.media(p.grad)}</div>
            <div style="min-width:0;flex:1">
              <div style="font-size:12px;font-weight:600">${N.esc(p.title)}</div>
              <div style="font-size:10px;color:var(--faint)">${p.locked?'Subscribers only':'Public'} · ${N.fmt(p.likes)} likes</div>
            </div>
            <button class="btn btn--ghost btn--sm">${N.ic('sliders')}Edit</button>
          </div>`).join('')}
      </div>
      <button class="btn btn--primary btn--sm" style="margin-top:12px" data-new-exclusive>${N.ic('plus')}New exclusive post</button>
    </div>`;
  }

  function render() {
    N.view.innerHTML = `<div class="page">
      <div class="page-head">
        <div>
          <div class="eyebrow">Creator economy</div>
          <h1>Exclusive content</h1>
          <p class="lead">Subscribe to creators for members-only posts, reels and downloads.</p>
        </div>
        <div class="page-head__actions">
          <button class="btn btn--primary btn--sm" data-new-exclusive>${N.ic('plus')}Create exclusive</button>
        </div>
      </div>

      <div class="feed-tabs" role="tablist">
        <button class="tab-btn ${tab==='discover'?'is-active':''}" data-tab="discover">Discover</button>
        <button class="tab-btn ${tab==='subs'?'is-active':''}" data-tab="subs">My subscriptions <span class="count">${subs.length}</span></button>
        <button class="tab-btn ${tab==='earnings'?'is-active':''}" data-tab="earnings">Earnings</button>
      </div>

      <div id="exContent">${tab==='discover'?discoverHTML():tab==='subs'?subsHTML():earningsHTML()}</div>
    </div>`;
    N.reveal();
    wire();
  }

  const style = document.createElement('style');
  style.textContent = `
    .ex-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
    .ex-card{border:1px solid var(--border);border-radius:14px;overflow:hidden;background:var(--surface);display:flex;flex-direction:column}
    .ex-card__media{position:relative;aspect-ratio:16/9;overflow:hidden}
    .ex-card__media .media{position:absolute;inset:0}
    .ex-card__scrim{position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(6,5,10,.85))}
    .ex-card__lock{position:absolute;inset:0;display:grid;place-items:center;gap:6px;color:rgba(var(--overlay-rgb),.85);font-size:11.5px;font-weight:600;z-index:2;backdrop-filter:blur(2px)}
    .ex-card__lock .icon{width:26px;height:26px}
    .ex-card__play{position:absolute;inset:0;display:grid;place-items:center;z-index:2}
    .ex-card__play span{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;background:rgba(var(--overlay-rgb),.15);backdrop-filter:blur(8px);border:1px solid rgba(var(--overlay-rgb),.2)}
    .ex-card__play .icon{width:18px;height:18px}
    .ex-card__top{position:absolute;top:8px;left:8px;right:8px;z-index:3;display:flex;justify-content:space-between}
    .ex-card__body{padding:12px 14px;display:flex;gap:10px}
    .ex-card__meta{min-width:0;flex:1}
    .ex-card__title{font-size:13px;font-weight:650;line-height:1.4}
    .ex-card__sub{font-size:10px;color:var(--faint);margin-top:2px;display:flex;align-items:center;gap:4px}
    .ex-card__sub .verified{width:11px;height:11px}
    .ex-card__desc{font-size:11px;color:var(--muted);margin-top:6px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
    .ex-card__foot{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:10px}
    .ex-card__price{font-size:12px;font-weight:650;color:var(--violet-soft)}
    .ex-card__price small{font-size:9.5px;color:var(--faint);font-weight:400;margin-left:3px}
    .sub-row{display:flex;align-items:center;gap:12px;padding:14px;border:1px solid var(--border);border-radius:14px;background:var(--surface);flex-wrap:wrap}
    .sub-row__meta{min-width:0;flex:1}
    .sub-row__name{font-size:13px;font-weight:650;display:flex;align-items:center;gap:4px;flex-wrap:wrap}
    .sub-row__sub{font-size:10.5px;color:var(--faint);margin-top:3px}
    .sub-row__perks{display:flex;gap:4px;flex-wrap:wrap;margin-top:6px}
    .sub-row__actions{display:flex;gap:6px;flex-shrink:0}
    .ex-row{display:flex;align-items:center;gap:10px;padding:9px;border-radius:10px;border:1px solid var(--border);background:rgba(var(--overlay-rgb),.02)}
    .ex-row__art{width:44px;height:32px;border-radius:6px;overflow:hidden;position:relative;flex-shrink:0}
    .ex-row__art .media{position:absolute;inset:0}
  `;
  document.head.appendChild(style);

  function subscribeSheet(creatorId) {
    const u = N.user(creatorId);
    N.openSheet({
      title:`Subscribe to ${u.name.split(' ')[0]}`,
      sub: u.handle,
      body:`<div style="display:flex;align-items:center;gap:12px;padding:12px;border-radius:12px;background:rgba(var(--overlay-rgb),.03);border:1px solid var(--border);margin-bottom:14px">
          ${N.av(creatorId, 44, 'av--hair')}
          <div><div style="font-size:13px;font-weight:600">${N.esc(u.name)}${u.verified?N.verified():''}</div><div style="font-size:10.5px;color:var(--faint)">${N.esc(u.role)}</div></div>
        </div>
        <div class="field"><label>Tier</label>
          <select class="select" id="subTier">
            <option value="5">Supporter — ৳5/mo</option>
            <option value="12" selected>Creator — ৳12/mo</option>
            <option value="28">Studio — ৳28/mo</option>
          </select></div>
        <div class="field"><label>Billing</label>
          <select class="select" id="subBill"><option>Monthly</option><option>Annual (save 17%)</option></select></div>
        <div class="banner" style="margin-top:8px">${N.ic('lock')}<span>You'll get instant access to all exclusive content from this creator.</span></div>`,
      foot:`<button class="btn btn--primary btn--block" data-confirm-sub>${N.ic('check')}Subscribe</button>`,
      onMount(s) {
        s.querySelector('[data-confirm-sub]').addEventListener('click', () => {
          const price = s.querySelector('#subTier').value;
          subs.unshift({ creator:creatorId, tier: s.querySelector('#subTier').selectedOptions[0].text.split('—')[0].trim(), price:+price, since:'Nov 2026', renewal:'12 Dec 2026', perks:['Members-only posts','Exclusive reels'] });
          // unlock posts by this creator
          posts.forEach(p => { if (p.creator === creatorId) p.locked = false; });
          N.closeSheet();
          tab = 'subs';
          render();
          N.toast(`Subscribed to ${u.name}`);
        });
      }
    });
  }

  function wire() {
    N.view.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => { tab = b.dataset.tab; render(); }));
    N.view.querySelectorAll('[data-subscribe]').forEach(b => b.addEventListener('click', () => subscribeSheet(b.dataset.subscribe)));
    N.view.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => N.toast('Opening exclusive content…')));
    N.view.querySelectorAll('[data-manage-sub]').forEach(b => b.addEventListener('click', () => N.toast('Managing subscription')));
    N.view.querySelectorAll('[data-cancel-sub]').forEach(b => b.addEventListener('click', () => {
      const c = b.dataset.cancelSub;
      N.confirmDialog({ title:'Cancel subscription?', message:'You will keep access until the end of the billing period.', confirmLabel:'Cancel', danger:true, onConfirm(){ const i = subs.findIndex(s=>s.creator===c); if(i>-1) subs.splice(i,1); render(); N.toast('Subscription cancelled'); } });
    }));
    N.view.querySelectorAll('[data-browse]').forEach(b => b.addEventListener('click', () => { tab='discover'; render(); }));
    N.view.querySelectorAll('[data-new-exclusive]').forEach(b => b.addEventListener('click', () => N.toast('Opening composer…')));
  }

  render();
});