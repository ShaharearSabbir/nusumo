/* Nusumo — Story viewer page */
N.ready(function () {
  const D = N.D;
  const stories = D.stories || [];
  const Q = N.Q;
  let idx = Math.max(0, stories.findIndex(s => s.id === Q.get('id')));
  if (idx < 0) idx = 0;
  let itemIndex = 0;

  const appHost = document.getElementById('app');
  // Replace shell with immersive viewer by clearing view? ui.js already rendered shell. We'll hide shell chrome.
  document.body.classList.add('immersive');

  function current() { return stories[idx] || stories[0]; }

  function render() {
    const s = current();
    if (!s) { N.view.innerHTML = '<div class="empty" style="padding:60px"><p>No stories</p></div>'; return; }
    const u = N.user(s.user);
    s.viewed = true;
    itemIndex = 0;
    N.view.innerHTML = `<div class="story-page">
      <div class="story-page__bar">${Array.from({length:s.items}).map((_,i)=>`<div class="story-page__seg ${i===0?'is-active':''}" data-seg="${i}"><i></i></div>`).join('')}</div>
      <div class="story-page__head">
        <a href="stories.html" class="icon-btn" style="color:#fff" aria-label="Back">${N.ic('arrowLeft')}</a>
        ${N.av(s.user, 36, 'av--hair')}
        <div style="min-width:0;flex:1">
          <div style="font-size:13px;font-weight:600">${N.esc(u.name)}${u.verified?N.verified():''}</div>
          <div style="font-size:10.5px;color:rgba(var(--overlay-rgb),.6)">${s.time} · ${s.items} item${s.items>1?'s':''}</div>
        </div>
        <button class="icon-btn" style="color:#fff" data-menu>${N.ic('more')}</button>
      </div>
      <div class="story-page__media">
        ${N.media(s.grad)}
        <span class="story-page__caption">“${N.esc(u.name.split(' ')[0])}’s story — item ${itemIndex+1} of ${s.items}”</span>
      </div>
      <button class="story-page__nav story-page__nav--prev" data-prev>${N.ic('chevronLeft')}</button>
      <button class="story-page__nav story-page__nav--next" data-next>${N.ic('chevronRight')}</button>
      <div class="story-page__reply">
        <button class="icon-btn" style="color:#fff">${N.ic('heart')}</button>
        <input id="storyReply" name="storyReply" placeholder="Reply to ${N.esc(u.name.split(' ')[0])}…" data-reply>
        <button class="send-btn" data-send>${N.ic('send')}</button>
      </div>
      <div class="story-page__thumbs">
        ${stories.map((st,i)=>`<button class="story-thumb ${i===idx?'is-active':''}" data-goto="${i}" style="background:${st.viewed?'rgba(var(--overlay-rgb),.1)':'linear-gradient(135deg,#a678ff,#ff6ad5)'}">${N.av(st.user, 26, 'av--hair')}</button>`).join('')}
      </div>
    </div>`;
    N.reveal();
    wire();
  }

  const style = document.createElement('style');
  style.textContent = `
    .story-page{position:fixed;inset:0;background:#000;display:flex;flex-direction:column;z-index:60}
    .story-page__bar{display:flex;gap:4px;padding:10px 14px}
    .story-page__seg{flex:1;height:3px;border-radius:2px;background:rgba(var(--overlay-rgb),.25);overflow:hidden}
    .story-page__seg i{display:block;height:100%;width:0;background:#fff}
    .story-page__seg.is-active i{width:60%;transition:width .3s linear}
    .story-page__seg.is-done i{width:100%}
    .story-page__head{display:flex;align-items:center;gap:10px;padding:6px 14px 10px}
    .story-page__media{flex:1;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center}
    .story-page__media .media{position:absolute;inset:0}
    .story-page__caption{position:relative;z-index:2;color:rgba(var(--overlay-rgb),.9);font-size:14px;font-weight:600;text-align:center;padding:20px;max-width:80%}
    .story-page__nav{position:absolute;top:50%;transform:translateY(-50%);width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:rgba(0,0,0,.4);color:#fff;border:1px solid rgba(var(--overlay-rgb),.16);z-index:5}
    .story-page__nav--prev{left:12px}
    .story-page__nav--next{right:12px}
    .story-page__reply{display:flex;align-items:center;gap:8px;padding:10px 14px calc(12px + env(safe-area-inset-bottom));background:linear-gradient(180deg,transparent,rgba(0,0,0,.6))}
    .story-page__reply input{flex:1;height:40px;border-radius:99px;border:1px solid rgba(var(--overlay-rgb),.16);background:rgba(var(--overlay-rgb),.08);padding:0 14px;color:#fff;font-size:12.5px}
    .story-page__reply .send-btn{width:40px;height:40px;border-radius:50%;background:var(--grad);color:#180a26;display:grid;place-items:center}
    .story-page__thumbs{display:flex;gap:6px;padding:8px 14px;overflow-x:auto;background:rgba(0,0,0,.4)}
    .story-thumb{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;padding:2px;border:2px solid transparent;flex-shrink:0;cursor:pointer}
    .story-thumb.is-active{border-color:#fff}
  `;
  document.head.appendChild(style);

  // hide shell chrome
  const sidebar = document.querySelector('.sidebar'); if (sidebar) sidebar.style.display = 'none';
  const topbar = document.querySelector('.topbar'); if (topbar) topbar.style.display = 'none';
  const mobileBar = document.querySelector('.mobile-bar'); if (mobileBar) mobileBar.style.display = 'none';
  const tabbar = document.querySelector('.tabbar'); if (tabbar) tabbar.style.display = 'none';

  function wire() {
    const s = current();
    const prev = N.view.querySelector('[data-prev]');
    const next = N.view.querySelector('[data-next]');
    if (prev) prev.addEventListener('click', () => { if (idx > 0) { idx--; render(); } });
    if (next) next.addEventListener('click', () => { if (idx < stories.length - 1) { idx++; render(); } else { location.href = 'stories.html'; } });
    N.view.querySelectorAll('[data-goto]').forEach(b => b.addEventListener('click', () => { idx = +b.dataset.goto; render(); }));
    const reply = N.view.querySelector('[data-reply]');
    const send = N.view.querySelector('[data-send]');
    if (send && reply) send.addEventListener('click', () => { const v = reply.value.trim(); if (v) { N.toast('Reply sent'); reply.value = ''; } });
    if (reply) reply.addEventListener('keydown', e => { if (e.key === 'Enter') { const v = reply.value.trim(); if (v) { N.toast('Reply sent'); reply.value = ''; } } });
    const menu = N.view.querySelector('[data-menu]');
    if (menu) menu.addEventListener('click', () => N.openMenu(menu, [
      { icon:'bookmark', label:'Save story', onClick(){ N.toast('Saved'); } },
      { icon:'link', label:'Copy link', onClick(){ N.copy(location.origin + '/story.html?id=' + s.id); } },
      { icon:'ban', label:'Hide', onClick(){ N.toast('Hidden'); } },
      { sep:true },
      { icon:'flag', label:'Report', danger:true, onClick(){ N.toast('Reported'); } }
    ]));
  }

  render();
});