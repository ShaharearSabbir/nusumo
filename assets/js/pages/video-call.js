/* Nusumo — Video call */
N.ready(function () {
  const D = N.D;
  const peers = [
    { user:'ayesha', grad:'sunset', speaking:true },
    { user:'rafi', grad:'violet', muted:true },
    { user:'kavita', grad:'ocean', muted:false },
    { user:'me', grad:D.me.grad, me:true }
  ];
  let muted = false, camOff = false, sharing = false, chatOpen = false, duration = 0;
  let timer = null;

  function tile(p, big) {
    return `<div class="vc-tile ${big?'vc-tile--big':''} ${p.speaking?'is-speaking':''} ${p.muted?'is-muted':''}">
      <div class="vc-tile__media">${N.media(p.grad)}${p.camOff?`<div class="vc-tile__off">${N.ic('video')}<span>Camera off</span></div>`:''}</div>
      <div class="vc-tile__name">${N.av(p.user, 22, 'av--hair')}<span>${N.esc(N.user(p.user).name.split(' ')[0])}${p.me?' (you)':''}</span>${p.muted?N.ic('micOff'):''}</div>
      ${p.speaking?'<span class="vc-tile__speak"></span>':''}
    </div>`;
  }

  function render() {
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
      duration++;
      const el = document.getElementById('vcDuration');
      if (el) el.textContent = fmtDur(duration);
    }, 1000);

    N.view.innerHTML = `<div class="page page--tight">
      <div class="vc-layout">
        <div class="vc-stage">
          <div class="vc-stage__head">
            <div class="vc-stage__title">Design critique crew — weekly sync</div>
            <div class="vc-stage__meta">
              <span class="live-badge" style="height:18px;font-size:9px"><i class="live-dot"></i>Live</span>
              <span class="dot-sep"></span>
              <span id="vcDuration">${fmtDur(duration)}</span>
              <span class="dot-sep"></span>
              <span>${peers.length} participants</span>
            </div>
            <div class="vc-stage__actions">
              <button class="icon-btn" data-invite aria-label="Invite">${N.ic('plus')}</button>
              <button class="icon-btn" data-record aria-label="Record">${N.ic('live')}</button>
            </div>
          </div>
          <div class="vc-grid">${peers.map(p=>tile({...p, camOff: p.me?camOff:p.camOff}, false)).join('')}</div>
          <div class="vc-dock">
            <button class="vc-dock__btn ${muted?'is-off':''}" data-mute>${muted?N.ic('micOff'):N.ic('mic')}<span>${muted?'Unmute':'Mute'}</span></button>
            <button class="vc-dock__btn ${camOff?'is-off':''}" data-cam>${camOff?N.ic('video'):N.ic('camera')}<span>${camOff?'Start cam':'Stop cam'}</span></button>
            <button class="vc-dock__btn ${sharing?'is-on':''}" data-share>${N.ic('sliders')}<span>${sharing?'Stop share':'Share'}</span></button>
            <button class="vc-dock__btn" data-chat>${N.ic('chat')}<span>Chat</span></button>
            <button class="vc-dock__btn" data-more>${N.ic('more')}<span>More</span></button>
            <button class="vc-dock__btn vc-dock__btn--end" data-end>${N.ic('x')}<span>End</span></button>
          </div>
        </div>
        <aside class="vc-side ${chatOpen?'is-open':''}">
          <div class="vc-side__head">
            <div style="font-size:13px;font-weight:650">In-call chat</div>
            <button class="icon-btn" data-close-chat>${N.ic('x')}</button>
          </div>
          <div class="vc-side__body">
            ${[{from:'ayesha',text:'Can everyone see my screen?',time:'10:24'},{from:'rafi',text:'Yes, looks crisp.',time:'10:24'},{from:'me',text:'Sharing the new palette now.',time:'10:25'}].map(m=>`
              <div class="vc-chat-msg ${m.from==='me'?'is-mine':''}">
                ${m.from!=='me'?N.av(m.from,22,'av--hair'):''}
                <div class="vc-chat-bubble"><div class="vc-chat-who">${m.from==='me'?'You':N.user(m.from).name.split(' ')[0]}</div><div>${N.esc(m.text)}</div><div class="vc-chat-time">${m.time}</div></div>
              </div>`).join('')}
          </div>
          <div class="vc-side__foot">
            <input placeholder="Send a message…" id="vcChatInput">
            <button class="send-btn" id="vcChatSend">${N.ic('send')}</button>
          </div>
        </aside>
      </div>

      <section class="card" style="padding:16px;margin-top:18px">
        <div class="section-head" style="margin:0 0 10px"><h2>Recent calls</h2><a class="link" href="messages.html">History</a></div>
        <div style="display:flex;flex-direction:column;gap:6px">
          ${[{u:'ayesha',when:'Today 10:00',dur:'42m'},{u:'rafi',when:'Yesterday',dur:'18m'},{u:'kavita',when:'Mon',dur:'1h 04m'}].map(c=>`
            <div class="vc-history">
              ${N.av(c.u,34,'av--hair')}
              <div style="min-width:0;flex:1">
                <div style="font-size:12.5px;font-weight:600">${N.esc(N.user(c.u).name)}</div>
                <div style="font-size:10.5px;color:var(--faint)">${c.when} · ${c.dur}</div>
              </div>
              <button class="btn btn--ghost btn--sm" data-callback="${c.u}">${N.ic('video')}Call back</button>
            </div>`).join('')}
        </div>
      </section>
    </div>`;

    N.reveal();
    wire();
  }

  function fmtDur(s) {
    const m = Math.floor(s/60), r = s%60;
    return `${String(m).padStart(2,'0')}:${String(r).padStart(2,'0')}`;
  }

  const style = document.createElement('style');
  style.textContent = `
    .vc-layout{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:18px;align-items:start}
    .vc-stage{border:1px solid var(--border);border-radius:16px;background:var(--surface);padding:14px;display:flex;flex-direction:column;gap:12px}
    .vc-stage__head{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
    .vc-stage__title{font-size:14px;font-weight:650}
    .vc-stage__meta{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--faint)}
    .vc-stage__actions{margin-left:auto;display:flex;gap:6px}
    .vc-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .vc-tile{position:relative;border-radius:12px;overflow:hidden;aspect-ratio:4/3;border:1px solid var(--border);background:#060509}
    .vc-tile.is-speaking{border-color:rgba(84,211,155,.5);box-shadow:0 0 0 1px rgba(84,211,155,.25)}
    .vc-tile.is-muted .vc-tile__media{filter:brightness(.7) saturate(.6)}
    .vc-tile__media{position:absolute;inset:0}
    .vc-tile__media .media{position:absolute;inset:0}
    .vc-tile__off{position:absolute;inset:0;display:grid;place-items:center;gap:6px;color:rgba(var(--overlay-rgb),.7);font-size:11px;background:rgba(6,5,10,.7)}
    .vc-tile__off .icon{width:24px;height:24px}
    .vc-tile__name{position:absolute;left:8px;bottom:8px;z-index:3;display:flex;align-items:center;gap:5px;padding:4px 8px;border-radius:6px;background:rgba(6,5,10,.6);backdrop-filter:blur(8px);font-size:10.5px;font-weight:600}
    .vc-tile__name .av{--s:18px}
    .vc-tile__name .icon{width:12px;height:12px;color:#ff8ea1}
    .vc-tile__speak{position:absolute;right:8px;bottom:8px;z-index:3;width:8px;height:8px;border-radius:50%;background:#54d39b;box-shadow:0 0 0 4px rgba(84,211,155,.2)}
    .vc-dock{display:flex;align-items:center;justify-content:center;gap:6px;padding:8px;border-radius:12px;background:rgba(var(--overlay-rgb),.03);border:1px solid var(--border)}
    .vc-dock__btn{display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 10px;border-radius:9px;color:var(--muted);font-size:9px;font-weight:500;transition:background .16s,color .16s}
    .vc-dock__btn .icon{width:18px;height:18px}
    .vc-dock__btn:hover{background:rgba(var(--overlay-rgb),.06);color:#fff}
    .vc-dock__btn.is-off{color:#ff8ea1;background:rgba(255,84,112,.12)}
    .vc-dock__btn.is-on{color:#d6c3ff;background:rgba(166,120,255,.14)}
    .vc-dock__btn--end{color:#ff8ea1;border:1px solid rgba(255,84,112,.3)}
    .vc-dock__btn--end:hover{background:rgba(255,84,112,.18)}
    .vc-side{border:1px solid var(--border);border-radius:14px;background:var(--surface);display:flex;flex-direction:column;height:420px;overflow:hidden}
    .vc-side__head{padding:12px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
    .vc-side__body{flex:1;overflow:auto;padding:12px 14px;display:flex;flex-direction:column;gap:8px}
    .vc-chat-msg{display:flex;align-items:flex-end;gap:7px}
    .vc-chat-msg.is-mine{flex-direction:row-reverse}
    .vc-chat-bubble{max-width:78%;padding:8px 11px;border-radius:10px;background:rgba(var(--overlay-rgb),.05);border:1px solid var(--border);font-size:11.5px;line-height:1.5}
    .vc-chat-msg.is-mine .vc-chat-bubble{background:var(--grad-soft);border-color:rgba(166,120,255,.3)}
    .vc-chat-who{font-size:9.5px;color:var(--violet-soft);font-weight:600;margin-bottom:2px}
    .vc-chat-time{font-size:8.5px;color:var(--faint);margin-top:3px}
    .vc-side__foot{padding:10px 12px;border-top:1px solid var(--border);display:flex;align-items:center;gap:6px}
    .vc-side__foot input{flex:1;height:34px;border-radius:99px;border:1px solid var(--border);background:rgba(var(--overlay-rgb),.05);padding:0 12px;color:#fff;font-size:11.5px}
    .vc-side__foot .send-btn{width:32px;height:32px;border-radius:50%;background:var(--grad);color:#180a26;display:grid;place-items:center}
    .vc-history{display:flex;align-items:center;gap:10px;padding:9px;border-radius:10px;border:1px solid var(--border);background:rgba(var(--overlay-rgb),.02)}
    .vc-history .btn{height:28px;font-size:10.5px}
  `;
  document.head.appendChild(style);

  function wire() {
    N.view.querySelector('[data-mute]').addEventListener('click', () => { muted = !muted; N.toast(muted?'Muted':'Unmuted'); render(); });
    N.view.querySelector('[data-cam]').addEventListener('click', () => { camOff = !camOff; N.toast(camOff?'Camera off':'Camera on'); render(); });
    N.view.querySelector('[data-share]').addEventListener('click', () => { sharing = !sharing; N.toast(sharing?'Sharing screen':'Stopped sharing'); render(); });
    N.view.querySelector('[data-chat]').addEventListener('click', () => { chatOpen = !chatOpen; const side = N.view.querySelector('.vc-side'); side.classList.toggle('is-open', chatOpen); });
    N.view.querySelector('[data-close-chat]').addEventListener('click', () => { chatOpen = false; N.view.querySelector('.vc-side').classList.remove('is-open'); });
    N.view.querySelector('[data-end]').addEventListener('click', () => { N.confirmDialog({ title:'End call?', message:'Everyone will be disconnected.', confirmLabel:'End call', danger:true, onConfirm(){ if(timer) clearInterval(timer); N.toast('Call ended'); setTimeout(()=>location.href='messages.html',700); } }); });
    N.view.querySelector('[data-invite]').addEventListener('click', () => N.toast('Invite link copied'));
    N.view.querySelector('[data-record]').addEventListener('click', () => N.toast('Recording started'));
    N.view.querySelectorAll('[data-callback]').forEach(b => b.addEventListener('click', () => N.toast('Calling back '+N.user(b.dataset.callback).name)));
    const moreBtn = N.view.querySelector('[data-more]');
    if (moreBtn) moreBtn.addEventListener('click', () => N.openMenu(moreBtn, [
      { icon:'users', label:'Participants', onClick(){ N.toast('4 participants'); } },
      { icon:'sliders', label:'Layout: grid', onClick(){ N.toast('Layout changed'); } },
      { icon:'settings', label:'Settings', onClick(){ N.toast('Settings'); } },
      { sep:true },
      { icon:'hand', label:'Raise hand', onClick(){ N.toast('Hand raised'); } }
    ]));
  }

  render();
});