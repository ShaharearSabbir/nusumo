/* Nusumo — Settings */
N.ready(function () {
  const D = N.D;
  const me = D.users.me;

  function pref(key, fallback) {
    try { const v = localStorage.getItem('nusumo-pref-' + key); if (v === 'true') return true; if (v === 'false') return false; } catch(e){}
    return fallback;
  }
  const sections = [
    { title:'Account', rows:[
      { label:'Email', value:'mahfuza@nusumo.app', icon:'mail', action:'Change' },
      { label:'Password', value:'Last changed 42 days ago', icon:'lock', action:'Update' },
      { label:'Phone', value:'+880 1712 •••• 44', icon:'phone' in N.ic ? 'phone' : 'location', action:'Verify' }
    ]},
    { title:'Preferences', toggles:[
      { key:'notif', label:'Push notifications', sub:'New followers, likes and comments', on:pref('notif', true) },
      { key:'live', label:'Live alerts', sub:'When someone you follow goes live', on:pref('live', true) },
      { key:'email', label:'Email digest', sub:'Weekly summary every Monday', on:pref('email', false) },
      { key:'autoplay', label:'Autoplay reels', sub:'Play reels automatically as you scroll', on:pref('autoplay', true) },
      { key:'data', label:'Use less data', sub:'Lower quality media on mobile networks', on:pref('data', false) },
      { key:'theme', label:'Light theme', sub:'Switch between dark and light appearance', on:pref('theme', document.documentElement.classList.contains('light')) }
    ]},
    { title:'Privacy', toggles:[
      { key:'priv', label:'Private account', sub:'Only approved followers see your posts', on:pref('priv', false) },
      { key:'msg', label:'Allow messages from', sub:'Everyone · Followers · Nobody', on:pref('msg', true) },
      { key:'show', label:'Show activity status', sub:'Let others see when you’re online', on:pref('show', true) }
    ]}
  ];

  function rowHTML(r) {
    if (r.toggles) {
      return `<div class="switch-row">
        <div class="switch-row__text"><strong>${r.label}</strong><span>${r.sub}</span></div>
        <button class="switch" role="switch" aria-checked="${r.on}" data-toggle="${r.key}"></button>
      </div>`;
    }
    return `<div class="switch-row">
      <div class="switch-row__text"><strong>${r.label}</strong><span>${r.value}</span></div>
      <button class="btn btn--ghost btn--sm" data-action="${r.label}">${r.action}</button>
    </div>`;
  }

  N.view.innerHTML = `<div class="page">
    <div class="page-head">
      <div>
        <div class="eyebrow">Account</div>
        <h1>Settings</h1>
        <p class="lead">Manage your account, privacy and notifications.</p>
      </div>
    </div>
    <div class="profile-layout" style="grid-template-columns:minmax(0,1fr) 300px">
      <div class="profile-main">
        <div class="card" style="padding:0;margin-bottom:14px">
          <div style="display:flex;align-items:center;gap:12px;padding:16px;border-bottom:1px solid var(--border)">
            ${N.av(me.id, 52, 'av--hair')}
            <div style="flex:1;min-width:0">
              <div style="font-size:13.5px;font-weight:650">${N.esc(me.name)}</div>
              <div style="font-size:11px;color:var(--faint)">${me.handle} · ${me.role}</div>
            </div>
            <button class="btn btn--ghost btn--sm" data-edit>${N.ic('settings')}Edit</button>
          </div>
          ${sections.map(s => `
            <div style="padding:6px 16px 4px">
              <div style="font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--faint);font-weight:650;margin:10px 0 4px">${s.title}</div>
              ${s.rows ? s.rows.map(rowHTML).join('') : ''}
              ${s.toggles ? s.toggles.map(rowHTML).join('') : ''}
            </div>`).join('')}
        </div>
        <div class="card" style="padding:16px;border-color:rgba(255,84,112,.25)">
          <div style="font-size:12.5px;font-weight:650;color:#ff9dac;margin-bottom:6px">Danger zone</div>
          <div style="font-size:11.5px;color:var(--muted);margin-bottom:12px">These actions are permanent. Please be sure.</div>
          <div class="row--wrap" style="gap:8px">
            <button class="btn btn--ghost btn--sm" data-download>${N.ic('download')}Download my data</button>
            <button class="btn btn--ghost btn--sm" data-deactivate>Deactivate account</button>
            <button class="btn btn--danger btn--sm" data-delete>${N.ic('trash')}Delete account</button>
          </div>
        </div>
      </div>
      <aside class="profile-rail">
        <div class="card" style="padding:16px">
          <h3 style="font-size:12.5px;font-weight:650;margin-bottom:10px">Sessions</h3>
          <div style="font-size:11.5px;color:var(--muted);line-height:1.6">
            <div class="row" style="margin-bottom:6px">${N.ic('maximize')}Chrome · Linux · Dhaka (current)</div>
            <div class="row" style="margin-bottom:6px">${N.ic('maximize')}Safari · iOS · Dhaka</div>
            <div class="row">${N.ic('maximize')}Chrome · macOS · Berlin</div>
          </div>
          <button class="btn btn--ghost btn--sm" style="margin-top:10px;width:100%" data-logout-all>Log out all devices</button>
        </div>
        <div class="card" style="padding:16px">
          <h3 style="font-size:12.5px;font-weight:650;margin-bottom:10px">About Nusumo</h3>
          <div style="font-size:11.5px;color:var(--muted);line-height:1.6">
            Version 2.4.1 · Build 8842<br>© 2026 Nusumo Labs
          </div>
          <div class="row" style="gap:6px;margin-top:10px">
            <a href="#" style="color:var(--violet-soft);font-size:11px">Terms</a>
            <span class="dot-sep"></span>
            <a href="#" style="color:var(--violet-soft);font-size:11px">Privacy</a>
            <span class="dot-sep"></span>
            <a href="#" style="color:var(--violet-soft);font-size:11px">Help</a>
          </div>
        </div>
      </aside>
    </div>
  </div>`;
  N.reveal();
  wire();
});

