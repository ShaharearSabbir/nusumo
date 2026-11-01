/* Nusumo — Watch live (viewer) */
N.ready(function () {
  const D = N.D;
  const id = N.Q.get('id');
  const s = D.liveStreams.find(x => x.id === id) || D.liveStreams.find(x => x.featured) || D.liveStreams[0];
  const u = N.user(s.user);
  const co = s.cohost ? N.user(s.cohost) : null;

  let following = !!u.following;
  let playing = true;
  let muted = false;
  let liked = false;
  let viewers = s.viewers;

  const GIFT = { name:'Fireworks', glyph:'🎆' };

  const seed = [
    { u:'nusrat', t:'this transition is unreal 🙌', time:'42:02' },
    { u:'farah', t:'what resonance are you running on that ladder filter?', role:'Host', time:'42:19' },
    { u:'milo', t:'sounds like velvet', time:'42:31' },
    { gift:true, u:'samira', t:'sent a <b>Fireworks</b> gift', time:'42:38' },
    { u:'zeeshan', t:'sending this to my whole team, they need to hear it', time:'42:44' },
    { u:'ayesha', t:'the restraint in the second half is the whole point', role:'Mod', time:'43:01' },
    { u:'devon', t:'any chance of a patch breakdown after?', time:'43:12' },
    { u:'kavita', t:'@devon he usually posts notes the next morning', time:'43:20' },
    { u:'marcus', t:'🔥🔥', time:'43:26' },
    { u:'nadia', t:'joined from Lisbon, 1am here, worth it', time:'43:34' }
  ];
  const chat = seed.slice();

  const pinned = 'Be kind. No spoilers. Ask before posting links.';

  /* ------------------------------- chat ------------------------------- */
  function msgHTML(m) {
    if (m.gift) {
      const gu = N.user(m.u);
      return `<div class="msg msg--gift">${N.ic('gift')}<span><b>${N.esc(gu.name)}</b> ${m.t}</span></div>`;
    }
    if (m.system) return `<div class="msg msg--system">${m.system}</div>`;
    const mu = N.user(m.u);
    return `<div class="msg">
      ${N.av(mu, 24, 'av--hair')}
      <div class="msg__body">
        <span class="msg__name">${N.esc(mu.name)}${mu.verified ? N.verified() : ''}
          ${m.role ? `<span class="msg__role ${m.role === 'Host' ? 'msg__role--host' : m.role === 'Mod' ? 'msg__role--mod' : ''}">${m.role}</span>` : ''}
          <span class="msg__time">${m.time || 'now'}</span>
        </span>
        <div>${m.t}</div>
      </div>
    </div>`;
  }

  const chatBody = (limit) => {
    const list = limit ? chat.slice(-limit) : chat;
    return `<div class="msg-pinned">${N.ic('pin')}<span>${pinned}</span></div>${list.map(msgHTML).join('')}`;
  };

  /* ------------------------------- player ------------------------------- */
  function playerHTML() {
    return `<div class="player" data-player>
      ${N.media(s.grad)}
      <span class="scrim-b" style="opacity:.5"></span>
      <div class="player__top">
        <div class="row" style="gap:7px">
          <span class="live-badge live-badge--solid"><i class="live-dot"></i>Live</span>
          <span class="badge" style="background:rgba(6,5,10,.55);backdrop-filter:blur(8px)">${s.elapsed}</span>
        </div>
        <div class="row" style="gap:6px">
          <span class="player__viewers">${N.ic('eye')}<span data-viewers>${N.fmt(viewers)}</span></span>
          <button class="icon-btn" data-watch-menu aria-label="Stream options">${N.ic('more')}</button>
        </div>
      </div>
      <button class="player__hint" data-toggle-play aria-label="Play or pause">
        <span class="pulse-ring">${N.ic('pause')}</span>
      </button>
      <span class="watch-paused">${N.ic('pause')}Paused</span>
      <div class="player__controls">
        <div class="player__scrub" data-scrub><i style="width:62%"></i></div>
        <div class="player__controlrow">
          <button class="icon-btn" data-toggle-play aria-label="Play or pause">${N.ic('pause')}</button>
          <button class="icon-btn" data-mute aria-label="Mute">${N.ic('volume')}</button>
          <span class="player__quality">Auto</span>
          <span class="spacer"></span>
          <button class="icon-btn" data-like aria-label="Send a heart">${N.ic('heart')}</button>
          <button class="icon-btn" data-share aria-label="Share stream">${N.ic('share')}</button>
          <button class="icon-btn" data-fullscreen aria-label="Full screen">${N.ic('maximize')}</button>
        </div>
      </div>
    </div>`;
  }

  function hostRow() {
    return `<div class="watch-host">
      ${N.av(u, 44, 'av--ring')}
      <div class="watch-host__meta">
        <div class="watch-host__name">${N.esc(u.name)}${u.verified ? N.verified() : ''}</div>
        <div class="watch-host__sub">${N.esc(u.role)} · ${u.followers} followers${co ? ' · with ' + N.esc(co.name) : ''}</div>
      </div>
      <div class="watch-host__actions">
        <button class="btn ${following ? 'btn--ghost' : 'btn--primary'} btn--sm" data-follow>${following ? 'Following' : 'Follow'}</button>
        ${s.user !== 'me' ? `<a class="btn btn--pk btn--sm" href="pk-battle.html?mode=video&opponent=${s.user}">${N.ic('swords')}PK</a>` : ''}
        <button class="icon-btn" data-share aria-label="Share">${N.ic('share')}</button>
        <button class="icon-btn" data-host-menu aria-label="More options">${N.ic('more')}</button>
      </div>
    </div>`;
  }

  function infoHTML() {
    return `<div class="watch-info">
      <h1 class="watch-title">${N.esc(s.title)}</h1>
      <div class="watch-chips">
        <span class="live-badge"><i class="live-dot"></i>Live</span>
        <span class="chip chip--sm">${N.esc(s.category)}</span>
        <span class="badge">${N.ic('eye')}${s.viewersLabel} watching</span>
        <span class="badge">${N.ic('clock')}${s.elapsed}</span>
        ${s.ending ? `<span class="badge badge--warn">${N.ic('clock')}Ending soon</span>` : ''}
      </div>
      ${hostRow()}
      <div class="watch-desc" data-desc>
        <p>Live from the studio — ${N.esc(s.title)}. Say hi in the chat and drop your questions, ${N.esc(u.name.split(' ')[0])} answers them as the set moves along. Headphones recommended.</p>
        <button data-desc-toggle>Show more</button>
      </div>
    </div>`;
  }

  function moreLive() {
    const list = D.liveStreams.filter(x => x.id !== s.id).slice(0, 3);
    return `<div class="section-head" style="margin:18px 0 10px">
        <h2>More live now</h2>
        <a class="link" href="live.html">See all${N.ic('chevronRight')}</a>
      </div>
      <div class="more-live">
        ${list.map(x => `<a class="more-live__card" href="watch.html?id=${x.id}">
          ${N.media(x.grad)}
          <span class="more-live__views">${N.ic('eye')}${x.viewersLabel}</span>
          <span class="more-live__label">${N.esc(x.title)}</span>
        </a>`).join('')}
      </div>`;
  }

  function chatPanelHTML() {
    return `<div class="chat-panel">
      <div class="chat-panel__head">
        <h3>Live chat</h3>
        <span class="badge" style="height:20px;font-size:9.5px">${s.viewersLabel}</span>
        <span class="spacer"></span>
        <button class="icon-btn" data-gift aria-label="Send a gift">${N.ic('gift')}</button>
      </div>
      <div class="chat-panel__scroll" data-chat-scroll>${chatBody()}</div>
      <div class="chat-panel__foot">
        <form class="chat-send" data-chat-form>
          <input class="input" name="chatMessage" placeholder="Say something nice…" autocomplete="off" aria-label="Chat message">
          <button class="icon-btn icon-btn--send" type="submit" aria-label="Send message">${N.ic('send')}</button>
        </form>
        <div class="chat-panel__rules">People are kinder when they remember there's a person here. <a href="#">Rules</a></div>
      </div>
    </div>`;
  }

  N.view.innerHTML = `<div class="page page--tight watch-desktop">
    <div class="watch-layout">
      <div class="watch-main">
        ${playerHTML()}
        ${infoHTML()}
        ${moreLive()}
      </div>
      <aside class="watch-side">${chatPanelHTML()}</aside>
    </div>
  </div>

  <div class="watch-mobile" data-watch-mobile>
    <div class="watch-mobile__stage">
      <div class="watch-mobile__video">
        ${N.media(s.grad)}
        <span class="scrim-b"></span>
      </div>
      <div class="watch-mobile__top">
        <button class="icon-btn" data-back aria-label="Back">${N.ic('chevronLeft')}</button>
        <div class="center">
          <span class="live-badge live-badge--solid"><i class="live-dot"></i>Live</span>
          <span class="badge">${N.ic('eye')}<span data-viewers>${N.fmt(viewers)}</span></span>
        </div>
        <button class="icon-btn" data-watch-menu aria-label="Stream options">${N.ic('more')}</button>
      </div>
      <span class="watch-mobile__hint" data-toggle-play>${N.ic('pause')}</span>
      <div class="watch-mobile__actions">
        <div class="watch-mobile__av">
          ${N.av(u, 38, 'av--live')}
          ${following ? '' : `<button class="watch-mobile__follow" data-follow aria-label="Follow ${N.esc(u.name)}">${N.ic('plus')}</button>`}
        </div>
        <button class="reel-action" data-like aria-label="Send a heart">
          <span class="reel-action__btn">${N.ic('heart')}</span>
          <span class="reel-action__label" data-like-count>${s.viewersLabel}</span>
        </button>
        <button class="reel-action" data-gift aria-label="Send a gift">
          <span class="reel-action__btn">${N.ic('gift')}</span>
          <span class="reel-action__label">Gift</span>
        </button>
        <button class="reel-action" data-share aria-label="Share">
          <span class="reel-action__btn">${N.ic('share')}</span>
          <span class="reel-action__label">Share</span>
        </button>
        <button class="reel-action" data-open-chat aria-label="Open chat">
          <span class="reel-action__btn">${N.ic('chat')}</span>
          <span class="reel-action__label">Chat</span>
        </button>
      </div>
      <div class="watch-mobile__meta">
        <div class="row" style="gap:7px">
          ${N.av(u, 26, 'av--hair')}
          <b style="font-size:11.5px;font-weight:600">${N.esc(u.name)}</b>
          ${u.verified ? N.verified() : ''}
          <span class="badge" style="height:19px;font-size:9px">${N.esc(s.category)}</span>
        </div>
        <div class="watch-mobile__title">${N.esc(s.title)}</div>
      </div>
    </div>
    <div class="watch-mobile__chat">
      <div class="chat-peek" data-open-chat>
        <div class="chat-peek__line"><b>${N.esc(N.user(chat[chat.length - 2].u).name)}</b>${chat[chat.length - 2].t}</div>
        <div class="chat-peek__line"><b>${N.esc(N.user(chat[chat.length - 1].u).name)}</b>${chat[chat.length - 1].t}</div>
      </div>
      <div class="chat-inputbar">
        <button class="icon-btn" data-gift aria-label="Send a gift">${N.ic('gift')}</button>
        <button class="chat-inputbar__field" data-open-chat style="text-align:left">Say something nice…</button>
        <button class="icon-btn" data-like aria-label="Send a heart">${N.ic('heart')}</button>
        <button class="icon-btn" data-share aria-label="Share">${N.ic('share')}</button>
      </div>
    </div>
  </div>`;

  N.reveal();

  /* ------------------------------- behaviour ------------------------------- */
  const playerEl = N.view.querySelector('[data-player]');
  const mobileStage = N.view.querySelector('.watch-mobile__stage');
  if (mobileStage) {
    mobileStage.addEventListener('click', (e) => {
      if (e.target.closest('button') || e.target.closest('.watch-mobile__meta')) return;
      playing = !playing;
      syncPlayState();
    });
  }

  function syncPlayState() {
    if (playerEl) {
      playerEl.classList.toggle('is-paused', !playing);
      playerEl.querySelectorAll('[data-toggle-play]').forEach(b => {
        if (b.classList.contains('player__hint')) b.querySelector('.pulse-ring').innerHTML = N.ic(playing ? 'pause' : 'play');
        else b.innerHTML = N.ic(playing ? 'pause' : 'play');
      });
    }
    const m = document.querySelector('[data-watch-mobile]');
    if (m) {
      m.classList.toggle('is-paused', !playing);
      const hint = m.querySelector('.watch-mobile__hint');
      if (hint) hint.innerHTML = N.ic(playing ? 'pause' : 'play');
    }
  }

  function bumpViewers(n) {
    viewers += n;
    N.view.querySelectorAll('[data-viewers]').forEach(el => { el.textContent = N.fmt(viewers); });
  }

  function heartBurst(host, x, y) {
    const span = document.createElement('span');
    span.className = 'heart-burst';
    span.style.left = (x || 50) + '%';
    span.style.top = (y || 55) + '%';
    span.innerHTML = N.ic('heart');
    (host || document.body).appendChild(span);
    setTimeout(() => span.remove(), 1000);
  }

  function scrollChat() {
    const sc = N.view.querySelector('[data-chat-scroll]');
    if (sc) sc.scrollTop = sc.scrollHeight;
  }

  function addMessage(text) {
    chat.push({ u:'me', t:N.esc(text), time:N.ts() });
    const sc = N.view.querySelector('[data-chat-scroll]');
    if (sc) {
      sc.insertAdjacentHTML('beforeend', msgHTML(chat[chat.length - 1]));
      sc.scrollTop = sc.scrollHeight;
    }
    const peek = N.view.querySelector('.chat-peek');
    if (peek) {
      peek.innerHTML = `<div class="chat-peek__line"><b>${D.me.name}</b>${N.esc(text)}</div>` + peek.innerHTML.split('</div>')[0] + '</div>';
    }
  }

  function giftSheet() {
    const gifts = [
      { g:'🎆', n:'Fireworks', p:'120' }, { g:'💜', n:'Violet heart', p:'40' }, { g:'🎧', n:'Headphones', p:'90' },
      { g:'🔥', n:'Hype', p:'25' }, { g:'🌟', n:'Star', p:'60' }, { g:'☕', n:'Coffee', p:'15' }
    ];
    N.openSheet({
      title:'Send support',
      sub:'Gifts show up in the chat and on stream',
      body:`<div class="gift-grid">${gifts.map((x, i) => `<button class="gift ${i === 0 ? 'is-active' : ''}" data-gift-pick="${x.n}">
          <span class="gift__glyph">${x.g}</span><span>${x.n}</span><span class="gift__price">${x.p} coins</span>
        </button>`).join('')}</div>
        <div class="field" style="margin:14px 0 0"><label for="giftNote">Add a note (optional)</label>
          <input class="input" id="giftNote" name="giftNote" placeholder="This set is unreal"></div>`,
      foot:`<button class="btn btn--primary btn--block" data-gift-send>${N.ic('gift')}Send gift · 120 coins</button>`,
      onMount(sheet) {
        let chosen = gifts[0];
        sheet.addEventListener('click', (e) => {
          const pick = e.target.closest('[data-gift-pick]');
          if (pick) {
            chosen = gifts.find(g => g.n === pick.dataset.giftPick);
            sheet.querySelectorAll('[data-gift-pick]').forEach(b => b.classList.toggle('is-active', b === pick));
            const send = sheet.querySelector('[data-gift-send]');
            send.innerHTML = `${N.ic('gift')}Send gift · ${chosen.p} coins`;
          }
        });
        sheet.querySelector('[data-gift-send]').addEventListener('click', () => {
          N.closeSheet();
          chat.push({ gift:true, u:'me', t:`sent a <b>${chosen.n}</b> gift ${chosen.g}` });
          const sc = N.view.querySelector('[data-chat-scroll]');
          if (sc) { sc.insertAdjacentHTML('beforeend', msgHTML(chat[chat.length - 1])); scrollChat(); }
          heartBurst(document.body, 50, 40);
          N.toast(`${chosen.n} sent to ${u.name.split(' ')[0]}`);
        });
      }
    });
  }

  function shareSheet() {
    const url = location.origin + '/watch/' + s.id;
    N.openSheet({
      title:'Share this stream',
      sub:N.esc(u.name) + ' is live right now',
      body:`<div class="gift-grid" style="grid-template-columns:repeat(3,1fr)">
          ${[['link','Copy link'],['chat','Send in chat'],['mail','Email'],['globe','Post'],['bookmark','Save'],['flag','Report']]
            .map(([ic, label]) => `<button class="gift" data-share-to="${label}"><span class="gift__glyph">${N.ic(ic)}</span><span>${label}</span></button>`).join('')}
        </div>`,
      foot:`<div class="row" style="gap:6px"><span class="input" style="flex:1;height:36px;display:flex;align-items:center;font-size:11px;color:var(--faint)">${N.esc(url.replace('http://',''))}</span>
        <button class="btn btn--primary" data-copy>${N.ic('copy')}Copy</button></div>`,
      onMount(sheet) {
        sheet.querySelector('[data-copy]').addEventListener('click', () => { N.copy(url); });
        sheet.querySelectorAll('[data-share-to]').forEach(b => b.addEventListener('click', () => {
          if (b.dataset.shareTo === 'Report') { N.closeSheet(); reportSheet(); return; }
          N.closeSheet(); N.toast('Shared — nice pick');
        }));
      }
    });
  }

  function reportSheet() {
    N.confirmDialog({
      title:'Report this stream?',
      message:'Our moderation team reviews reports within 24 hours. The creator will not know who reported.',
      confirmLabel:'Report', danger:true,
      onConfirm() { N.toast('Report submitted'); }
    });
  }

  function watchMenu(anchor) {
    N.openMenu(anchor, [
      { icon:'link', label:'Copy stream link', onClick() { N.copy(location.origin + '/watch/' + s.id); } },
      { icon:'maximize', label:'Picture in picture', onClick() { N.toast('Picture in picture is not available in this preview'); } },
      { icon:'bell', label:'Notify me when ' + u.name.split(' ')[0] + ' goes live', onClick() { N.toast('You will be notified next time'); } },
      { icon:'swords', label:'Challenge ' + u.name.split(' ')[0] + ' to PK', onClick() { location.href = 'pk-battle.html?mode=video&opponent=' + s.user; } },
      { sep:true },
      { icon:'ban', label:'Not interested', onClick() { N.toast('We will show fewer streams like this'); } },
      { icon:'flag', label:'Report stream', danger:true, onClick() { reportSheet(); } }
    ]);
  }

  function hostMenu(anchor) {
    N.openMenu(anchor, [
      { icon:'user', label:'View profile', onClick() { location.href = 'profile.html'; } },
      { icon:'bell', label:'Turn on live alerts', onClick() { N.toast('Live alerts on for ' + u.name); } },
      { icon:'share', label:'Share stream', onClick() { shareSheet(); } },
      { icon:'swords', label:'Challenge to PK', onClick() { location.href = 'pk-battle.html?mode=video&opponent=' + s.user; } },
      { sep:true },
      { icon:'ban', label:'Block ' + u.name.split(' ')[0], danger:true, onClick() { N.toast('Blocked — you will not see their streams'); } }
    ]);
  }

  function followAll() {
    following = !following;
    N.view.querySelectorAll('[data-follow]').forEach(b => {
      if (b.classList.contains('watch-mobile__follow')) {
        b.remove();
      } else {
        b.textContent = following ? 'Following' : 'Follow';
        b.classList.toggle('btn--primary', !following);
        b.classList.toggle('btn--ghost', following);
      }
    });
    N.toast(following ? 'Following ' + u.name : 'Unfollowed ' + u.name);
  }

  function openChatSheet() {
    N.openSheet({
      tall:true,
      title:'Live chat',
      sub:s.viewersLabel + ' people watching',
      body:`<div class="chat-panel__scroll" data-chat-scroll style="height:46vh;padding:0">${chatBody()}</div>`,
      foot:`<form class="chat-send" data-chat-form>
        <input class="input" name="chatMessage" placeholder="Say something nice…" autocomplete="off" aria-label="Chat message">
        <button class="icon-btn icon-btn--send" type="submit" aria-label="Send message">${N.ic('send')}</button></form>`,
      onMount(sheet) {
        const sc = sheet.querySelector('[data-chat-scroll]');
        sc.scrollTop = sc.scrollHeight;
        sheet.querySelector('[data-chat-form]').addEventListener('submit', (e) => {
          e.preventDefault();
          const input = sheet.querySelector('input');
          const val = input.value.trim();
          if (!val) return;
          input.value = '';
          chat.push({ u:'me', t:N.esc(val), time:N.ts() });
          sc.insertAdjacentHTML('beforeend', msgHTML(chat[chat.length - 1]));
          sc.scrollTop = sc.scrollHeight;
        });
      }
    });
  }

  N.view.addEventListener('click', (e) => {
    if (e.target.closest('[data-back]')) { history.length > 1 ? history.back() : location.href = 'live.html'; return; }

    if (e.target.closest('[data-toggle-play]')) { playing = !playing; syncPlayState(); return; }

    if (e.target.closest('[data-mute]')) {
      muted = !muted;
      const b = e.target.closest('[data-mute]');
      b.innerHTML = N.ic(muted ? 'volumeOff' : 'volume');
      b.setAttribute('aria-label', muted ? 'Unmute' : 'Mute');
      N.toast(muted ? 'Muted' : 'Sound on');
      return;
    }

    if (e.target.closest('[data-like]')) {
      liked = !liked;
      // burst inside whichever stage is actually on screen
      const mob = document.querySelector('.watch-mobile');
      const host = (mob && mob.offsetParent !== null && mob.getBoundingClientRect().height > 0)
        ? mob.querySelector('.watch-mobile__stage')
        : playerEl;
      heartBurst(host, 62 + Math.random() * 20, 60 + Math.random() * 25);
      bumpViewers(liked ? 1 : 0);
      const lbl = N.view.querySelector('[data-like-count]');
      if (lbl) lbl.textContent = N.fmt(viewers);
      if (liked) N.toast('Heart sent');
      return;
    }

    if (e.target.closest('[data-follow]')) { followAll(); return; }
    if (e.target.closest('[data-gift]')) { giftSheet(); return; }
    if (e.target.closest('[data-share]')) { shareSheet(); return; }
    if (e.target.closest('[data-open-chat]')) { openChatSheet(); return; }

    const wm = e.target.closest('[data-watch-menu]');
    if (wm) { watchMenu(wm); return; }
    const hm = e.target.closest('[data-host-menu]');
    if (hm) { hostMenu(hm); return; }

    if (e.target.closest('[data-desc-toggle]')) {
      const d = e.target.closest('[data-desc]');
      d.classList.toggle('is-open');
      e.target.closest('[data-desc-toggle]').textContent = d.classList.contains('is-open') ? 'Show less' : 'Show more';
      return;
    }

    if (e.target.closest('[data-fullscreen]')) {
      if (!document.fullscreenElement) playerEl.requestFullscreen && playerEl.requestFullscreen();
      else document.exitFullscreen();
      return;
    }
  });

  N.view.addEventListener('submit', (e) => {
    const form = e.target.closest('[data-chat-form]');
    if (!form) return;
    e.preventDefault();
    const input = form.querySelector('input');
    const val = input.value.trim();
    if (!val) { input.focus(); return; }
    input.value = '';
    addMessage(val);
  });

  // viewer count drifts a little, like a real stream
  setInterval(() => {
    const delta = Math.random() > .55 ? 1 : -1;
    bumpViewers(delta);
    const lbl = N.view.querySelector('[data-like-count]');
    if (lbl) lbl.textContent = N.fmt(viewers);
  }, 9000);

  // ambient chat: shuffle-bag so a line never repeats back to back
  const ambient = [
    ['sadia', 'this is exactly what I needed tonight'],
    ['zack', 'sending love from Dhaka'],
    ['elena', 'the low end on this is so warm'],
    ['lamia', 'saved for later, cannot wait for the recap'],
    ['tariq', 'the room tone alone is worth the ticket'],
    ['sora', 'how long have you been using this patch?'],
    ['milo', 'chills at 42 minutes, no notes'],
    ['nadia', 'watching from Berlin, headphones on max']
  ];
  let bag = [];

  setInterval(() => {
    if (!bag.length) {
      bag = ambient.slice();
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
    }
    const pick = bag.pop();
    chat.push({ u:pick[0], t:pick[1], time:N.ts().replace(/\s?(AM|PM)/i, '') });
    const sc = N.view.querySelector('[data-chat-scroll]');
    if (sc) {
      sc.insertAdjacentHTML('beforeend', msgHTML(chat[chat.length - 1]));
      if (sc.scrollHeight - sc.scrollTop - sc.clientHeight < 200) sc.scrollTop = sc.scrollHeight;
    }
  }, 11000);

  scrollChat();
  syncPlayState();
});
