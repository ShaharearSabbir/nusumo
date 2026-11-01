/* Nusumo — Group chat */
N.ready(function () {
  const D = N.D;
  const channels = D.groupChats || [];
  let active = channels[0] ? channels[0].id : null;
  const messages = {};
  channels.forEach(c => {
    messages[c.id] = [
      { from: c.members[0], text: c.last, time: c.time, me:false },
      { from: 'me', text: 'On it — will share notes tonight.', time: 'now', me:true },
      { from: c.members[1] || c.members[0], text: 'Sounds good. Ping me if blocked.', time: 'now', me:false }
    ];
  });

  function channelRow(c) {
    return `<button class="chat-channel ${c.id===active?'is-active':''}" data-channel="${c.id}">
      <span class="chat-channel__art" style="background:${c.grad.includes('gradient')?c.grad:'var(--grad)'}">${N.ic('users')}</span>
      <span class="chat-channel__meta">
        <span class="chat-channel__name">${N.esc(c.name)}${c.unread?`<span class="nav-badge">${c.unread}</span>`:''}</span>
        <span class="chat-channel__last">${N.esc(c.last)}</span>
      </span>
      <span class="chat-channel__time">${c.time}</span>
    </button>`;
  }

  function renderMessages(id) {
    const list = messages[id] || [];
    return list.map(m => {
      const u = N.user(m.from);
      const mine = m.me || m.from === 'me';
      return `<div class="chat-msg ${mine?'is-mine':''}">
        ${mine ? '' : N.av(m.from, 28, 'av--hair')}
        <div class="chat-msg__bubble">
          ${mine ? '' : `<div class="chat-msg__who">${N.esc(u.name)}</div>`}
          <div class="chat-msg__text">${N.esc(m.text)}</div>
          <div class="chat-msg__time">${m.time}</div>
        </div>
      </div>`;
    }).join('');
  }

  function render() {
    const c = channels.find(x=>x.id===active);
    N.view.innerHTML = `<div class="page page--tight">
      <div class="chat-layout">
        <aside class="chat-side">
          <div class="page-head" style="margin-bottom:10px">
            <div>
              <div class="eyebrow">Channels</div>
              <h1 style="font-size:20px">Group chat</h1>
            </div>
            <button class="btn btn--primary btn--sm" data-new-channel>${N.ic('plus')}New</button>
          </div>
          <div class="chat-channel-list">${channels.map(channelRow).join('')}</div>
        </aside>
        <section class="chat-main">
          ${c ? `
          <div class="chat-main__head">
            <div class="chat-main__title">${N.esc(c.name)}</div>
            <div class="chat-main__sub">${c.members.length} members · ${c.members.map(m=>N.user(m).name.split(' ')[0]).join(', ')}</div>
            <div class="chat-main__actions">
              <button class="icon-btn" data-call aria-label="Start call">${N.ic('video')}</button>
              <button class="icon-btn" data-info aria-label="Info">${N.ic('info')}</button>
            </div>
          </div>
          <div class="chat-main__body" id="chatBody">${renderMessages(c.id)}</div>
          <div class="chat-main__foot">
            <div class="chat-input">
              <button class="icon-btn" aria-label="Emoji">${N.ic('smile')}</button>
              <input placeholder="Message ${N.esc(c.name)}…" id="chatInput" name="chatInput">
              <button class="send-btn" id="chatSend" aria-label="Send">${N.ic('send')}</button>
            </div>
          </div>` : `<div class="empty" style="padding:60px 12px"><div class="empty__icon">${N.ic('chat')}</div><p>Select a channel</p></div>`}
        </section>
      </div>
    </div>`;

    const body = document.getElementById('chatBody');
    if (body) body.scrollTop = body.scrollHeight;

    N.reveal();
    wire();
  }

  const style = document.createElement('style');
  style.textContent = `
    .chat-layout{display:grid;grid-template-columns:300px minmax(0,1fr);gap:18px;align-items:start;height:calc(100vh - 160px)}
    .chat-side{border:1px solid var(--border);border-radius:14px;background:var(--surface);padding:12px;display:flex;flex-direction:column;gap:8px;height:100%;overflow:hidden}
    .chat-channel-list{display:flex;flex-direction:column;gap:4px;overflow:auto;flex:1}
    .chat-channel{display:flex;align-items:center;gap:10px;padding:10px;border-radius:10px;border:1px solid transparent;background:transparent;text-align:left;width:100%;transition:background .16s,border-color .16s}
    .chat-channel:hover{background:rgba(var(--overlay-rgb),.04)}
    .chat-channel.is-active{background:rgba(166,120,255,.1);border-color:rgba(166,120,255,.28)}
    .chat-channel__art{width:34px;height:34px;border-radius:9px;display:grid;place-items:center;color:#fff;flex-shrink:0}
    .chat-channel__art .icon{width:16px;height:16px}
    .chat-channel__meta{min-width:0;flex:1;line-height:1.3}
    .chat-channel__name{display:flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600}
    .chat-channel__last{font-size:10.5px;color:var(--faint);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;margin-top:2px}
    .chat-channel__time{font-size:9.5px;color:var(--faint);flex-shrink:0}
    .chat-main{border:1px solid var(--border);border-radius:14px;background:var(--surface);display:flex;flex-direction:column;height:100%;overflow:hidden}
    .chat-main__head{padding:14px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px}
    .chat-main__title{font-size:13.5px;font-weight:650}
    .chat-main__sub{font-size:10.5px;color:var(--faint);margin-top:2px}
    .chat-main__actions{margin-left:auto;display:flex;gap:6px}
    .chat-main__body{flex:1;overflow:auto;padding:14px 16px;display:flex;flex-direction:column;gap:10px}
    .chat-msg{display:flex;align-items:flex-end;gap:8px}
    .chat-msg.is-mine{flex-direction:row-reverse}
    .chat-msg__bubble{max-width:70%;padding:9px 12px;border-radius:12px;background:rgba(var(--overlay-rgb),.05);border:1px solid var(--border);font-size:12.5px;line-height:1.5}
    .chat-msg.is-mine .chat-msg__bubble{background:var(--grad-soft);border-color:rgba(166,120,255,.3)}
    .chat-msg__who{font-size:10px;color:var(--violet-soft);font-weight:600;margin-bottom:3px}
    .chat-msg__text{color:#e9e4f0}
    .chat-msg__time{font-size:9px;color:var(--faint);margin-top:4px}
    .chat-main__foot{padding:10px 12px;border-top:1px solid var(--border)}
    .chat-input{display:flex;align-items:center;gap:6px}
    .chat-input input{flex:1;height:38px;border-radius:99px;border:1px solid var(--border);background:rgba(var(--overlay-rgb),.05);padding:0 14px;color:#fff;font-size:12.5px}
    .chat-input .send-btn{width:36px;height:36px;border-radius:50%;background:var(--grad);color:#180a26;display:grid;place-items:center}
    .chat-input .icon-btn{width:32px;height:32px}
  `;
  document.head.appendChild(style);

  function wire() {
    N.view.querySelectorAll('[data-channel]').forEach(b => b.addEventListener('click', () => { active = b.dataset.channel; const ch = channels.find(x=>x.id===active); if (ch) ch.unread = 0; render(); }));
    const sendBtn = N.view.querySelector('#chatSend');
    const input = N.view.querySelector('#chatInput');
    const send = () => {
      const v = input.value.trim();
      if (!v || !active) return;
      messages[active].push({ from:'me', text:v, time:'now', me:true });
      input.value = '';
      const body = document.getElementById('chatBody');
      body.innerHTML = renderMessages(active);
      body.scrollTop = body.scrollHeight;
    };
    if (sendBtn) sendBtn.addEventListener('click', send);
    if (input) input.addEventListener('keydown', e=>{ if(e.key==='Enter') send(); });
    const callBtn = N.view.querySelector('[data-call]');
    if (callBtn) callBtn.addEventListener('click', ()=>{ location.href = 'video-call.html'; });
    const newBtn = N.view.querySelector('[data-new-channel]');
    if (newBtn) newBtn.addEventListener('click', ()=>N.toast('New channel wizard coming soon'));
    const infoBtn = N.view.querySelector('[data-info]');
    if (infoBtn) infoBtn.addEventListener('click', ()=>N.toast('Channel info'));
  }

  render();
});