function wire() {
  N.view.querySelectorAll('[data-toggle]').forEach(b => b.addEventListener('click', () => {
    const on = b.getAttribute('aria-checked') === 'true';
    const next = !on;
    b.setAttribute('aria-checked', String(next));
    try { localStorage.setItem('nusumo-pref-' + b.dataset.toggle, String(next)); } catch(e){}
    if (b.dataset.toggle === 'theme') {
      const html = document.documentElement;
      if (next) html.classList.add('light'); else html.classList.remove('light');
      try { localStorage.setItem('nusumo-theme', next ? 'light' : 'dark'); } catch(e){}
      N.toast(next ? 'Light mode' : 'Dark mode');
    }
  }));
  N.view.querySelectorAll('[data-action]').forEach(b => b.addEventListener('click', () => N.toast(b.dataset.action + ' — coming soon')));
  N.view.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => N.toast('Edit profile')));
  N.view.querySelectorAll('[data-download]').forEach(b => b.addEventListener('click', () => N.toast('Preparing your data export…')));
  N.view.querySelectorAll('[data-deactivate]').forEach(b => b.addEventListener('click', () => N.confirmDialog({ title:'Deactivate account?', message:'Your profile will be hidden until you sign back in.', confirmLabel:'Deactivate', danger:true, onConfirm(){ N.toast('Account deactivated'); } })));
  N.view.querySelectorAll('[data-delete]').forEach(b => b.addEventListener('click', () => N.confirmDialog({ title:'Delete account permanently?', message:'This cannot be undone. All your content and data will be removed.', confirmLabel:'Delete forever', danger:true, onConfirm(){ N.toast('Account deletion requested'); } })));
  N.view.querySelectorAll('[data-logout-all]').forEach(b => b.addEventListener('click', () => N.confirmDialog({ title:'Log out of all devices?', message:'You will need to sign in again everywhere.', confirmLabel:'Log out all', onConfirm(){ N.toast('Signed out everywhere'); } })));
}