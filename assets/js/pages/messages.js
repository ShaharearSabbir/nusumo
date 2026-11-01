/* Nusumo — Messages */
N.ready(function () {
  const D = N.D;
  const chats = D.chats.slice();
  let active = chats[0].id;
  let conversation = false;

  function chatItem(c) {
    const u = N.user(c.user);
    return `<button class="chat-item ${c.id === active ? 'is-active' : ''}" data-chat="${c.id}">
      ${N.av(u, 38, 'av--hair')}
      <div class="chat-item__meta">
        <div class="chat-item__name"><span>${N.esc(u.name)}${u.verified ? N.verified() : ''}</span><span class="chat-item__time">${c.time}</span></div>
        <div class="chat-item__last">${N.esc(c.last)}</div>
      </div>
      ${c.unread ? `<span class="chat-item__unread">${c.unread}</span>` : ''}
    </button>`;
  }

  function bubble(m) {
    const me = m.from === 'me';
    return `<div class="bubble-row ${me ? 'bubble-row--me' : ''}">
      ${me ? '' : N.av(activeUser(), 26, 'av--hair')}
      <div>
        <div class="bubble">${N.esc(m.text)}</div>
        <span class="bubble__time">${m.time}</span>
      </div>
    </div>`;
  }

  function activeChat() { return chats.find(c => c.id === active); }
  function activeUser() { return N.user(activeChat().user); }

  function render() {
    const ac = activeChat();
    const u = activeUser();
    N.view.innerHTML = `<div class="chat-layout ${conversation ? 'is-conversation' : ''}">
      <div class="chat-list">
        <div class="chat-list__head">
          <h2 style="font-size:15px;font-weight:650">Chats</h2>
          <div class="row" style="gap:6px;margin-top:10px">
            <input class="input" style="height:32px;font-size:11.5px" placeholder="Search messages" aria-label="Search messages">
            <button class="icon-btn" data-new aria-label="New message">${N.ic('plus')}</button>
          </div>
        </div>
        <div class="chat-list__scroll">${chats.map(chatItem).join('')}</div>
      </div>
      <div class="chat-main">
        <div class="chat-main__head">
          <button class="icon-btn" data-back aria-label="Back to list" style="display:none">${N.ic('chevronLeft')}</button>
          ${N.av(u, 32, 'av--hair')}
          <div style="min-width:0;flex:1">
            <div style="font-size:12.5px;font-weight:650;display:flex;align-items:center;gap:5px">${N.esc(u.name)}${u.verified ? N.verified() : ''}</div>
            <div style="font-size:10px;color:var(--faint)">${u.handle} · ${u.role}</div>
          </div>
          <button class="icon-btn" data-call aria-label="Call">${N.ic('video')}</button>
          <button class="icon-btn" data-info aria-label="Info">${N.ic('info')}</button>
        </div>
        <div class="chat-main__scroll" data-scroll>
          ${ac.messages.map(bubble).join('')}
          <div class="typing" style="margin-top:6px"><i></i><i></i><i></i></div>
        </div>
        <div class="chat-main__foot">
          <form class="chat-send" data-form>
            <button class="icon-btn" type="button" aria-label="Emoji">${N.ic('smile')}</button>
            <input class="input" name="msg" placeholder="Message ${u.name.split(' ')[0]}…" autocomplete="off" aria-label="Message">
            <button class="icon-btn icon-btn--send" type="submit" aria-label="Send">${N.ic('send')}</button>
          </form>
        </div>
      </div>
    </div>`;
    N.reveal();
    wire();
  }

  function wire() {
    N.view.querySelectorAll('[data-chat]').forEach(b => b.addEventListener('click', () => {
      active = b.dataset.chat;
      const c = chats.find(x => x.id === active);
      if (c) c.unread = 0;
      conversation = true;
      render();
    }));
    const back = N.view.querySelector('[data-back]');
    if (back) back.addEventListener('click', () => { conversation = false; render(); });
    const form = N.view.querySelector('[data-form]');
    if (form) form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      const val = input.value.trim();
      if (!val) return;
      input.value = '';
      const ac = activeChat();
      ac.messages.push({ from:'me', text:val, time: 'now' });
      ac.last = val;
      const sc = N.view.querySelector('[data-scroll]');
      if (sc) {
        sc.insertAdjacentHTML('beforeend', bubble({ from:'me', text:val, time:'now' }));
        sc.scrollTop = sc.scrollHeight;
      }
    });
    N.view.querySelectorAll('[data-new]').forEach(b => b.addEventListener('click', () => N.toast('New message')));
    N.view.querySelectorAll('[data-call]').forEach(b => b.addEventListener('click', () => N.toast('Calling…')));
    N.view.querySelectorAll('[data-info]').forEach(b => b.addEventListener('click', () => N.toast('Conversation info')));
  }

  // show back button on mobile only via CSS? toggle display
  const style = document.createElement('style');
  style.textContent = '@media (max-width:900px){ .chat-main__head [data-back]{display:grid !important} }';
  document.head.appendChild(style);

  render();
});