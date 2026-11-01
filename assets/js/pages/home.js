/* Nusumo — Home feed */
N.ready(function () {
  const D = N.D;
  let tab = 'foryou';
  let extra = 0;

  const postComments = [
    { user:'ayesha', time:'1h', text:'This is the part most teams skip — the sketch before the system. Beautiful.' },
    { user:'rafi', time:'48m', text:'The light in that second frame is unreal. What time of day was it?' },
    { user:'devon', time:'22m', text:'Saving this for our next design review.' }
  ];

  function postCard(p) {
    const u = N.user(p.user);
    let mediaBlock = '';
    if (p.media) {
      if (p.media.ratio === 'grid') {
        mediaBlock = `<div class="post__media post__media--grid">
          ${(p.media.grid || ['violet','ruby']).map(g => N.media(g)).join('')}
        </div>`;
      } else {
        mediaBlock = `<div class="post__media ${p.media.ratio === 'square' ? 'post__media--tall' : ''}">
          ${N.media(p.media.grad)}
          ${p.media.duration ? `<div class="post__badge"><span class="badge badge--violet">${N.ic('video')} Video</span></div>
          <div class="post__play"><span>${N.ic('play')}</span></div>
          <div class="post__duration">${p.media.duration}</div>` : ''}
        </div>`;
      }
    }
    const linkBlock = p.link ? `<a class="post__link" href="#" data-open-post="${p.id}">
        <span class="thumb">${N.media(p.link.grad)}</span>
        <span class="grow"><span class="domain">${N.esc(p.link.domain)}</span><span class="title">${N.esc(p.link.title)}</span></span>
        ${N.ic('chevronRight')}
      </a>` : '';

    return `<article class="post reveal" data-post="${p.id}">
      <div class="post__head">
        ${N.av(u, 36, 'av--hair')}
        <div class="post__who">
          <div class="post__name">${N.esc(u.name)}${u.verified ? N.verified() : ''}</div>
          <div class="post__sub"><span class="post__role">${N.esc(u.role)}</span><span>${p.time}</span>${p.audience && p.audience !== 'public' ? `<span class="dot-sep"></span><span>${N.ic(p.audience === 'me' ? 'lock' : (p.audience === 'subscribers' ? 'diamond' : 'users'))}</span><span>${p.audience === 'friends' ? 'Friends' : (p.audience === 'me' ? 'Only me' : 'Subscribers')}</span>` : ''}${p.location ? `<span class="dot-sep"></span><span>${N.ic('location')}</span><span>${N.esc(p.location)}</span>` : ''}</div>
        </div>
        <button class="icon-btn" data-post-menu="${p.id}" aria-label="Post options">${N.ic('more')}</button>
      </div>
      <div class="post__body">
        <p>${N.esc(p.text)}</p>
        ${p.tags ? `<div class="post__tags">${p.tags.map(t => `<span class="tag">${N.esc(t)}</span>`).join('')}</div>` : ''}
      </div>
      ${mediaBlock}
      ${linkBlock}
      <div class="post__meta">
        <span class="row">${N.ic('heart')} <b data-reactions style="font-weight:600;color:var(--muted)">${N.fmt(p.reactions)}</b> reactions</span>
        <span class="dot-sep"></span>
        <span>${p.comments} comments</span>
      </div>
      <div class="post__foot">
        <button class="act ${p.liked ? 'is-on' : ''}" data-like="${p.id}">${N.ic('heart')}<span>Like</span></button>
        <button class="act" data-comment="${p.id}">${N.ic('comment')}<span>Comment</span></button>
        <button class="act" data-share="${p.id}">${N.ic('share')}<span>Share</span></button>
        <button class="act act--end ${p.saved ? 'is-saved' : ''}" data-save="${p.id}" aria-label="Save post">${N.ic('bookmark')}<span>Save</span></button>
      </div>
    </article>`;
  }

  function visiblePosts() {
    let list = D.posts.slice();
    if (tab === 'following') list = list.filter(p => N.user(p.user).following || p.user === 'me');
    if (tab === 'new') list = list.slice(0, 3);
    return list;
  }

  function renderFeed() {
    const host = document.getElementById('feedList');
    if (!host) return;
    let list = visiblePosts();
    let extraList = [];
    if (extra > 0 && tab !== 'new') extraList = D.posts.slice(0, extra).map((p, i) => ({ ...p, id:p.id + '-more' + i, time:(i + 2) + 'd' }));
    if (!list.length) {
      host.innerHTML = `<div class="card empty"><div class="empty__icon">${N.ic('users')}</div><h3>Nothing here yet</h3><p>Follow a few creators and their posts will show up in this tab.</p><div class="empty__actions"><a class="btn btn--primary" href="members.html">Find creators</a></div></div>`;
      return;
    }
    host.innerHTML = list.map(postCard).join('') + extraList.map(postCard).join('') + `
      <button class="btn btn--ghost btn--block" data-load-more style="height:40px">Load more posts</button>`;
    N.reveal(host);
  }

  function rail() {
    return `<aside class="rail">
      <section class="rail-card reveal">
        <div class="rail-card__head"><h3>Upcoming rooms</h3><a class="link" href="audio-rooms.html">See all</a></div>
        <div class="rail-card__body">
          ${D.upcoming.map(r => `<div class="room-mini">
            <div class="room-mini__time">${r.time}<span>${r.ampm}</span></div>
            <div class="room-mini__meta">
              <div class="room-mini__title">${N.esc(r.title)}</div>
              <div class="room-mini__host">Hosted by ${N.esc(N.user(r.host).name)}</div>
            </div>
            <button class="icon-btn" data-remind="${N.esc(r.title)}" aria-label="Remind me">${N.ic('bell')}</button>
          </div>`).join('')}
        </div>
      </section>

      <section class="rail-card reveal">
        <div class="rail-card__head"><h3>People to follow</h3><a class="link" href="members.html">See all</a></div>
        <div class="rail-card__body" id="peopleRail"></div>
      </section>

      <section class="rail-card reveal">
        <div class="rail-card__head"><h3>Trending audio</h3><a class="link" href="reels.html">Reels</a></div>
        <div class="rail-card__body">
          ${D.tracks.map(t => `<div class="track">
            <span class="track__art">${N.media(t.grad)}${N.ic('play')}</span>
            <span class="track__meta"><span class="track__name">${N.esc(t.name)}</span><span class="track__sub">${N.esc(t.artist)} · ${t.length}</span></span>
            <button class="track__play" data-track="${N.esc(t.name)}" aria-label="Play">${N.ic('play')}</button>
          </div>`).join('')}
        </div>
      </section>

      <div class="row row--wrap" style="gap:12px;font-size:10.5px;color:var(--faint);padding:2px 4px">
        <a href="settings.html">Settings</a><a href="#">Privacy</a><a href="#">Terms</a><span>© 2026 Nusumo</span>
      </div>
    </aside>`;
  }

  const people = ['farhan', 'lamia', 'zeeshan'];
  function peopleRail() {
    const host = document.getElementById('peopleRail');
    if (!host) return;
    host.innerHTML = people.map(id => {
      const u = N.user(id);
      return `<div class="person-row">
        ${N.av(u, 36, 'av--hair')}
        <div class="person-row__meta"><div class="person-row__name">${N.esc(u.name)}${u.verified ? N.verified() : ''}</div><div class="person-row__sub">${N.esc(u.role)}</div></div>
        <button class="btn btn--ghost btn--sm" data-follow="${id}" data-name="${N.esc(u.name)}">Follow</button>
      </div>`;
    }).join('');
  }

  const storiesStrip = `<section class="card" style="padding:12px 14px;margin-bottom:2px">
      <div style="display:flex;align-items:center;gap:12px;overflow-x:auto;scrollbar-width:none">
        <a href="stories.html" style="display:flex;flex-direction:column;align-items:center;gap:5px;flex-shrink:0;text-decoration:none">
          <span style="width:52px;height:52px;border-radius:50%;display:grid;place-items:center;padding:2px;background:rgba(var(--overlay-rgb),.1);position:relative">
            ${N.av('me', 46, 'av--hair')}<span style="position:absolute;right:0;bottom:0;width:18px;height:18px;border-radius:50%;background:var(--grad);color:#180a26;display:grid;place-items:center;border:2px solid var(--bg)">${N.ic('plus')}</span>
          </span>
          <span style="font-size:9.5px;color:var(--muted)">Your story</span>
        </a>
        ${(D.stories||[]).slice(0,8).map(s=>`<a href="story.html?id=${s.id}" style="display:flex;flex-direction:column;align-items:center;gap:5px;flex-shrink:0;text-decoration:none">
          <span style="width:52px;height:52px;border-radius:50%;display:grid;place-items:center;padding:2px;background:${s.viewed?'rgba(var(--overlay-rgb),.1)':'linear-gradient(135deg,#a678ff,#ff6ad5)'}">
            ${N.av(s.user, 46, 'av--hair')}
          </span>
          <span style="font-size:9.5px;color:var(--muted);max-width:52px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${N.esc(N.user(s.user).name.split(' ')[0])}</span>
        </a>`).join('')}
      </div>
    </section>`;
  N.view.innerHTML = `<div class="page page--tight">
    <div class="home-grid">
      <div class="feed">
        ${storiesStrip}
        <section class="card composer" id="composer">
          <div class="composer__top">
            ${N.av('me', 38, 'av--hair')}
            <button class="composer__open" data-compose>Share something with the community…</button>
          </div>
          <div class="composer__extra">
            <textarea class="textarea" id="composerText" placeholder="What are you building today? Add a photo, a reel or a thought…" rows="3"></textarea>
            <div class="composer__tools" style="display:flex;align-items:center;gap:2px;margin-top:10px;padding-top:10px;border-top:1px solid var(--border);flex-wrap:wrap">
              <button class="composer__action" data-attach="photo">${N.ic('camera')}Photo</button>
              <button class="composer__action" data-attach="video">${N.ic('video')}Video</button>
              <button class="composer__action" data-attach="reel">${N.ic('film')}Reel</button>
              <button class="composer__action" data-attach="poll">${N.ic('sliders')}Poll</button>
              <button class="composer__action" data-attach="live">${N.ic('live')}Go live</button>
              <a class="composer__action" href="audio-rooms.html" style="margin-left:auto">${N.ic('headphones')}Audio room</a>
            </div>
            <div class="composer__foot">
              <label class="composer__audience">
                ${N.ic('globe')}
                <select id="composerAudience" class="composer__audience-select" aria-label="Audience">
                  <option value="public">Public · everyone</option>
                  <option value="friends">Friends · followers</option>
                  <option value="me">Only me</option>
                  <option value="subscribers">Paid subscribers</option>
                </select>
              </label>
              <div class="row" style="gap:6px">
                <button class="btn btn--quiet btn--sm" data-compose-close>Cancel</button>
                <button class="btn btn--primary btn--sm" data-post>Post</button>
              </div>
            </div>
          </div>
        </section>

        <section class="reveal">
          <div class="section-head" style="margin:4px 0 9px">
            <h2 style="display:flex;align-items:center;gap:7px">${N.ic('zap')} Happening now</h2>
            <a class="link" href="hangout.html">See all ${N.ic('chevronRight')}</a>
          </div>
          <div class="happening">
            <a class="mini-live" href="room.html">
              <span class="mini-live__art">${N.media('violet')}${N.ic('headphones')}</span>
              <span class="mini-live__meta">
                <span class="mini-live__eyebrow"><span class="live-dot"></span> Audio room</span>
                <span class="mini-live__title">Portfolio crit — bring one slide</span>
                <span class="mini-live__sub">${N.ic('headphones')} 128 listening</span>
              </span>
              <span class="btn btn--ghost btn--sm">Join</span>
            </a>
            <a class="mini-live" href="watch.html">
              <span class="mini-live__art">${N.media('ruby')}${N.ic('live')}</span>
              <span class="mini-live__meta">
                <span class="mini-live__eyebrow" style="color:#ff9dac"><span class="live-dot" style="background:#ff5470"></span> Live</span>
                <span class="mini-live__title">Studio tour + live Q&amp;A</span>
                <span class="mini-live__sub">${N.ic('eye')} 64 watching</span>
              </span>
              <span class="btn btn--ghost btn--sm">Watch</span>
            </a>
          </div>
        </section>

        <div class="feed-tabs" role="tablist">
          <button class="tab-btn ${tab === 'foryou' ? 'is-active' : ''}" data-tab="foryou">For you</button>
          <button class="tab-btn ${tab === 'following' ? 'is-active' : ''}" data-tab="following">Following</button>
          <button class="tab-btn ${tab === 'new' ? 'is-active' : ''}" data-tab="new">New posts <span class="count">3</span></button>
        </div>

        <div class="feed" id="feedList" style="gap:12px"></div>
      </div>
      ${rail()}
    </div>
  </div>`;

  peopleRail();
  renderFeed();
  N.reveal();

  function expandComposer() {
    const c = document.getElementById('composer');
    c.classList.add('composer--expanded');
    const t = document.getElementById('composerText');
    if (t) setTimeout(() => t.focus(), 40);
  }

  function postCommentSheet(post) {
    const comments = postComments.map((c, i) => ({ ...c, likes:i * 4 + 2, user:c.user }));
    const listHTML = () => comments.map(c => `
      <div class="comment">
        ${N.av(c.user, 32, 'av--hair')}
        <div class="comment__body">
          <div class="comment__head">${N.esc(N.user(c.user).name)}<span class="comment__time">${c.time}</span></div>
          <div class="comment__text">${N.esc(c.text)}</div>
          <div class="comment__actions"><button>Reply</button><button>Like${c.likes ? ` (${c.likes})` : ''}</button></div>
        </div>
      </div>`).join('');

    N.openSheet({
      title:`${post.comments} comments`,
      sub:`On ${N.user(post.user).name}’s post`,
      body:`<div id="postComments" style="display:flex;flex-direction:column;gap:2px">${listHTML()}</div>`,
      foot:`<div class="comment-input">
          ${N.av('me', 32, 'av--hair')}
          <div class="comment-input__field"><input placeholder="Add a comment…" id="sheetCommentInput"></div>
          <button class="send-btn" id="sheetCommentSend" aria-label="Send">${N.ic('send')}</button>
        </div>`,
      onMount(sheet) {
        const input = sheet.querySelector('#sheetCommentInput');
        const send = () => {
          const v = input.value.trim();
          if (!v) return N.toast('Write something first');
          comments.push({ user:'me', time:'now', text:v, likes:0 });
          sheet.querySelector('#postComments').innerHTML = listHTML();
          input.value = '';
          post.comments += 1;
          N.toast('Comment added');
        };
        sheet.querySelector('#sheetCommentSend').addEventListener('click', send);
        input.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
      }
    });
  }

  function postMenu(post, anchor) {
    N.openMenu(anchor, [
      { icon:'bookmark', label:post.saved ? 'Remove from saved' : 'Save post', onClick() { post.saved = !post.saved; renderFeed(); N.toast(post.saved ? 'Saved to your collection' : 'Removed from saved'); } },
      { icon:'link', label:'Copy link', onClick() { N.copy(location.origin + '/post/' + post.id); } },
      { icon:'bell', label:'Notify me about this creator', onClick() { N.toast('Notifications turned on'); } },
      { sep:true },
      { icon:'ban', label:'Not interested', onClick() { N.toast('We’ll show fewer posts like this'); } },
      { icon:'flag', label:'Report post', danger:true, onClick() { N.confirmDialog({ title:'Report this post?', message:'Our moderation team will review it within 24 hours.', confirmLabel:'Report', danger:true, onConfirm() { N.toast('Report submitted'); } }); } }
    ]);
  }

  document.addEventListener('click', function (e) {
    const tabBtn = e.target.closest('[data-tab]');
    if (tabBtn) {
      tab = tabBtn.dataset.tab;
      document.querySelectorAll('[data-tab]').forEach(b => b.classList.toggle('is-active', b === tabBtn));
      renderFeed();
      return;
    }
    if (e.target.closest('[data-compose]')) { expandComposer(); return; }
    const attachBtn = e.target.closest('[data-attach]');
    if (attachBtn) {
      const kind = attachBtn.dataset.attach;
      if (kind === 'live') { location.href = 'studio.html'; return; }
      if (kind === 'photo' || kind === 'video') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = kind === 'photo' ? 'image/*' : 'video/*';
        input.click();
        input.addEventListener('change', () => { if (input.files && input.files[0]) N.toast(kind === 'photo' ? 'Photo attached' : 'Video attached'); });
        return;
      }
      N.toast((kind.charAt(0).toUpperCase() + kind.slice(1)) + ' attached');
      return;
    }
    if (e.target.closest('[data-compose-close]')) {
      document.getElementById('composer').classList.remove('composer--expanded');
      return;
    }
    if (e.target.closest('[data-post]')) {
      const t = document.getElementById('composerText');
      const v = (t && t.value.trim()) || '';
      if (!v) { N.toast('Write something first'); if (t) t.focus(); return; }
      const aud = (document.getElementById('composerAudience') || {}).value || 'public';
      D.posts.unshift({ id:'pm' + Date.now(), user:'me', time:'now', text:v, tags:['#new'], reactions:0, comments:0, saved:false, liked:false, audience:aud });
      if (t) t.value = '';
      document.getElementById('composer').classList.remove('composer--expanded');
      tab = 'foryou';
      document.querySelectorAll('[data-tab]').forEach(b => b.classList.toggle('is-active', b.dataset.tab === 'foryou'));
      renderFeed();
      N.toast('Post shared with the community');
      return;
    }
    const likeBtn = e.target.closest('[data-like]');
    if (likeBtn) {
      const p = D.posts.find(x => x.id === likeBtn.dataset.like);
      if (!p) return;
      p.liked = !p.liked;
      p.reactions += p.liked ? 1 : -1;
      likeBtn.classList.toggle('is-on', p.liked);
      const article = likeBtn.closest('.post');
      const reactions = article && article.querySelector('[data-reactions]');
      if (reactions) reactions.textContent = N.fmt(p.reactions);
      return;
    }
    const saveBtn = e.target.closest('[data-save]');
    if (saveBtn) {
      const p = D.posts.find(x => x.id === saveBtn.dataset.save);
      if (!p) return;
      p.saved = !p.saved;
      saveBtn.classList.toggle('is-saved', p.saved);
      N.toast(p.saved ? 'Saved to your collection' : 'Removed from saved');
      return;
    }
    const commentBtn = e.target.closest('[data-comment]');
    if (commentBtn) {
      const p = D.posts.find(x => x.id === commentBtn.dataset.comment) || D.posts[0];
      return postCommentSheet(p);
    }
    const shareBtn = e.target.closest('[data-share]');
    if (shareBtn) {
      return N.openSheet({
        title:'Share post', sub:'Send it somewhere good',
        body:`<div class="more-grid">
          <button class="more-tile" data-share-to="Chats">${N.ic('chat')}<span>Send to chat</span></button>
          <button class="more-tile" data-share-to="Story">${N.ic('plus')}<span>Share to story</span></button>
          <button class="more-tile" data-share-to="Link">${N.ic('link')}<span>Copy link</span></button>
          <button class="more-tile" data-share-to="X">${N.ic('share')}<span>Post to X</span></button>
        </div>`,
        onMount(sheet) {
          sheet.querySelectorAll('[data-share-to]').forEach(b => b.addEventListener('click', () => {
            if (b.dataset.shareTo === 'Link') N.copy(location.href);
            else N.toast('Shared to ' + b.dataset.shareTo);
            N.closeSheet();
          }));
        }
      });
    }
    const openPost = e.target.closest('[data-open-post]');
    if (openPost) {
      e.preventDefault();
      const p = D.posts.find(x => x.id === openPost.dataset.openPost);
      if (!p) return;
      return N.openSheet({
        title:N.user(p.user).name, sub:p.time + ' · ' + (p.location || 'Nusumo'),
        body:`<div style="border-radius:12px;overflow:hidden;aspect-ratio:16/9;position:relative">${N.media(p.media ? p.media.grad : 'violet')}</div>
          <p style="font-size:13px;line-height:1.7;color:#d5cfdd;margin-top:12px">${N.esc(p.text)}</p>
          <div class="post__tags" style="margin-top:10px">${(p.tags || []).map(t => `<span class="tag">${N.esc(t)}</span>`).join('')}</div>`
      });
    }
    const moreBtn = e.target.closest('[data-post-menu]');
    if (moreBtn) {
      const p = D.posts.find(x => x.id === moreBtn.dataset.postMenu);
      if (p) postMenu(p, moreBtn);
      return;
    }
    const followBtn = e.target.closest('[data-follow]');
    if (followBtn) {
      const id = followBtn.dataset.follow;
      const u = N.user(id);
      u.following = !u.following;
      followBtn.textContent = u.following ? 'Following' : 'Follow';
      followBtn.classList.toggle('btn--ghost', !u.following);
      followBtn.classList.toggle('btn--outline', u.following);
      N.toast(u.following ? `Following ${u.name}` : `Unfollowed ${u.name}`);
      return;
    }
    if (e.target.closest('[data-load-more]')) {
      const btn = e.target.closest('[data-load-more]');
      btn.textContent = 'Loading…';
      setTimeout(() => {
        extra = Math.min(extra + 2, 4);
        renderFeed();
        N.reveal();
      }, 500);
      return;
    }
    const remind = e.target.closest('[data-remind]');
    if (remind) { N.toast('Reminder set for ' + remind.dataset.remind); return; }
    const track = e.target.closest('[data-track]');
    if (track) { N.toast('Now playing: ' + track.dataset.track); return; }
  });
});
