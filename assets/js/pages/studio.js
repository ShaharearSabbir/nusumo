/* Nusumo — Live studio (setup / live / ended) */
N.ready(function () {
  const D = N.D, me = D.users.me;
  let state = 'setup';
  let muted = false, camOn = true, screen = false, beauty = false;
  let title = 'Studio tour + live Q&A: building a home setup under 50k';
  let category = 'Music', visibility = 'Everyone';
  const tags = ['live', 'studio', 'qna'];
  let timer = 0, timerId = null;
  let viewers = 0, peak = 0, newFollowers = 0, gifts = 0;
  let chatTab = 'chat', slowMode = false, followersOnly = false;
  const chat = [
    { u:'nusrat', t:'hello from the studio', time:'00:03' },
    { u:'farah', t:'mic check 1 2', role:'Mod', time:'00:09' },
    { u:'milo', t:'the lighting looks gorgeous tonight', time:'00:14' }
  ];
  const seedViewers = ['ayesha','rafi','farah','kavita','zeeshan','milo','nusrat','devon'];

  function fmtTime(n) {
    const h = String(Math.floor(n / 3600)).padStart(2, '0');
    const m = String(Math.floor((n % 3600) / 60)).padStart(2, '0');
    const s = String(n % 60).padStart(2, '0');
    return h + ':' + m + ':' + s;
  }

  function micMeter() {
    const levels = [1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0];
    return `<div class="mic-meter">${levels.map((v, i) => `<i class="${v ? 'on' : ''}" style="animation:barPulse 1.3s ${i * 0.07}s ease-in-out infinite"></i>`).join('')}</div>`;
  }

  function deviceCard() {
    return `<div class="device-row">
      <div class="device"><label for="micDev">${N.ic('mic')}Microphone</label>
        <select class="select" id="micDev" name="micDev"><option>MacBook Air mic</option><option>AirPods Pro</option><option>Shure SM7B</option></select>
        ${micMeter()}</div>
      <div class="device"><label for="camDev">${N.ic('video')}Camera</label>
        <select class="select" id="camDev" name="camDev"><option>FaceTime HD</option><option>Logitech Brio</option><option>iPhone (continuity)</option></select>
        <div class="mic-meter"><i class="on"></i><i class="on"></i><i></i><i class="on"></i><i class="on"></i><i></i><i class="on"></i><i class="on"></i></div>
      </div>
      <div class="device"><label for="outDev">${N.ic('headphones')}Audio out</label>
        <select class="select" id="outDev" name="outDev"><option>MacBook speakers</option><option>AirPods Pro</option><option>Studio monitors</option></select>
        <div style="height:16px;margin-top:7px;display:flex;align-items:center;gap:5px;font-size:10px;color:var(--faint)">${N.ic('check')}No echo detected</div>
      </div>
    </div>`;
  }

  function previewHTML(live) {
    const cls = live ? 'preview preview--live' : 'preview';
    return `<div class="${cls}" data-preview>
      ${N.media(me.grad)}
      <span class="scrim-b" style="opacity:${live ? .45 : .6}"></span>
      <div class="preview__badges">
        ${live
          ? `<span class="live-badge live-badge--solid"><i class="live-dot"></i>LIVE</span>
             <span class="badge" style="background:rgba(6,5,10,.55);backdrop-filter:blur(8px)"><i class="clock" style="width:11px;height:11px"></i><span class="preview__timer" data-timer>${fmtTime(timer)}</span></span>`
          : `<span class="badge" style="background:rgba(6,5,10,.55);backdrop-filter:blur(8px)">Preview</span>
             <span class="badge" style="background:rgba(6,5,10,.55);backdrop-filter:blur(8px)">${N.ic('eye')}0 watching</span>`}
        <div class="row--tight" style="margin-left:auto">
          ${live ? `<span class="badge" style="background:rgba(6,5,10,.55);backdrop-filter:blur(8px)">${N.ic('eye')}<span data-viewers>${N.fmt(viewers)}</span></span>` : ''}
          <button class="icon-btn" data-settings aria-label="Stream settings">${N.ic('settings')}</button>
        </div>
      </div>
      <div class="preview__center">
        ${camOn
          ? `${N.av('me', 96, 'av--ring')}<small>${live ? 'You are live' : 'Camera preview'}</small>`
          : `<div class="preview__cam">${N.ic('video')}</div><small>Camera is off</small>`}
      </div>
      ${live ? `<div class="preview__host">${N.av('me', 24, 'av--hair')}<span>${me.name}</span>${me.verified ? N.verified() : ''}<span class="dot-sep"></span><span>${category}</span></div>` : ''}
      <div class="preview__dock">
        <button class="icon-btn ${muted ? 'is-off' : ''}" data-toggle-mic aria-label="Toggle microphone" title="Microphone">${N.ic(muted ? 'micOff' : 'mic')}</button>
        <button class="icon-btn ${camOn ? '' : 'is-off'}" data-toggle-cam aria-label="Toggle camera" title="Camera">${N.ic(camOn ? 'video' : 'video')}</button>
        <button class="icon-btn ${screen ? 'is-active' : ''}" data-toggle-screen aria-label="Share screen" title="Share screen">${N.ic('maximize')}</button>
        <button class="icon-btn ${beauty ? 'is-active' : ''}" data-toggle-beauty aria-label="Beauty filter" title="Beauty">${N.ic('zap')}</button>
        <span class="dot-sep"></span>
        <button class="icon-btn icon-btn--danger" data-end-live aria-label="End live" title="End live">${N.ic('x')}</button>
      </div>
    </div>`;
  }

  function setupHTML() {
    return `<div class="page page--tight">
      <div class="studio-top">
        <a class="crumb" href="live.html">${N.ic('chevronLeft')}Live</a>
        <span class="dot-sep"></span>
        <span class="crumb">Studio</span>
        <span class="spacer"></span>
        <span class="badge">Not live yet</span>
      </div>
      <div class="studio-grid">
        <div class="studio-col">
          ${previewHTML(false)}
          ${deviceCard()}
          <div class="studio-card">
            <h3>Stream details</h3>
            <div class="field"><label for="stTitle">Title</label>
              <input class="input" id="stTitle" name="stTitle" value="${N.esc(title)}" placeholder="What are you streaming about?"></div>
            <div class="field"><label for="stCat">Category</label>
              <select class="select" id="stCat" name="stCat">
                ${['Music','Talk','Learning','Gaming','Art','Tech'].map(c => `<option ${c === category ? 'selected' : ''}>${c}</option>`).join('')}
              </select></div>
            <div class="field"><label for="stVis">Visibility</label>
              <select class="select" id="stVis" name="stVis">
                ${['Everyone','Followers only','Subscribers only'].map(v => `<option ${v === visibility ? 'selected' : ''}>${v}</option>`).join('')}
              </select></div>
            <div class="field"><label>Tags</label>
              <div class="tag-input" data-tags>
                ${tags.map(t => `<span class="tag">${N.esc(t)}<button data-remove-tag="${N.esc(t)}" aria-label="Remove ${N.esc(t)}">${N.ic('x')}</button></span>`).join('')}
                <input class="input" style="border:0;background:transparent;padding:0;min-width:120px;height:22px;font-size:11.5px" placeholder="add a tag…" aria-label="Add a tag" data-tag-input>
              </div>
            </div>
            <div class="field"><label for="stDesc">Description</label>
              <textarea class="textarea" id="stDesc" name="stDesc" rows="3" placeholder="Tell viewers what to expect">${N.esc('Live from the studio — say hi in chat, questions welcome.')}</textarea>
            </div>
            <div class="switch-row"><div class="switch-row__text"><strong>Save replay</strong><span>Keep a copy for your profile after the stream</span></div>
              <button class="switch" role="switch" aria-checked="true" data-switch="replay"></button></div>
            <div class="switch-row"><div class="switch-row__text"><strong>Chat slow mode</strong><span>Limit viewers to one message every 10 seconds</span></div>
              <button class="switch" role="switch" aria-checked="false" data-switch="slow"></button></div>
          </div>
        </div>
        <aside class="studio-side">
          <div class="studio-card">
            <h3>Ready to go live?</h3>
            <p style="font-size:11.5px;color:var(--muted);line-height:1.55;margin-bottom:14px">
              Check your camera and mic above, fill in the details, then hit go live. Viewers will be notified when you start.
            </p>
            <div class="studio-actions">
              <button class="btn btn--primary btn--block" data-go-live>${N.ic('live')}Go live now</button>
              <button class="btn btn--ghost btn--block" data-schedule>${N.ic('calendar')}Schedule for later</button>
            </div>
            <div class="studio-note">${N.ic('info')}Make sure your lighting is in front of you, not behind. Test your mic with a few words.</div>
          </div>
          <div class="studio-card">
            <h3>Pre-flight checklist</h3>
            <div class="checklist">
              ${['Camera preview working','Microphone level healthy','Title and category set','Tags added','Quiet room, headphones on'].map(x =>
                `<div class="checklist__row">${N.ic('check')}${x}</div>`).join('')}
            </div>
          </div>
          <div class="banner banner--warn">
            ${N.ic('info')}<span>Going live notifies 2.4K followers. You can end the stream any time.</span>
          </div>
        </aside>
      </div>
    </div>`;
  }

  function liveHTML() {
    return `<div class="page page--tight">
      <div class="studio-top">
        <a class="crumb" href="index.html">${N.ic('chevronLeft')}Home</a>
        <span class="dot-sep"></span>
        <span class="crumb">Studio</span>
        <span class="spacer"></span>
        <span class="live-badge live-badge--solid"><i class="live-dot"></i>LIVE</span>
        <span class="badge badge--violet" style="font-variant-numeric:tabular-nums" data-timer>${fmtTime(timer)}</span>
      </div>
      <div class="studio-grid">
        <div class="studio-col">
          ${previewHTML(true)}
          <div class="studio-livetitle">
            <div style="min-width:0;flex:1">
              <h1>${N.esc(title)}</h1>
              <div class="sub">
                <span class="live-badge"><i class="live-dot"></i>Live</span>
                <span class="dot-sep"></span><span>${N.esc(category)}</span>
                <span class="dot-sep"></span><span>${visibility}</span>
                <span class="dot-sep"></span><span>${tags.map(t => '#' + t).join(' ')}</span>
              </div>
            </div>
            <button class="btn btn--ghost btn--sm studio-livetitle__share" data-share>${N.ic('share')}Share</button>
          </div>
          <div class="studio-note">${N.ic('info')}Speak toward the mic, keep the camera at eye level. Viewers can hear you but not your desktop audio.</div>
        </div>
        <aside class="studio-side">
          <div class="banner banner--danger" style="margin:0">
            ${N.ic('live')}<span><b>You are live.</b> ${N.fmt(viewers)} watching right now.</span>
            <button class="btn btn--danger btn--sm" data-end-live style="margin-left:auto">${N.ic('x')}End</button>
          </div>
          <div class="studio-card" style="padding:0">
            <div class="studio-tabs">
              <button class="studio-tab ${chatTab === 'chat' ? 'is-active' : ''}" data-tab="chat">Chat<span class="count">${chat.length}</span></button>
              <button class="studio-tab ${chatTab === 'viewers' ? 'is-active' : ''}" data-tab="viewers">Viewers<span class="count">${viewers}</span></button>
              <button class="studio-tab ${chatTab === 'stats' ? 'is-active' : ''}" data-tab="stats">Stats</button>
            </div>
            <div style="padding:12px 14px 14px">
              ${chatTab === 'chat' ? chatPanel() : chatTab === 'viewers' ? viewersPanel() : statsPanel()}
            </div>
          </div>
          <div class="studio-card">
            <h3>Moderation</h3>
            <div class="switch-row" style="padding:8px 0"><div class="switch-row__text"><strong>Slow mode</strong><span>1 message every 10s</span></div>
              <button class="switch ${slowMode ? '' : ''}" role="switch" aria-checked="${slowMode}" data-mod="slow"></button></div>
            <div class="switch-row" style="padding:8px 0;border:0"><div class="switch-row__text"><strong>Followers-only chat</strong><span>Only followers can type</span></div>
              <button class="switch" role="switch" aria-checked="${followersOnly}" data-mod="followers"></button></div>
            <div class="divider" style="margin:8px 0"></div>
            <div class="row--wrap" style="gap:6px">
              <button class="btn btn--ghost btn--sm" data-clear-chat>${N.ic('trash')}Clear chat</button>
              <button class="btn btn--ghost btn--sm" data-pin>${N.ic('pin')}Pin rules</button>
            </div>
          </div>
        </aside>
      </div>
    </div>`;
  }

  function chatPanel() {
    return `<div class="chat-panel__scroll" data-chat-scroll style="height:260px;padding:0 0 6px">
      ${chat.map(m => msgHTML(m)).join('')}
    </div>
    <form class="chat-send" data-chat-form style="margin-top:10px">
      <input class="input" name="chatMessage" placeholder="Reply as ${me.name.split(' ')[0]}…" autocomplete="off" aria-label="Chat message">
      <button class="icon-btn icon-btn--send" type="submit" aria-label="Send">${N.ic('send')}</button>
    </form>
    <div class="chat-panel__rules" style="margin-top:7px">Be kind. No spoilers. Ask before posting links.</div>`;
  }

  function msgHTML(m) {
    if (m.system) return `<div class="msg msg--system">${m.system}</div>`;
    const mu = N.user(m.u);
    return `<div class="msg">
      ${N.av(mu, 22, 'av--hair')}
      <div class="msg__body">
        <span class="msg__name">${N.esc(mu.name)}${mu.verified ? N.verified() : ''}
          ${m.role ? `<span class="msg__role ${m.role === 'Host' ? 'msg__role--host' : 'msg__role--mod'}">${m.role}</span>` : ''}
          <span class="msg__time">${m.time}</span>
        </span>
        <div>${m.t}</div>
      </div>
      <div class="mod-actions">
        <button data-delmsg aria-label="Delete message">${N.ic('trash')}</button>
        <button data-timeout aria-label="Timeout user">${N.ic('clock')}</button>
      </div>
    </div>`;
  }

  function viewersPanel() {
    return `<div style="max-height:320px;overflow:auto">
      ${seedViewers.map((id, i) => {
        const u = N.user(id);
        return `<div class="viewer-row">
          ${N.av(u, 24, 'av--hair')}
          <div style="min-width:0;flex:1">
            <div style="font-weight:600">${N.esc(u.name)}${u.verified ? N.verified() : ''}</div>
            <div style="font-size:9.5px;color:var(--faint)">${u.handle} · ${u.role}</div>
          </div>
          <span class="role">${i === 0 ? 'Mod' : i < 3 ? 'Subscriber' : 'Viewer'}</span>
          <button class="icon-btn" style="width:26px;height:26px" data-viewer-menu aria-label="Moderate ${N.esc(u.name)}">${N.ic('more')}</button>
        </div>`;
      }).join('')}
    </div>`;
  }

  function statsPanel() {
    return `<div class="stats-grid">
      <div class="stat-box"><span>Peak viewers</span><b>${N.fmt(peak)}</b></div>
      <div class="stat-box"><span>Current</span><b>${N.fmt(viewers)}</b></div>
      <div class="stat-box"><span>New followers</span><b>${newFollowers}</b></div>
      <div class="stat-box"><span>Gifts</span><b>${gifts}</b></div>
      <div class="stat-box"><span>Chat msgs</span><b>${chat.length}</b></div>
      <div class="stat-box"><span>Duration</span><b style="font-variant-numeric:tabular-nums">${fmtTime(timer)}</b></div>
    </div>
    <div class="end-timeline" style="margin-top:12px">
      ${Array.from({length:24}, (_, i) => `<i style="height:${14 + Math.round(Math.sin(i * .6) * 8 + Math.random() * 30)}%"></i>`).join('')}
    </div>
    <div class="end-legend"><span>start</span><span>now</span></div>`;
  }

  function endedHTML() {
    return `<div class="page page--tight">
      <div class="studio-top">
        <a class="crumb" href="index.html">${N.ic('chevronLeft')}Home</a>
        <span class="dot-sep"></span>
        <span class="crumb">Studio</span>
        <span class="spacer"></span>
        <span class="badge badge--ok">Stream ended</span>
      </div>
      <div class="end-hero">
        <div class="end-hero__mark">${N.ic('check')}</div>
        <div>
          <h2>Nice stream, ${me.name.split(' ')[0]}</h2>
          <p>You were live for ${fmtTime(timer)} and reached ${N.fmt(peak)} peak viewers. A replay is saved to your profile.</p>
        </div>
      </div>
      <div class="end-stats">
        <div class="stat-box"><span>Duration</span><b style="font-variant-numeric:tabular-nums">${fmtTime(timer)}</b></div>
        <div class="stat-box"><span>Peak viewers</span><b>${N.fmt(peak)}</b></div>
        <div class="stat-box"><span>New followers</span><b>${newFollowers}</b></div>
        <div class="stat-box"><span>Gifts received</span><b>${gifts}</b></div>
      </div>
      <div class="studio-grid" style="margin-top:18px">
        <div class="studio-col">
          <div class="studio-card">
            <h3>Stream timeline</h3>
            <div class="end-timeline">
              ${Array.from({length:32}, (_, i) => `<i style="height:${18 + Math.round(Math.sin(i * .55) * 12 + Math.random() * 34)}%"></i>`).join('')}
            </div>
            <div class="end-legend"><span>0:00</span><span>${fmtTime(timer)}</span></div>
            <div class="divider"></div>
            <div class="row--wrap" style="gap:6px">
              <span class="chip chip--sm">${N.ic('clock')} Peak at 24:18</span>
              <span class="chip chip--sm">${N.ic('gift')} Top gift: Fireworks</span>
              <span class="chip chip--sm">${N.ic('chat')} ${chat.length} messages</span>
            </div>
          </div>
          <div class="studio-card">
            <h3>Chat replay</h3>
            <div class="chat-panel__scroll" style="height:220px;padding:0">
              ${chat.slice(0, 8).map(m => msgHTML(m)).join('')}
            </div>
          </div>
        </div>
        <aside class="studio-side">
          <div class="studio-card">
            <h3>What's next</h3>
            <div class="studio-actions">
              <button class="btn btn--primary btn--block" data-go-live>${N.ic('live')}Go live again</button>
              <button class="btn btn--ghost btn--block" data-share>${N.ic('share')}Share replay</button>
              <button class="btn btn--ghost btn--block" data-schedule>${N.ic('calendar')}Schedule next stream</button>
              <button class="btn btn--ghost btn--block" data-home>${N.ic('home')}Back to home</button>
            </div>
          </div>
          <div class="studio-card">
            <h3>Highlights</h3>
            <div class="checklist">
              <div class="checklist__row">${N.ic('check')}Replay saved to your profile</div>
              <div class="checklist__row">${N.ic('check')}${newFollowers} new followers gained</div>
              <div class="checklist__row">${N.ic('check')}${gifts} gifts received</div>
              <div class="checklist__row">${N.ic('info')}Analytics update within 1 hour</div>
            </div>
          </div>
        </aside>
      </div>
    </div>`;
  }

  function render() {
    if (state === 'setup') N.view.innerHTML = setupHTML();
    else if (state === 'live') N.view.innerHTML = liveHTML();
    else N.view.innerHTML = endedHTML();
    N.reveal();
    wire();
    if (state === 'live') startTimer();
  }

  function startTimer() {
    if (timerId) clearInterval(timerId);
    timerId = setInterval(() => {
      timer++;
      if (viewers < peak) {} 
      viewers = viewers + (Math.random() > .6 ? 1 : (Math.random() > .5 ? -1 : 0));
      if (viewers > peak) peak = viewers;
      newFollowers += Math.random() > .92 ? 1 : 0;
      if (Math.random() > .9) gifts += 1;
      N.view.querySelectorAll('[data-timer]').forEach(el => { el.textContent = fmtTime(timer); });
      const v = N.view.querySelector('[data-viewers]');
      if (v) v.textContent = N.fmt(viewers);
      // ambient chat
      if (Math.random() > .55) {
        const lines = ['this is unreal','🔥','the camera angle is perfect','sending love','saving this for the recap'];
        const u = seedViewers[Math.floor(Math.random() * seedViewers.length)];
        chat.push({ u, t: lines[Math.floor(Math.random() * lines.length)], time: fmtTime(timer).slice(3) });
        const sc = N.view.querySelector('[data-chat-scroll]');
        if (sc) {
          sc.insertAdjacentHTML('beforeend', msgHTML(chat[chat.length - 1]));
          if (sc.scrollHeight - sc.scrollTop - sc.clientHeight < 120) sc.scrollTop = sc.scrollHeight;
        }
        const c = N.view.querySelector('.studio-tab .count');
        if (c && chatTab === 'chat') c.textContent = chat.length;
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerId) { clearInterval(timerId); timerId = null; }
  }

  function wire() {
    // switches
    N.view.querySelectorAll('[data-switch]').forEach(sw => {
      sw.addEventListener('click', () => {
        sw.setAttribute('aria-checked', sw.getAttribute('aria-checked') === 'true' ? 'false' : 'true');
      });
    });
    N.view.querySelectorAll('[data-mod]').forEach(sw => {
      sw.addEventListener('click', () => {
        const on = sw.getAttribute('aria-checked') === 'true';
        sw.setAttribute('aria-checked', String(!on));
        if (sw.dataset.mod === 'slow') slowMode = !on;
        if (sw.dataset.mod === 'followers') followersOnly = !on;
      });
    });

    // tag input
    const tagInput = N.view.querySelector('[data-tag-input]');
    if (tagInput) {
      tagInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
          e.preventDefault();
          const val = tagInput.value.trim().replace(/,/g, '');
          if (val && !tags.includes(val)) { tags.push(val); render(); }
          tagInput.value = '';
        }
      });
    }
    N.view.querySelectorAll('[data-remove-tag]').forEach(b => {
      b.addEventListener('click', (e) => { e.stopPropagation(); const i = tags.indexOf(b.dataset.removeTag); if (i > -1) { tags.splice(i, 1); render(); } });
    });

    // title/category/visibility sync
    const t = N.view.querySelector('#stTitle'); if (t) t.addEventListener('input', e => { title = e.target.value; });
    const c = N.view.querySelector('#stCat'); if (c) c.addEventListener('change', e => { category = e.target.value; });
    const v = N.view.querySelector('#stVis'); if (v) v.addEventListener('change', e => { visibility = e.target.value; });

    // preview toggles
    N.view.querySelectorAll('[data-toggle-mic]').forEach(b => b.addEventListener('click', () => { muted = !muted; render(); }));
    N.view.querySelectorAll('[data-toggle-cam]').forEach(b => b.addEventListener('click', () => { camOn = !camOn; render(); }));
    N.view.querySelectorAll('[data-toggle-screen]').forEach(b => b.addEventListener('click', () => { screen = !screen; N.toast(screen ? 'Screen sharing on' : 'Screen sharing off'); render(); }));
    N.view.querySelectorAll('[data-toggle-beauty]').forEach(b => b.addEventListener('click', () => { beauty = !beauty; N.toast(beauty ? 'Beauty filter on' : 'Beauty filter off'); render(); }));

    // go live
    N.view.querySelectorAll('[data-go-live]').forEach(b => b.addEventListener('click', () => {
      if (!title.trim()) { N.toast('Give your stream a title first'); return; }
      stopTimer();
      timer = 0; viewers = 142 + Math.floor(Math.random() * 60); peak = viewers;
      newFollowers = 0; gifts = 0;
      state = 'live';
      render();
    }));

    // end live
    N.view.querySelectorAll('[data-end-live]').forEach(b => b.addEventListener('click', () => {
      N.confirmDialog({ title:'End your live stream?', message:'Viewers will be disconnected. A replay will be saved.', confirmLabel:'End live', danger:true, onConfirm() { stopTimer(); state = 'ended'; render(); } });
    }));

    // tabs
    N.view.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => { chatTab = b.dataset.tab; render(); }));

    // chat form
    N.view.addEventListener('submit', (e) => {
      const form = e.target.closest('[data-chat-form]');
      if (!form) return;
      e.preventDefault();
      const input = form.querySelector('input');
      const val = input.value.trim();
      if (!val) { input.focus(); return; }
      input.value = '';
      chat.push({ u:'me', t:N.esc(val), time:fmtTime(timer).slice(3) });
      const sc = N.view.querySelector('[data-chat-scroll]');
      if (sc) { sc.insertAdjacentHTML('beforeend', msgHTML(chat[chat.length - 1])); if (sc.scrollHeight - sc.scrollTop - sc.clientHeight < 120) sc.scrollTop = sc.scrollHeight; }
    });

    // misc buttons
    N.view.querySelectorAll('[data-clear-chat]').forEach(b => b.addEventListener('click', () => { chat.length = 0; render(); N.toast('Chat cleared'); }));
    N.view.querySelectorAll('[data-share]').forEach(b => b.addEventListener('click', () => { N.openSheet({ title:'Share stream', sub:N.esc(me.name) + ' is live', body:`<div class="gift-grid">${[['link','Copy link'],['chat','Send in chat'],['mail','Email'],['globe','Post']].map(([ic,l])=>`<button class="gift" data-share-to="${l}"><span class="gift__glyph">${N.ic(ic)}</span><span>${l}</span></button>`).join('')}</div>`, foot:`<button class="btn btn--primary btn--block" data-copy>Copy link</button>`, onMount(s){ s.querySelector('[data-copy]').addEventListener('click',()=>{ N.copy(location.origin+'/live/'+Math.random().toString(36).slice(2,8)); }); s.querySelectorAll('[data-share-to]').forEach(x=>x.addEventListener('click',()=>{N.closeSheet();N.toast('Shared');})); } }); }));
    N.view.querySelectorAll('[data-schedule]').forEach(b => b.addEventListener('click', () => N.toast('Scheduling coming soon')));
    N.view.querySelectorAll('[data-home]').forEach(b => b.addEventListener('click', () => { location.href = 'index.html'; }));
    N.view.querySelectorAll('[data-settings]').forEach(b => b.addEventListener('click', () => N.toast('Stream settings')));
    N.view.querySelectorAll('[data-pin]').forEach(b => b.addEventListener('click', () => N.toast('Rules pinned to chat')));
    N.view.querySelectorAll('[data-viewer-menu]').forEach(b => b.addEventListener('click', (e) => {
      N.openMenu(e.currentTarget, [
        { icon:'shield', label:'Make moderator', onClick(){ N.toast('Promoted to moderator'); } },
        { icon:'ban', label:'Timeout 10 min', onClick(){ N.toast('Timed out'); } },
        { icon:'trash', label:'Remove from stream', danger:true, onClick(){ N.toast('Removed'); } }
      ]);
    }));
  }

  render();
  window.addEventListener('beforeunload', stopTimer);
});