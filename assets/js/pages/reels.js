/* Nusumo — Reels */
N.ready(function () {
  const D = N.D;
  const reels = D.reels;
  let index = 0;
  let muted = false, cc = true, playing = true, speed = '1x';
  let panelTab = 'comments';
  let sorted = 'top';
  const comments = D.reelComments.map(c => ({ ...c }));

  const actionStack = (r) => `<div class="reel-actions">
    <button class="reel-action ${r.liked ? 'is-on' : ''}" data-like aria-label="Like">
      <span class="reel-action__btn">${N.ic('heart')}</span><span class="reel-action__label" data-like-count>${N.fmt(r.likes)}</span>
    </button>
    <button class="reel-action" data-comments aria-label="Comments"><span class="reel-action__btn">${N.ic('comment')}</span><span class="reel-action__label">${N.fmt(r.comments)}</span></button>
    <button class="reel-action" data-share aria-label="Share"><span class="reel-action__btn">${N.ic('share')}</span><span class="reel-action__label">${N.fmt(r.shares)}</span></button>
    <button class="reel-action ${r.saved ? 'is-on' : ''}" data-save aria-label="Save"><span class="reel-action__btn">${N.ic('bookmark')}</span><span class="reel-action__label">Save</span></button>
    <button class="reel-action" data-reel-menu aria-label="More"><span class="reel-action__btn">${N.ic('more')}</span><span class="reel-action__label">More</span></button>
  </div>`;

  const meta = (r) => `<div class="reel-meta">
    <div class="reel-creator">
      ${N.av(r.user, 30, 'av--ring')}
      <span class="reel-creator__name">${N.esc(N.user(r.user).name)}${N.user(r.user).verified ? N.verified() : ''}</span>
      <button class="reel-follow" data-follow aria-label="Follow">${N.ic('plus')}</button>
    </div>
    <div class="reel-caption">${N.esc(r.caption)} ${r.tags.map(t => `<span class="tag">${N.esc(t)}</span>`).join(' ')}</div>
    <div class="reel-audio">${N.ic('volume')}<span>${N.esc(r.sound)}</span><button class="use" data-use-audio>Use this audio</button></div>
  </div>`;

  function desktopStage() {
    const r = reels[index];
    return `<div class="reels-main">
      <div class="reel-stage">
        <div class="reel-stage__tabs">
          <button class="reel-tab is-active">For you</button>
          <button class="reel-tab" data-feed-tab>Following</button>
          <button class="reel-tab" data-feed-tab>Trending</button>
          <a class="btn btn--ghost btn--sm" href="studio.html">${N.ic('plus')}Create reel</a>
        </div>
        <div class="reel-stage__wrap">
          <div class="reel-frame" id="reelFrame">
            ${N.media(r.grad)}
            <div class="scrim-t"></div>
            <div class="scrim-b"></div>
            <div class="reel-frame__top">
              <span class="reel-chip">${N.ic('film')} Reel</span>
              <div class="row row--tight">
                <button class="icon-btn icon-btn--glass" data-mute aria-label="Mute">${N.ic(muted ? 'volumeOff' : 'volume')}</button>
                <button class="icon-btn icon-btn--glass" data-cc aria-label="Captions" style="${cc ? 'color:#d9c7ff;border-color:rgba(166,120,255,.5)' : ''}">${N.ic('comment')}</button>
              </div>
            </div>
            <button class="player__hint" data-play aria-label="Play or pause" style="background:none;border:0">
              <span class="pulse-ring">${N.ic(playing ? 'pause' : 'play')}</span>
            </button>
            ${actionStack(r)}
            ${meta(r)}
            <div class="reel-progress">
              <div class="reel-progress__track"><div class="reel-progress__fill" style="width:${r.progress}%"></div></div>
              <div class="reel-progress__times"><span>0:${String(Math.round(r.progress / 100 * 45)).padStart(2, '0')}</span><span>${r.time}</span></div>
            </div>
          </div>
          <div class="reel-counter">
            <span class="reel-counter__pill"><b>${index + 1}</b> / ${reels.length}</span>
            <button class="icon-btn" data-prev aria-label="Previous reel">${N.ic('chevronUp')}</button>
            <button class="icon-btn" data-next aria-label="Next reel">${N.ic('chevronDown')}</button>
          </div>
        </div>
        <div class="reel-controls">
          <button class="icon-btn" data-play aria-label="Play or pause">${N.ic(playing ? 'pause' : 'play')}</button>
          <button class="icon-btn" data-mute aria-label="Mute">${N.ic(muted ? 'volumeOff' : 'volume')}</button>
          <span class="badge badge--violet" style="margin:0 4px">CC</span>
          <button class="reel-controls__speed" data-speed>${speed}</button>
          <button class="btn btn--ghost btn--sm" data-remix>${N.ic('sliders')}Remix</button>
        </div>
        <div class="reel-hint"><kbd>↑</kbd><kbd>↓</kbd> browse <span class="dot-sep"></span> <kbd>Space</kbd> pause <span class="dot-sep"></span> <kbd>M</kbd> mute</div>
      </div>
    </div>`;
  }

  function panel() {
    const r = reels[index];
    const u = N.user(r.user);
    return `<aside class="comments-panel" id="commentsPanel">
      <div class="comments-panel__head">
        ${N.av(u, 40, 'av--hair')}
        <div style="min-width:0">
          <div class="post__name" style="font-size:13px">${N.esc(u.name)}${u.verified ? N.verified() : ''}</div>
          <div class="tiny faint">${N.esc(u.handle)} · ${N.esc(u.followers)} followers</div>
        </div>
        <button class="btn btn--primary btn--sm" data-follow-panel>Follow</button>
      </div>
      <div class="tabs" style="padding:0 8px">
        <button class="tab-btn ${panelTab === 'comments' ? 'is-active' : ''}" data-panel-tab="comments">Comments <span class="count">${r.comments}</span></button>
        <button class="tab-btn ${panelTab === 'details' ? 'is-active' : ''}" data-panel-tab="details">Details</button>
      </div>
      <div class="comments-panel__list" id="panelBody">${panelBody(r)}</div>
      <div class="comments-panel__foot">
        <div class="comment-input">
          ${N.av('me', 30, 'av--hair')}
          <div class="comment-input__field">
            <input placeholder="Add a comment…" id="reelCommentInput">
            <button class="icon-btn" data-emoji aria-label="Emoji">${N.ic('smile')}</button>
            <button class="icon-btn" data-gif aria-label="GIF" style="font-size:9px;font-weight:700">GIF</button>
          </div>
          <button class="send-btn" data-send-comment aria-label="Send">${N.ic('send')}</button>
        </div>
        <div class="tip-row">${N.ic('gift')}<span>Support this creator</span><button class="btn btn--ghost btn--sm" data-tip>Send</button></div>
      </div>
    </aside>`;
  }

  function commentHTML(c) {
    return `<div class="comment ${c.reply ? 'comment__reply' : ''}">
      ${N.av(c.user, c.reply ? 26 : 30, 'av--hair')}
      <div class="comment__body">
        <div class="comment__head">${N.esc(N.user(c.user).name)}${N.user(c.user).verified ? N.verified() : ''}
          ${c.creator ? '<span class="badge badge--violet" style="height:16px;font-size:8.5px">Creator</span>' : ''}
          <span class="comment__time">${c.time}</span>
        </div>
        <div class="comment__text">${N.esc(c.text)}</div>
        <div class="comment__actions"><button data-reply>Reply</button><span>${c.reply ? 'View 12 more replies' : ''}</span></div>
      </div>
      <button class="comment__like" data-like-comment>${N.ic('heart')}<span>${c.likes}</span></button>
    </div>`;
  }

  function panelBody(r) {
    if (panelTab === 'details') {
      return `<div style="padding:6px 0 14px">
        <div class="reel-details__grid">
          <div><dt>Views</dt><dd>${r.views}</dd></div>
          <div><dt>Likes</dt><dd>${N.fmt(r.likes)}</dd></div>
          <div><dt>Comments</dt><dd>${N.fmt(r.comments)}</dd></div>
          <div><dt>Shares</dt><dd>${N.fmt(r.shares)}</dd></div>
          <div><dt>Duration</dt><dd>${r.time}</dd></div>
          <div><dt>Posted</dt><dd>2 hours ago</dd></div>
        </div>
        <div class="reel-details__row"><span>Audio</span><b>${N.esc(r.sound)}</b></div>
        <div class="reel-details__row"><span>Location</span><b>${N.esc(r.location)}</b></div>
        <div class="reel-details__row"><span>Visibility</span><b>Public</b></div>
        <button class="btn btn--ghost btn--block" style="margin-top:12px" data-use-audio>${N.ic('volume')}Use this audio</button>
      </div>`;
    }
    return `<div style="padding-top:4px">
      ${sorted === 'top' ? `<div class="pinned" style="margin-bottom:2px">${N.ic('pin')} Pinned comment</div>` : ''}
      ${comments.map(commentHTML).join('')}
    </div>`;
  }

  function mobileFeeds() {
    return `<div class="reel-feed" id="reelFeed">
      ${reels.map((r, i) => {
        const u = N.user(r.user);
        return `<section class="reel-slide" data-slide="${i}">
          ${N.media(r.grad)}
          <div class="scrim-t"></div><div class="scrim-b"></div>
          <div class="reel-slide__top">
            <span class="reel-chip" style="font-size:9px">Reels</span>
            <div class="reel-slide__seg"><b>Following</b><span>For you</span></div>
            <a class="icon-btn icon-btn--glass" href="studio.html" aria-label="Create reel">${N.ic('camera')}</a>
            <button class="icon-btn icon-btn--glass" data-search-open aria-label="Search">${N.ic('search')}</button>
          </div>
          <div class="reel-frame__top" style="top:46px">
            <span></span>
            <div class="row row--tight">
              <button class="icon-btn icon-btn--glass" data-mute aria-label="Mute">${N.ic('volume')}</button>
              <button class="icon-btn icon-btn--glass" data-cc aria-label="Captions" style="color:#d9c7ff;border-color:rgba(166,120,255,.5)">${N.ic('comment')}</button>
            </div>
          </div>
          <div class="reel-slide__actions">
            ${actionStack(r)}
          </div>
          <div class="reel-slide__meta">
            <div class="reel-creator">${N.av(u, 34, 'av--ring')}<span class="reel-creator__name">${N.esc(u.name)}${u.verified ? N.verified() : ''}</span><button class="reel-follow" data-follow>${N.ic('plus')}</button></div>
            <div class="reel-caption">${N.esc(r.caption)} ${r.tags.map(t => `<span class="tag">${N.esc(t)}</span>`).join(' ')}</div>
            <div class="reel-audio">${N.ic('volume')}<span>${N.esc(r.sound)}</span></div>
            <div class="reel-audio">${N.ic('location')}<span>${N.esc(r.location)}</span></div>
          </div>
          <div class="reel-slide__progress"><i style="width:${r.progress}%"></i></div>
        </section>`;
      }).join('')}
      <div class="swipe-hint">${N.ic('chevronUp')} Swipe up for the next reel</div>
    </div>`;
  }

  N.view.innerHTML = `<div class="page" style="padding-top:18px">
    <div class="reels-layout reels-desktop">
      ${desktopStage()}
      ${panel()}
    </div>
    <div class="reels-mobile">${mobileFeeds()}</div>
  </div>`;

  // desktop layout spacing: render stage + panel together
  const layout = document.querySelector('.reels-layout');
  layout.innerHTML = desktopStage() + panel();

  function refresh() {
    const wrap = document.querySelector('.reels-layout');
    if (wrap) wrap.innerHTML = desktopStage() + panel();
    const feed = document.getElementById('reelFeed');
    if (feed) {
      const slide = feed.querySelector(`[data-slide="${index}"]`);
      if (slide) slide.scrollIntoView({ block:'start', behavior:'smooth' });
    }
  }

  function like(r) {
    r.liked = !r.liked;
    r.likes += r.liked ? 1 : -1;
    document.querySelectorAll('.reel-actions [data-like], .reel-slide__actions [data-like]').forEach(btn => {
      const slide = btn.closest('[data-slide]');
      const thisReel = slide ? reels[+slide.dataset.slide] : reels[index];
      if (thisReel !== r) return;
      btn.classList.toggle('is-on', r.liked);
      const c = btn.querySelector('[data-like-count]');
      if (c) c.textContent = N.fmt(r.likes);
    });
    refresh();
  }

  function next(dir) {
    index = (index + dir + reels.length) % reels.length;
    refresh();
  }

  function actionSheet(r) {
    N.openSheet({
      title:'Reel options',
      body:`<div class="stack">
        <button class="menu__item" data-opt="save">${N.ic('bookmark')} ${r.saved ? 'Remove from saved' : 'Save reel'}</button>
        <button class="menu__item" data-opt="audio">${N.ic('volume')} Use this audio</button>
        <button class="menu__item" data-opt="remix">${N.ic('sliders')} Remix this reel</button>
        <button class="menu__item" data-opt="link">${N.ic('link')} Copy link</button>
        <button class="menu__item" data-opt="notint">${N.ic('ban')} Not interested</button>
        <div class="divider" style="margin:2px 0"></div>
        <button class="menu__item menu__item--danger" data-opt="report">${N.ic('flag')} Report reel</button>
        <button class="menu__item menu__item--danger" data-opt="block">${N.ic('ban')} Block creator</button>
      </div>`,
      onMount(sheet) {
        sheet.querySelectorAll('[data-opt]').forEach(b => b.addEventListener('click', () => {
          const opt = b.dataset.opt;
          N.closeSheet();
          if (opt === 'save') { r.saved = !r.saved; refresh(); N.toast(r.saved ? 'Reel saved' : 'Removed from saved'); }
          else if (opt === 'audio') N.toast('Audio added to your library');
          else if (opt === 'remix') N.toast('Remix studio opening soon');
          else if (opt === 'link') N.copy(location.origin + '/reel/' + r.id);
          else if (opt === 'notint') N.toast('We’ll show fewer reels like this');
          else if (opt === 'report') N.confirmDialog({ title:'Report this reel?', message:'Our moderation team reviews reports within 24 hours.', confirmLabel:'Report', danger:true, onConfirm() { N.toast('Report submitted'); } });
          else if (opt === 'block') N.confirmDialog({ title:`Block ${N.user(r.user).name}?`, message:'They won’t be able to find your profile or message you.', confirmLabel:'Block', danger:true, onConfirm() { N.toast('Creator blocked'); } });
        }));
      }
    });
  }

  function shareSheet(r) {
    N.openSheet({
      title:'Share reel', sub:`${N.user(r.user).name} · ${r.time}`,
      body:`<div class="more-grid">
        <button class="more-tile" data-share="Chats">${N.ic('chat')}<span>Send to chat</span></button>
        <button class="more-tile" data-share="Story">${N.ic('plus')}<span>Share to story</span></button>
        <button class="more-tile" data-share="Copy link">${N.ic('link')}<span>Copy link</span></button>
        <button class="more-tile" data-share="Embed">${N.ic('copy')}<span>Embed code</span></button>
        <button class="more-tile" data-share="X">${N.ic('share')}<span>Post to X</span></button>
        <button class="more-tile" data-share="Download">${N.ic('download')}<span>Download</span></button>
      </div>
      <div class="copy-row" style="margin-top:12px">${N.ic('link')}<code>nusumo.app/reel/${r.id}</code><button class="btn btn--ghost btn--sm" data-copy>Copy</button></div>`,
      onMount(sheet) {
        sheet.querySelectorAll('[data-share]').forEach(b => b.addEventListener('click', () => {
          const v = b.dataset.share;
          if (v === 'Copy link' || v === 'Embed') { N.copy(v === 'Embed' ? `<iframe src="${location.origin}/reel/${r.id}"></iframe>` : location.href); N.closeSheet(); }
          else { N.toast('Shared to ' + v); N.closeSheet(); }
        }));
        sheet.querySelector('[data-copy]').addEventListener('click', () => N.copy('nusumo.app/reel/' + r.id));
      }
    });
  }

  function commentsSheet(r) {
    N.openSheet({
      title:`${r.comments} comments`, sub:'Top comments',
      tall:true,
      body:`<div class="comments-panel__list" id="mobileComments" style="overflow:visible">${comments.map(commentHTML).join('')}</div>`,
      foot:`<div class="comment-input">
        ${N.av('me', 30, 'av--hair')}
        <div class="comment-input__field"><input placeholder="Add a comment…" id="mobileCommentInput"></div>
        <button class="send-btn" data-send aria-label="Send">${N.ic('send')}</button>
      </div>`,
      onMount(sheet) {
        const input = sheet.querySelector('#mobileCommentInput');
        sheet.querySelector('[data-send]').addEventListener('click', () => {
          const v = input.value.trim();
          if (!v) return N.toast('Write something first');
          comments.push({ user:'me', time:'now', likes:0, text:v });
          sheet.querySelector('#mobileComments').innerHTML = comments.map(commentHTML).join('');
          input.value = '';
          r.comments += 1;
          N.toast('Comment added');
        });
      }
    });
  }

  function tipSheet(r) {
    N.openSheet({
      title:'Support this creator', sub:`Send coins to ${N.user(r.user).name}`,
      body:`<div class="gift-grid">
        <button class="gift"><span class="gift__glyph">💜</span><span>Heart</span><span class="gift__price">10 coins</span></button>
        <button class="gift is-active"><span class="gift__glyph">🎛️</span><span>Studio</span><span class="gift__price">50 coins</span></button>
        <button class="gift"><span class="gift__glyph">🎧</span><span>Headphones</span><span class="gift__price">25 coins</span></button>
        <button class="gift"><span class="gift__glyph">✨</span><span>Sparkle</span><span class="gift__price">5 coins</span></button>
        <button class="gift"><span class="gift__glyph">🔥</span><span>Fire</span><span class="gift__price">15 coins</span></button>
        <button class="gift"><span class="gift__glyph">🎉</span><span>Party</span><span class="gift__price">100 coins</span></button>
      </div>
      <div class="between" style="margin-top:14px;font-size:11.5px;color:var(--muted)"><span>You have 240 coins</span><span>Balance</span></div>
      <div class="field" style="margin-top:12px"><label>Message (optional)</label><input class="input" placeholder="Say something nice…"></div>`,
      foot:`<button class="btn btn--primary btn--block" data-send-tip>Send 50 coins</button>`,
      onMount(sheet) {
        sheet.querySelectorAll('.gift').forEach(g => g.addEventListener('click', () => {
          sheet.querySelectorAll('.gift').forEach(x => x.classList.remove('is-active'));
          g.classList.add('is-active');
        }));
        sheet.querySelector('[data-send-tip]').addEventListener('click', () => { N.closeSheet(); N.toast('Tip sent — thank you!'); });
      }
    });
  }

  function useAudio() { N.toast('Audio added to your library'); }

  // desktop interactions
  document.addEventListener('click', function (e) {
    const r = reels[index];
    if (e.target.closest('[data-panel-tab]')) {
      panelTab = e.target.closest('[data-panel-tab]').dataset.panelTab;
      const body = document.getElementById('panelBody');
      document.querySelectorAll('[data-panel-tab]').forEach(b => b.classList.toggle('is-active', b.dataset.panelTab === panelTab));
      if (body) body.innerHTML = panelBody(r);
      return;
    }
    if (e.target.closest('[data-next]')) return next(1);
    if (e.target.closest('[data-prev]')) return next(-1);
    if (e.target.closest('[data-play]')) {
      playing = !playing;
      document.querySelectorAll('[data-play]').forEach(b => { if (b.classList.contains('pulse-ring') || b.querySelector('.pulse-ring')) b.querySelector('.pulse-ring').innerHTML = N.ic(playing ? 'pause' : 'play'); });
      return;
    }
    if (e.target.closest('[data-mute]')) {
      muted = !muted;
      document.querySelectorAll('[data-mute]').forEach(b => { b.innerHTML = N.ic(muted ? 'volumeOff' : 'volume'); });
      N.toast(muted ? 'Muted' : 'Sound on');
      return;
    }
    if (e.target.closest('[data-cc]')) {
      cc = !cc;
      document.querySelectorAll('[data-cc]').forEach(b => b.style.color = cc ? '#d9c7ff' : '');
      N.toast(cc ? 'Captions on' : 'Captions off');
      return;
    }
    if (e.target.closest('[data-speed]')) {
      const options = ['1x', '1.5x', '2x'];
      speed = options[(options.indexOf(speed) + 1) % options.length];
      document.querySelectorAll('[data-speed]').forEach(b => b.textContent = speed);
      return;
    }
    if (e.target.closest('[data-like]')) {
      const slide = e.target.closest('[data-slide]');
      const target = slide ? reels[+slide.dataset.slide] : r;
      target.liked = !target.liked;
      target.likes += target.liked ? 1 : -1;
      document.querySelectorAll('[data-like]').forEach(b => {
        const s = b.closest('[data-slide]');
        const rr = s ? reels[+s.dataset.slide] : r;
        if (rr !== target) return;
        b.classList.toggle('is-on', target.liked);
        const c = b.querySelector('[data-like-count]');
        if (c) c.textContent = N.fmt(target.likes);
      });
      return;
    }
    if (e.target.closest('[data-save]')) {
      const slide = e.target.closest('[data-slide]');
      const target = slide ? reels[+slide.dataset.slide] : r;
      target.saved = !target.saved;
      document.querySelectorAll('[data-save]').forEach(b => {
        const s = b.closest('[data-slide]');
        const rr = s ? reels[+s.dataset.slide] : r;
        if (rr === target) b.classList.toggle('is-on', target.saved);
      });
      N.toast(target.saved ? 'Reel saved' : 'Removed from saved');
      return;
    }
    if (e.target.closest('[data-follow]') || e.target.closest('[data-follow-panel]')) {
      const u = N.user(r.user);
      u.following = !u.following;
      document.querySelectorAll('[data-follow-panel]').forEach(b => { b.textContent = u.following ? 'Following' : 'Follow'; b.classList.toggle('btn--ghost', u.following); b.classList.toggle('btn--primary', !u.following); });
      N.toast(u.following ? `Following ${u.name}` : `Unfollowed ${u.name}`);
      return;
    }
    if (e.target.closest('[data-use-audio]')) return useAudio();
    if (e.target.closest('[data-share]')) return shareSheet(r);
    if (e.target.closest('[data-reel-menu]')) return actionSheet(r);
    if (e.target.closest('[data-comments]')) return commentsSheet(r);
    if (e.target.closest('[data-tip]')) return tipSheet(r);
    if (e.target.closest('[data-send-comment]')) {
      const input = document.getElementById('reelCommentInput');
      const v = input && input.value.trim();
      if (!v) return N.toast('Write something first');
      comments.push({ user:'me', time:'now', likes:0, text:v });
      input.value = '';
      const body = document.getElementById('panelBody');
      if (body) body.innerHTML = panelBody(r);
      r.comments += 1;
      N.toast('Comment added');
      return;
    }
    if (e.target.closest('[data-reply]')) return N.toast('Reply thread opened');
    if (e.target.closest('[data-like-comment]')) {
      const btn = e.target.closest('[data-like-comment]');
      const n = btn.querySelector('span');
      const on = !btn.classList.contains('is-on');
      btn.classList.toggle('is-on', on);
      n.textContent = (+n.textContent) + (on ? 1 : -1);
      return;
    }
    if (e.target.closest('[data-emoji]')) return N.toast('Emoji picker opening soon');
    if (e.target.closest('[data-gif]')) return N.toast('GIF search opening soon');
    if (e.target.closest('[data-remix]')) return N.toast('Remix studio opening soon');
    if (e.target.closest('[data-feed-tab]')) {
      document.querySelectorAll('[data-feed-tab]').forEach(b => b.classList.toggle('is-active', b === e.target.closest('[data-feed-tab]')));
      N.toast('Switched to ' + e.target.closest('[data-feed-tab]').textContent);
      return;
    }
  });

  // double-tap heart / tap-to-navigate on mobile
  let lastTap = 0;
  document.addEventListener('click', function (e) {
    const slide = e.target.closest('.reel-slide');
    if (!slide) return;
    if (e.target.closest('button') || e.target.closest('a')) return;
    const now = Date.now();
    if (now - lastTap < 320) {
      const r = reels[+slide.dataset.slide];
      if (!r.liked) { r.liked = true; r.likes += 1; }
      const heart = document.createElement('div');
      heart.className = 'heart-burst';
      heart.style.left = e.clientX + 'px';
      heart.style.top = e.clientY + 'px';
      heart.innerHTML = N.ic('heart');
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 1000);
      document.querySelectorAll('.reel-slide').forEach(s => {
        if (+s.dataset.slide === +slide.dataset.slide) {
          const b = s.querySelector('[data-like]');
          if (b) { b.classList.add('is-on'); const c = b.querySelector('[data-like-count]'); if (c) c.textContent = N.fmt(r.likes); }
        }
      });
    }
    lastTap = now;
  });

  // keyboard
  document.addEventListener('keydown', function (e) {
    if (/input|textarea/i.test(document.activeElement.tagName)) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); next(1); }
    if (e.key === 'ArrowUp') { e.preventDefault(); next(-1); }
    if (e.key === ' ') { e.preventDefault(); document.querySelector('[data-play]').click(); }
    if (e.key.toLowerCase() === 'm') document.querySelector('[data-mute]').click();
  });

  // mobile scroll spy
  const feed = document.getElementById('reelFeed');
  if (feed && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting && en.intersectionRatio > .6) index = +en.target.dataset.slide; });
    }, { threshold:[0, .6, 1] });
    feed.querySelectorAll('.reel-slide').forEach(s => io.observe(s));
  }

  N.reveal();
});
