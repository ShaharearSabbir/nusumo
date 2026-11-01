/* Nusumo — Memberships */
N.ready(function () {
  const D = N.D;
  let annual = false;
  const tiers = D.tiers;

  function card(t) {
    const price = annual ? t.annual : t.price;
    const period = annual ? '/yr' : '/mo';
    return `<article class="tier ${t.featured ? 'tier--featured' : ''} ${t.current ? 'is-current' : ''}">
      ${t.featured ? '<span class="tier__ribbon">Most popular</span>' : ''}
      <div class="tier__name">${N.esc(t.name)}</div>
      <div class="tier__price">${price}<small>${period}</small></div>
      <div style="font-size:10.5px;color:var(--faint)">${annual ? 'billed annually' : 'billed monthly'}</div>
      <ul class="tier__perks">${t.perks.map(p => `<li>${N.ic('check')}${N.esc(p)}</li>`).join('')}</ul>
      ${t.current
        ? `<button class="btn btn--ghost btn--block" data-manage="${t.id}">${N.ic('settings')}Manage</button>`
        : `<button class="btn ${t.featured ? 'btn--primary' : 'btn--ghost'} btn--block" data-join="${t.id}">${N.ic('plus')}Join ${N.esc(t.name)}</button>`}
    </article>`;
  }

  function render() {
    N.view.innerHTML = `<div class="page">
      <div class="page-head">
        <div>
          <div class="eyebrow">Support</div>
          <h1>Memberships</h1>
          <p class="lead">Support creators directly and unlock members-only content.</p>
        </div>
        <div class="page-head__actions">
          <div class="segmented" role="tablist" aria-label="Billing">
            <button class="${!annual ? 'is-active' : ''}" data-bill="monthly">Monthly</button>
            <button class="${annual ? 'is-active' : ''}" data-bill="annual">Annual <span style="font-size:9px;opacity:.7">−17%</span></button>
          </div>
        </div>
      </div>
      <div class="tier-grid">${tiers.map(card).join('')}</div>
      <div style="margin-top:22px;padding:16px;border:1px solid var(--border);border-radius:14px;background:var(--surface);display:flex;align-items:center;gap:14px;flex-wrap:wrap">
        <div style="flex:1;min-width:220px">
          <div style="font-size:12.5px;font-weight:600">Currently subscribed to <span style="color:var(--violet-soft)">Creator</span></div>
          <div style="font-size:10.5px;color:var(--faint);margin-top:3px">Next renewal: 12 Dec 2026 · ৳12.00/month</div>
        </div>
        <button class="btn btn--ghost btn--sm" data-cancel>${N.ic('x')}Cancel subscription</button>
      </div>
    </div>`;
    N.reveal();
    wire();
  }

  function wire() {
    N.view.querySelectorAll('[data-bill]').forEach(b => b.addEventListener('click', () => { annual = b.dataset.bill === 'annual'; render(); }));
    N.view.querySelectorAll('[data-join]').forEach(b => b.addEventListener('click', () => N.toast('Redirecting to checkout…')));
    N.view.querySelectorAll('[data-manage]').forEach(b => b.addEventListener('click', () => N.toast('Managing subscription')));
    N.view.querySelectorAll('[data-cancel]').forEach(b => b.addEventListener('click', () => N.confirmDialog({ title:'Cancel subscription?', message:'You will keep access until the end of your billing period.', confirmLabel:'Cancel', danger:true, onConfirm(){ N.toast('Subscription cancelled'); } })));
  }

  render();
});