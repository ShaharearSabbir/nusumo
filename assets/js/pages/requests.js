/* Nusumo — Exclusive content requests */
N.ready(function () {
  const D = N.D;
  const requests = D.contentRequests || [];
  let filter = 'all';

  const statusLabel = { pending:'Pending', accepted:'Accepted', delivered:'Delivered', declined:'Declined' };
  const statusClass = { pending:'badge--amber', accepted:'badge--violet', delivered:'badge--ok', declined:'badge--danger' };

  function statusBadge(s) {
    return `<span class="badge ${statusClass[s]||'badge--violet'}">${statusLabel[s]||s}</span>`;
  }

  function card(r) {
    const from = N.user(r.from === 'me' ? 'me' : r.from);
    const to = N.user(r.to);
    const mine = r.from === 'me';
    return `<article class="req-card reveal">
      <div class="req-card__head">
        ${N.av(r.from === 'me' ? 'me' : r.from, 34, 'av--hair')}
        <div class="req-card__meta">
          <div class="req-card__title">${N.esc(r.title)}</div>
          <div class="req-card__sub">${mine ? 'You requested from ' + N.esc(to.name) : N.esc(from.name) + ' requested from you'} · ${r.time}</div>
        </div>
        ${statusBadge(r.status)}
      </div>
      <div class="req-card__desc">${N.esc(r.desc)}</div>
      <div class="req-card__foot">
        <div class="req-card__price">৳${r.price}<small> · ${mine?'you pay':'you earn'}</small></div>
        <div class="req-card__actions">
          ${r.status === 'pending' && !mine ? `
            <button class="btn btn--ghost btn--sm" data-decline="${r.id}">${N.ic('x')}Decline</button>
            <button class="btn btn--primary btn--sm" data-accept="${r.id}">${N.ic('check')}Accept</button>` : ''}
          ${r.status === 'accepted' && !mine ? `<button class="btn btn--primary btn--sm" data-deliver="${r.id}">${N.ic('send')}Deliver</button>` : ''}
          ${r.status === 'delivered' ? `<button class="btn btn--ghost btn--sm" data-view="${r.id}">${N.ic('eye')}View delivery</button>` : ''}
          ${mine && r.status === 'pending' ? `<button class="btn btn--ghost btn--sm" data-cancel="${r.id}">${N.ic('x')}Cancel</button>` : ''}
          ${mine && r.status === 'delivered' ? `<button class="btn btn--primary btn--sm" data-review="${r.id}">${N.ic('check')}Review & pay</button>` : ''}
        </div>
      </div>
    </article>`;
  }

  function visible() {
    if (filter === 'incoming') return requests.filter(r => r.to === 'me' || r.to !== 'me' && r.from !== 'me'); // all incoming to creators? mock: treat to me? none; show those where current user is creator? We'll just show all for demo with filter by from
    // Simpler: incoming = not mine
    if (filter === 'incoming') return requests.filter(r => r.from !== 'me');
    if (filter === 'outgoing') return requests.filter(r => r.from === 'me');
    if (filter === 'pending') return requests.filter(r => r.status === 'pending');
    return requests;
  }

  function render() {
    const list = visible();
    N.view.innerHTML = `<div class="page">
      <div class="page-head">
        <div>
          <div class="eyebrow">Creator economy</div>
          <h1>Exclusive requests</h1>
          <p class="lead">Commission one-of-a-kind content from your favourite creators.</p>
        </div>
        <div class="page-head__actions">
          <button class="btn btn--primary btn--sm" data-new-request>${N.ic('plus')}New request</button>
        </div>
      </div>

      <div class="filters">
        <div class="filters__chips">
          ${[['all','All'],['incoming','Incoming'],['outgoing','Outgoing'],['pending','Pending']].map(([k,l]) =>
            `<button class="chip ${filter===k?'is-active':''}" data-filter="${k}">${l}</button>`).join('')}
        </div>
      </div>

      <div class="req-list">${list.length ? list.map(card).join('') : `<div class="card empty" style="padding:40px 12px;text-align:center"><div class="empty__icon">${N.ic('gift')}</div><h3>No requests here</h3><p>Commission exclusive content and it will show up.</p><div class="empty__actions" style="margin-top:12px"><button class="btn btn--primary btn--sm" data-new-request>${N.ic('plus')}New request</button></div></div>`}</div>

      <section class="card" style="padding:16px;margin-top:22px">
        <h3 style="font-size:12.5px;font-weight:650;margin-bottom:10px">How it works</h3>
        <div class="req-steps">
          <div class="req-step"><span class="req-step__n">1</span><div><b>Pick a creator</b><span>Choose who you want exclusive content from.</span></div></div>
          <div class="req-step"><span class="req-step__n">2</span><div><b>Describe &amp; offer</b><span>Detail what you want and your budget.</span></div></div>
          <div class="req-step"><span class="req-step__n">3</span><div><b>Creator delivers</b><span>Private link, delivered to your inbox.</span></div></div>
        </div>
      </section>
    </div>`;

    N.reveal();
    wire();
  }

  const style = document.createElement('style');
  style.textContent = `
    .req-list{display:flex;flex-direction:column;gap:12px}
    .req-card{border:1px solid var(--border);border-radius:14px;background:var(--surface);padding:14px;display:flex;flex-direction:column;gap:10px}
    .req-card__head{display:flex;align-items:center;gap:10px}
    .req-card__meta{min-width:0;flex:1}
    .req-card__title{font-size:13px;font-weight:650}
    .req-card__sub{font-size:10.5px;color:var(--faint);margin-top:2px}
    .req-card__desc{font-size:12px;color:var(--muted);line-height:1.6;padding:10px;border-radius:10px;background:rgba(var(--overlay-rgb),.025);border:1px solid var(--border)}
    .req-card__foot{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
    .req-card__price{font-size:12.5px;font-weight:650;color:var(--violet-soft)}
    .req-card__price small{font-size:10px;color:var(--faint);font-weight:400}
    .req-card__actions{display:flex;gap:6px;flex-wrap:wrap}
    .req-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
    .req-step{display:flex;gap:10px;align-items:flex-start}
    .req-step__n{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:var(--grad);color:#180a26;font-size:11px;font-weight:700;flex-shrink:0}
    .req-step div{display:flex;flex-direction:column;gap:2px;font-size:11.5px;color:var(--muted);line-height:1.5}
    .req-step div b{color:#fff;font-size:12px}
    .badge--ok{background:rgba(84,211,155,.12);border-color:rgba(84,211,155,.25);color:#8ce4bd}
    .badge--danger{background:rgba(255,84,112,.12);border-color:rgba(255,84,112,.25);color:#ff8ea1}
    .badge--amber{background:rgba(255,179,92,.12);border-color:rgba(255,179,92,.25);color:#ffc98a}
  `;
  document.head.appendChild(style);

  function newRequestSheet() {
    const creators = ['ayesha','rafi','farah','kavita','zeeshan','nusrat'].map(id=>N.user(id));
    N.openSheet({
      tall:true,
      title:'New exclusive request',
      sub:'Commission one-of-a-kind content',
      body:`<div class="field"><label>Creator</label>
          <select class="select" id="rqCreator">${creators.map(c=>`<option value="${c.id}">${N.esc(c.name)} · ${N.esc(c.role)}</option>`).join('')}</select></div>
        <div class="field"><label>Title</label><input class="input" id="rqTitle" placeholder="e.g. Custom ambient patch walkthrough"></div>
        <div class="field"><label>Describe what you want</label><textarea class="textarea" id="rqDesc" rows="4" placeholder="Be specific about format, length and references…"></textarea></div>
        <div class="field"><label>Your budget (৳)</label><input class="input" id="rqPrice" type="number" value="50"></div>
        <div class="field"><label>Deadline</label><input class="input" id="rqDue" type="date"></div>`,
      foot:`<button class="btn btn--primary btn--block" data-submit-request>${N.ic('send')}Send request</button>`,
      onMount(s) {
        s.querySelector('[data-submit-request]').addEventListener('click', () => {
          const title = s.querySelector('#rqTitle').value.trim();
          const desc = s.querySelector('#rqDesc').value.trim();
          if (!title || !desc) { N.toast('Fill in title and description'); return; }
          const to = s.querySelector('#rqCreator').value;
          requests.unshift({ id:'cr'+Date.now(), from:'me', to, title, desc, price:+s.querySelector('#rqPrice').value||50, status:'pending', time:'just now', grad:'violet' });
          N.closeSheet();
          filter = 'outgoing';
          render();
          N.toast('Request sent');
        });
      }
    });
  }

  function wire() {
    N.view.querySelectorAll('[data-filter]').forEach(b => b.addEventListener('click', () => { filter = b.dataset.filter; render(); }));
    N.view.querySelectorAll('[data-new-request]').forEach(b => b.addEventListener('click', newRequestSheet));
    N.view.querySelectorAll('[data-accept]').forEach(b => b.addEventListener('click', () => { const r = requests.find(x=>x.id===b.dataset.accept); if(r){ r.status='accepted'; render(); N.toast('Request accepted'); } }));
    N.view.querySelectorAll('[data-decline]').forEach(b => b.addEventListener('click', () => { const r = requests.find(x=>x.id===b.dataset.decline); if(r){ r.status='declined'; render(); N.toast('Request declined'); } }));
    N.view.querySelectorAll('[data-deliver]').forEach(b => b.addEventListener('click', () => { const r = requests.find(x=>x.id===b.dataset.deliver); if(r){ r.status='delivered'; render(); N.toast('Delivered'); } }));
    N.view.querySelectorAll('[data-cancel]').forEach(b => b.addEventListener('click', () => { const r = requests.find(x=>x.id===b.dataset.cancel); if(r){ requests.splice(requests.indexOf(r),1); render(); N.toast('Cancelled'); } }));
    N.view.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => N.toast('Opening delivery…')));
    N.view.querySelectorAll('[data-review]').forEach(b => b.addEventListener('click', () => N.toast('Review submitted')));
  }

  render();
});