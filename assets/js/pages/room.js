/* Nusumo — Audio room (inside) */
N.ready(function () {
  const D = N.D;
  const id = N.Q.get('id');
  const room = D.rooms.find(x => x.id === id) || D.rooms[0];
  const host = N.user(room.user);
  const role = N.Q.get('host') ? 'host' : (N.Q.get('role') === 'listener' ? 'listener' : 'speaker');

  const speakers = room.speakers.slice();
  // ensure current user present for host/speaker demo
  if (role === 'host' && !speakers.includes('me')) speakers.unshift('me');
  if (role === 'speaker' && !speakers.includes('me')) speakers.splice(1, 0, 'me');

  let micOn = role !== 'listener';
  let handRaised = false;
  let mutedSelf = false;
  let tab = 'chat';
  const mutedSpeakers = new Set(); // host-moderated mutes
  const reactions = ['💜','🔥','👏','🎧','✨','😂'];

  const chat = [
    { u: room.speakers[0], t: 'welcome in everyone, glad you are here', time:'00:02' },
    { u: room.speakers[1] || 'milo', t: 'the kick on this track is insane', time:'00:11' },
    { u: 'me', t: 'can we talk about the sidechain on the bass?', time:'00:24' },
    { u: room.speakers[2] || 'kavita', t: 'yes! dropping the patch notes after', time:'00:31' }
  ];
  const people = speakers.concat(D.liveStreams.slice(0, 4).map(s => s.user)).filter((v, i, a) => a.indexOf(v) === i);
  const requests = ['zack','elena','sadia','tariq'].slice(0, 3);

  function seatHTML(uid, isHost) {
    const u = N.user(uid);
    const isMe = uid === 'me';
    const isMuted = isMe ? mutedSelf : mutedSpeakers.has(uid);
    const speaking = isHost || uid === room.speakers[1];
    const cls = ['seat', isMuted ? 'is-muted' : '', speaking ? 'is-speaking' : ''].join(' ');
    const badge = handRaised && isMe
      ? `<span class="seat__badge seat__badge--hand">${N.ic('hand')}</span>`
      : isMuted
        ? `<span class="seat__badge seat__badge--mic">${N.ic('micOff')}</span>`
        : '';
    const avSize = isHost ? 72 : 60;
    const ringCls = isHost ? 'av--speak' : 'av--hair';
    const muteBtn = (role === 'host' && !isMe && uid !== (host.id || host))
      ? `<button class="seat__mute ${isMuted ? 'is-muted' : ''}" data-mute-speaker="${uid}" aria-label="${isMuted ? 'Unmute' : 'Mute'} ${N.esc(u.name)}" style="position:absolute;right:-4px;top:-4px;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:rgba(10,8,16,.85);border:1px solid rgba(var(--overlay-rgb),.16);color:#fff;z-index:3">${N.ic(isMuted ? 'micOff' : 'mic')}</button>`
      : '';
    return `<div class="${cls}" data-seat="${uid}">
      <div class="seat__art">
        ${N.av(uid, avSize, ringCls)}
        ${badge}
        ${muteBtn}
      </div>
      <div class="seat__name">${N.esc(u.name.split(' ')[0])}${isMe ? ' (you)' : ''}</div>
      <div class="seat__role">${isHost ? 'Host' : (isMe && role === 'listener' ? 'Listener' : 'Speaker')}</div>
    </div>`;
  }

  function emptySeat() {
    return `<div class="seat seat__empty">
      <div class="seat__art">${N.ic('plus')}</div>
      <div class="seat__name" style="color:var(--faint)">Open seat</div>
      <div class="seat__role">Invite</div>
    </div>`;
  }

  function hostStage() {
    return `<div class="stage__host">
      ${N.av(host.id || host, 84, 'av--speak')}
      <div class="stage__hostname">${N.esc(host.name)}${host.verified ? N.verified() : ''}</div>
      <div class="stage__hostsub">
        <span class="live-badge"><i class="live-dot"></i>Live room</span>
        <span class="dot-sep"></span><span>${room.elapsed || '00:00'} elapsed</span>
        <span class="dot-sep"></span><span>${N.esc(room.category)}</span>
      </div>
    </div>`;
  }

  const emptyCount = Math.max(0, 8 - speakers.length);

  function stageHTML() {
    return `<div class="stage" data-stage>
      ${hostStage()}
      <div class="stage__speakers">
        ${speakers.map(uid => seatHTML(uid, uid === (host.id || host))).join('')}
        ${Array.from({length: emptyCount}, emptySeat).join('')}
      </div>
      <div class="stage__audience">
        <div class="av-stack" style="--s:26px">
          ${people.slice(0, 5).map(uid => N.av(uid, 26, 'av--hair')).join('')}
        </div>
        <div class="sub">${N.fmt(room.listeners)} listeners · ${people.length} here</div>
        <a class="link" href="#" data-audience>${N.ic('users')}View all</a>
      </div>
      <div class="reaction-layer" data-reactions></div>
    </div>`;
  }

  function headerHTML() {
    return `<div class="room-header">
      <div style="min-width:0;flex:1">
        <div class="room-header__title">${N.esc(room.title)} <span class="live-badge"><i class="live-dot"></i>Live</span></div>
        <div class="room-header__sub">
          ${N.av(host.id || host, 18, 'av--hair')}
          <span>${N.esc(host.name)}</span>${host.verified ? N.verified() : ''}
          <span class="dot-sep"></span><span>${N.esc(room.category)}</span>
          <span class="dot-sep"></span><span class="row" style="gap:4px">${N.ic('users')}${N.fmt(room.listeners)}</span>
        </div>
      </div>
      <div class="room-header__actions">
        <a class="btn btn--pk btn--sm" href="pk-battle.html?mode=audio&opponent=${room.user}">${N.ic('swords')}PK</a>
        <button class="icon-btn" data-share aria-label="Share room">${N.ic('share')}</button>
        <button class="icon-btn" data-report aria-label="Report">${N.ic('flag')}</button>
        <button class="btn btn--ghost btn--sm" data-leave>${N.ic('arrowLeft')}Leave</button>
      </div>
    </div>`;
  }

  function dockHTML() {
    const canSpeak = role !== 'listener';
    return `<div class="dock">
      ${role === 'host' ? `<button class="dock__btn" data-mute-all aria-label="Mute all speakers">
        ${N.ic('micOff')}<span>Mute all</span>
      </button>` : ''}
      <button class="dock__btn ${micOn ? 'is-on' : ''}" data-mic ${canSpeak ? '' : 'disabled'} aria-label="Microphone">
        ${N.ic(micOn ? 'mic' : 'micOff')}<span>${micOn ? 'Mute' : 'Muted'}</span>
      </button>
      <button class="dock__btn ${handRaised ? 'is-on' : ''}" data-hand aria-label="Raise hand">
        ${N.ic('hand')}<span>Raise</span>
      </button>
      <button class="dock__btn" data-react aria-label="React">
        ${N.ic('smile')}<span>React</span>
      </button>
      <div class="dock__sep"></div>
      <button class="dock__btn" data-chat-toggle aria-label="Chat">
        ${N.ic('chat')}<span>Chat</span>
      </button>
      <button class="dock__btn" data-people-toggle aria-label="People">
        ${N.ic('users')}<span>People</span>
      </button>
      <div class="dock__sep"></div>
      <button class="dock__btn dock__btn--leave" data-leave aria-label="Leave room">
        ${N.ic('x')}<span>Leave</span>
      </button>
    </div>`;
  }

  function chatPanel() {
    return `<div class="chat-panel__scroll" data-chat-scroll style="height:320px;padding:0 0 6px">
      ${chat.map(m => {
        const mu = N.user(m.u);
        return `<div class="msg">
          ${N.av(mu, 22, 'av--hair')}
          <div class="msg__body">
            <span class="msg__name">${N.esc(mu.name)}${mu.verified ? N.verified() : ''}
              <span class="msg__time">${m.time}</span></span>
            <div>${m.t}</div>
          </div>
        </div>`;
      }).join('')}
    </div>
    <form class="chat-send" data-chat-form style="margin-top:10px">
      <input class="input" name="roomMsg" placeholder="Say something…" autocomplete="off" aria-label="Message">
      <button class="icon-btn icon-btn--send" type="submit" aria-label="Send">${N.ic('send')}</button>
    </form>`;
  }

  function peoplePanel() {
    return `<div style="max-height:360px;overflow:auto">
      <div style="font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--faint);font-weight:650;margin-bottom:6px">Speakers · ${speakers.length}</div>
      ${speakers.map(uid => {
        const u = N.user(uid);
        return `<div class="people-row">
          ${N.av(uid, 28, 'av--hair')}
          <div class="meta"><b>${N.esc(u.name)}${u.verified ? N.verified() : ''}</b><span>${u.handle} · ${uid === (host.id || host) ? 'Host' : 'Speaker'}</span></div>
          ${role === 'host' && uid !== (host.id || host) ? `<button class="icon-btn" style="width:26px;height:26px" data-mod-user="${uid}" aria-label="Moderate">${N.ic('more')}</button>` : ''}
        </div>`;
      }).join('')}
      <div style="font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--faint);font-weight:650;margin:14px 0 6px">Listeners · ${people.length}</div>
      ${people.map(uid => {
        const u = N.user(uid);
        return `<div class="people-row">
          ${N.av(uid, 28, 'av--hair')}
          <div class="meta"><b>${N.esc(u.name)}</b><span>${u.handle}</span></div>
        </div>`;
      }).join('')}
    </div>`;
  }

  function requestsPanel() {
    if (role !== 'host') {
      return `<div style="text-align:center;padding:40px 12px;color:var(--faint);font-size:12px">
        ${N.ic('info')}<div style="margin-top:8px">Only the host can see speaker requests.</div></div>`;
    }
    if (!requests.length) {
      return `<div style="text-align:center;padding:40px 12px;color:var(--faint);font-size:12px">
        ${N.ic('check')}<div style="margin-top:8px">No pending requests.</div></div>`;
    }
    return `<div>${requests.map(uid => {
      const u = N.user(uid);
      return `<div class="request">
        ${N.av(uid, 32, 'av--hair')}
        <div class="meta"><b>${N.esc(u.name)}</b><span>wants to speak</span></div>
        <div class="actions">
          <button class="btn btn--primary btn--sm" data-approve="${uid}">${N.ic('check')}Approve</button>
          <button class="btn btn--ghost btn--sm" data-decline="${uid}">${N.ic('x')}</button>
        </div>
      </div>`;
    }).join('')}</div>`;
  }

  function rightPanel() {
    return `<div class="chat-panel" style="height:100%">
      <div class="chat-panel__head">
        <div class="studio-tabs" style="border:0;margin:0;flex:1">
          <button class="studio-tab ${tab === 'chat' ? 'is-active' : ''}" data-rtab="chat">Chat</button>
          <button class="studio-tab ${tab === 'people' ? 'is-active' : ''}" data-rtab="people">People</button>
          <button class="studio-tab ${tab === 'requests' ? 'is-active' : ''}" data-rtab="requests">Requests${requests.length ? ` <span class="count">${requests.length}</span>` : ''}</button>
        </div>
      </div>
      <div style="padding:10px 14px 14px;flex:1;overflow:hidden;display:flex;flex-direction:column">
        ${tab === 'chat' ? chatPanel() : tab === 'people' ? peoplePanel() : requestsPanel()}
      </div>
    </div>`;
  }

  N.view.innerHTML = `<div class="page page--tight">
    ${headerHTML()}
    <div class="room-layout" style="margin-top:12px">
      <div class="room-main">
        ${stageHTML()}
        ${dockHTML()}
        <div class="studio-note" style="margin-top:12px">${N.ic('info')}Tap a speaker avatar to moderate. Raise your hand to request the floor.</div>
      </div>
      <aside>${rightPanel()}</aside>
    </div>
  </div>`;

  N.reveal();

  function floatReaction(emoji) {
    const layer = N.view.querySelector('[data-reactions]');
    if (!layer) return;
    const span = document.createElement('span');
    span.className = 'float-reaction';
    span.textContent = emoji;
    span.style.left = (10 + Math.random() * 80) + '%';
    layer.appendChild(span);
    setTimeout(() => span.remove(), 2400);
  }

  function rerenderStage() {
    const stage = N.view.querySelector('.stage');
    if (stage) stage.outerHTML = stageHTML();
    const dock = N.view.querySelector('.dock');
    if (dock) dock.outerHTML = dockHTML();
    wireDock();
  }

  function wireDock() {
    N.view.querySelectorAll('[data-mute-all]').forEach(b => b.addEventListener('click', () => {
      speakers.forEach(uid => { if (uid !== (host.id || host)) mutedSpeakers.add(uid); });
      N.toast('All speakers muted');
      rerenderStage();
    }));
    N.view.querySelectorAll('[data-mic]').forEach(b => b.addEventListener('click', () => {
      if (role === 'listener') { N.toast('Listeners cannot unmute — raise your hand'); return; }
      mutedSelf = !mutedSelf; micOn = !mutedSelf;
      N.toast(micOn ? 'Microphone on' : 'Microphone muted');
      rerenderStage();
    }));
    N.view.querySelectorAll('[data-hand]').forEach(b => b.addEventListener('click', () => {
      handRaised = !handRaised;
      N.toast(handRaised ? 'Hand raised' : 'Hand lowered');
      rerenderStage();
      if (handRaised && role === 'listener') {
        // add to requests if not already
        if (!requests.includes('me')) requests.push('me');
      }
    }));
    N.view.querySelectorAll('[data-react]').forEach(b => b.addEventListener('click', (e) => {
      // show mini picker
      const picker = document.createElement('div');
      picker.style.cssText = 'position:absolute;bottom:70px;left:50%;transform:translateX(-50%);display:flex;gap:4px;padding:6px;border-radius:99px;background:rgba(10,8,16,.85);border:1px solid rgba(var(--overlay-rgb),.14);backdrop-filter:blur(12px);z-index:20';
      reactions.forEach(em => {
        const btn = document.createElement('button');
        btn.textContent = em;
        btn.style.cssText = 'width:34px;height:34px;border-radius:50%;font-size:17px;background:transparent';
        btn.addEventListener('click', () => { floatReaction(em); picker.remove(); });
        picker.appendChild(btn);
      });
      const stage = N.view.querySelector('.stage');
      stage.appendChild(picker);
      setTimeout(() => picker.remove(), 4000);
    }));
    N.view.querySelectorAll('[data-chat-toggle]').forEach(b => b.addEventListener('click', () => { tab = 'chat'; rerenderPanel(); }));
    N.view.querySelectorAll('[data-people-toggle]').forEach(b => b.addEventListener('click', () => { tab = 'people'; rerenderPanel(); }));
    N.view.querySelectorAll('[data-leave]').forEach(b => b.addEventListener('click', () => {
      N.confirmDialog({ title:'Leave this room?', message:'You can rejoin any time.', confirmLabel:'Leave', onConfirm() { location.href = 'audio-rooms.html'; } });
    }));
  }

  function rerenderPanel() {
    const aside = N.view.querySelector('aside');
    if (aside) aside.innerHTML = rightPanel();
    wirePanel();
  }

  function wirePanel() {
    N.view.querySelectorAll('[data-rtab]').forEach(b => b.addEventListener('click', () => { tab = b.dataset.rtab; rerenderPanel(); }));
    const form = N.view.querySelector('[data-chat-form]');
    if (form) form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      const val = input.value.trim();
      if (!val) { input.focus(); return; }
      input.value = '';
      chat.push({ u:'me', t:N.esc(val), time: 'now' });
      const sc = N.view.querySelector('[data-chat-scroll]');
      if (sc) { sc.insertAdjacentHTML('beforeend', `<div class="msg">${N.av('me',22,'av--hair')}<div class="msg__body"><span class="msg__name">${N.esc(D.users.me.name)}<span class="msg__time">now</span></span><div>${N.esc(val)}</div></div></div>`); if (sc.scrollHeight - sc.scrollTop - sc.clientHeight < 120) sc.scrollTop = sc.scrollHeight; }
    });
    N.view.querySelectorAll('[data-mod-user]').forEach(b => b.addEventListener('click', (e) => {
      N.openMenu(e.currentTarget, [
        { icon:'shield', label:'Make speaker', onClick(){ N.toast('Promoted'); } },
        { icon:'micOff', label:'Mute', onClick(){ N.toast('Muted'); } },
        { icon:'ban', label:'Remove from room', danger:true, onClick(){ N.toast('Removed'); } }
      ]);
    }));
    N.view.querySelectorAll('[data-approve]').forEach(b => b.addEventListener('click', () => {
      const uid = b.dataset.approve;
      requests.splice(requests.indexOf(uid), 1);
      if (!speakers.includes(uid)) speakers.push(uid);
      N.toast(N.user(uid).name.split(' ')[0] + ' is now a speaker');
      rerenderPanel();
      rerenderStage();
    }));
    N.view.querySelectorAll('[data-decline]').forEach(b => b.addEventListener('click', () => {
      const uid = b.dataset.decline;
      requests.splice(requests.indexOf(uid), 1);
      N.toast('Request declined');
      rerenderPanel();
    }));
    N.view.querySelectorAll('[data-audience]').forEach(b => b.addEventListener('click', (e) => { e.preventDefault(); N.toast('Audience list coming soon'); }));
  }

  // wire seats for long-press/moderation (host only)
  function wireSeats() {
    N.view.querySelectorAll('[data-mute-speaker]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const uid = btn.dataset.muteSpeaker;
        if (mutedSpeakers.has(uid)) {
          mutedSpeakers.delete(uid);
          N.toast('Unmuted ' + N.user(uid).name.split(' ')[0]);
        } else {
          mutedSpeakers.add(uid);
          N.toast('Muted ' + N.user(uid).name.split(' ')[0]);
        }
        rerenderStage();
      });
    });
    N.view.querySelectorAll('[data-seat]').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('[data-mute-speaker]')) return;
        if (role !== 'host') return;
        const uid = el.dataset.seat;
        if (uid === (host.id || host)) return;
        N.openMenu(el, [
          { icon:'micOff', label:'Mute', onClick(){ mutedSpeakers.add(uid); rerenderStage(); N.toast('Muted ' + N.user(uid).name); } },
          { icon:'mic', label:'Unmute', onClick(){ mutedSpeakers.delete(uid); rerenderStage(); N.toast('Unmuted ' + N.user(uid).name); } },
          { icon:'chevronDown', label:'Move to audience', onClick(){ N.toast('Moved to audience'); } },
          { icon:'ban', label:'Remove', danger:true, onClick(){ N.toast('Removed'); } }
        ]);
      });
    });
  }

  // initial wiring
  wireDock();
  wirePanel();
  wireSeats();

  // floating reactions from chat? none
  // host menu for seats re-wire after stage rerender
  const origRerenderStage = rerenderStage;
  rerenderStage = function() {
    origRerenderStage();
    wireSeats();
  };

  // share/report
  N.view.querySelectorAll('[data-share]').forEach(b => b.addEventListener('click', () => {
    N.openSheet({ title:'Share room', sub:room.title, body:`<div class="gift-grid">${[['link','Copy link'],['chat','Send in chat'],['mail','Email']].map(([ic,l])=>`<button class="gift" data-share-to="${l}"><span class="gift__glyph">${N.ic(ic)}</span><span>${l}</span></button>`).join('')}</div>`, foot:`<button class="btn btn--primary btn--block" data-copy>Copy link</button>`, onMount(s){ s.querySelector('[data-copy]').addEventListener('click',()=>N.copy(location.origin+'/room/'+room.id)); s.querySelectorAll('[data-share-to]').forEach(x=>x.addEventListener('click',()=>{N.closeSheet();N.toast('Shared');})); } });
  }));
  N.view.querySelectorAll('[data-report]').forEach(b => b.addEventListener('click', () => {
    N.confirmDialog({ title:'Report this room?', message:'Our team reviews reports within 24 hours.', confirmLabel:'Report', danger:true, onConfirm(){ N.toast('Report submitted'); } });
  }));

  // react picker close on outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.float-reaction') && !e.target.closest('[data-react]') && !e.target.closest('button') ) {}
  });
});