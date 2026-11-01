/* Nusumo — Profile */
N.ready(function () {
  const D = N.D;
  const visitor = N.Q.get('visitor') === '1';
  const u = visitor ? D.users.ayesha : D.users.me;

  // editable local state for own profile
  const state = {
    name: u.name, handle: u.handle, bio: u.role + ' · building in public',
    location: 'Dhaka, Bangladesh', website: 'nusumo.app/' + u.handle.replace('@',''),
    status: visitor ? 'Streaming weekly · new EP out Friday' : 'Designing Nusumo · open to collabs',
    following: !!u.following
  };

  let tab = N.Q.get('tab') || 'posts';

  const posts = (D.posts || []).filter(p => p.user === u.id || !visitor).slice(0, 6);
  const reels = (D.reels || []).slice(0, 6);
  const rooms = (D.rooms || []).slice(0, 4);

  const similar = ['rafi','farah','kavita','zeeshan'].map(id => D.users[id]);

  function heroHTML() {
    return `<div class="profile-hero" data-hero>
      <div class="profile-banner">
        ${visitor ? '' : `<button class="profile-cam" data-banner-cam aria-label="Change banner" style="opacity:1;transform:none;right:12px;top:12px">${N.ic('camera')}</button>`}
      </div>
      <div class="profile-head">
        <div class="profile-avatar-wrap" data-av-wrap>
          ${N.av(u.id, 104, 'av--gap')}
          ${visitor ? '' : `<button class="profile-cam" data-avatar-cam aria-label="Change photo">${N.ic('camera')}</button>`}
        </div>
        <div class="profile-title-row">
          <div style="min-width:0;flex:1">
            <div class="profile-name">${N.esc(state.name)}${u.verified ? N.verified() : ''}</div>
            <div class="profile-handle">${N.esc(state.handle)} <span class="dot-sep"></span> ${N.esc(state.bio.split('·')[0].trim())}</div>
            <div class="profile-status">${N.ic('live')}${N.esc(state.status)}</div>
          </div>
          <div class="profile-actions">
            ${visitor
              ? `<button class="btn ${state.following ? 'btn--ghost' : 'btn--primary'} btn--sm" data-follow>${state.following ? 'Following' : 'Follow'}</button>
                 <button class="btn btn--ghost btn--sm" data-message>${N.ic('chat')}Message</button>
                  <button class="btn btn--ghost btn--sm" data-request-exclusive>${N.ic('gift')}Request exclusive</button>
                  <button class="btn btn--primary btn--sm" data-subscribe-creator>${N.ic('lock')}Subscribe</button>
                 <button class="icon-btn" data-more aria-label="More">${N.ic('more')}</button>`
              : `<button class="btn btn--primary btn--sm" data-edit>${N.ic('settings')}Edit profile</button>
                 <button class="btn btn--ghost btn--sm" data-share>${N.ic('share')}Share</button>
                 <button class="icon-btn" data-more aria-label="More">${N.ic('more')}</button>`}
          </div>
        </div>
        <div class="profile-bio">${N.esc(state.bio)}</div>
        <div class="profile-meta">
          <span class="row">${N.ic('location')}${N.esc(state.location)}</span>
          <span class="row">${N.ic('link')}${N.esc(state.website)}</span>
          <span class="row">${N.ic('calendar')}Joined March 2024</span>
          <span class="row">${N.ic('users')}${u.followers} followers</span>
        </div>
        <div class="profile-stats">
          <a class="profile-stat" href="#posts"><b>${posts.length * 12 + 4}</b> Posts</a>
          <a class="profile-stat" href="#reels"><b>${reels.length * 3 + 1}</b> Reels</a>
          <a class="profile-stat" href="#rooms"><b>${rooms.length}</b> Rooms</a>
          <a class="profile-stat" href="#"><b>${u.followers}</b> Followers</a>
          <a class="profile-stat" href="#"><b>1.1K</b> Following</a>
        </div>
        <div class="tabs profile-tabs" role="tablist">
          ${[['posts','Posts', posts.length],['reels','Reels', reels.length],['rooms','Audio rooms', rooms.length],['about','About', null]].map(([k,l,c]) =>
            `<button class="tab-btn ${tab === k ? 'is-active' : ''}" data-tab="${k}" role="tab" aria-selected="${tab === k}">${l}${c != null ? `<span class="count">${c}</span>` : ''}</button>`).join('')}
        </div>
      </div>
    </div>`;
  }

  function postsHTML() {
    if (!posts.length) return emptyState('posts');
    return `<div class="post-grid">${posts.map(p => {
      const pu = N.user(p.user);
      return `<article class="mini-post">
        <div class="mini-post__media">${p.media ? N.media(p.media.grad) : (p.link ? N.media(p.link.grad) : N.media('violet'))}${p.saved ? `<span class="mini-post__badge badge badge--violet">${N.ic('bookmark')}</span>` : ''}</div>
        <div class="mini-post__body">
          <div class="mini-post__cap">${N.esc(p.body)}</div>
          <div class="mini-post__foot">
            <span class="row">${N.ic('heart')}${p.reactions}</span>
            <span class="row">${N.ic('comment')}${p.comments}</span>
            <span style="margin-left:auto">${N.ts ? '' : ''}${p.time}</span>
          </div>
        </div>
      </article>`;
    }).join('')}</div>`;
  }

  function reelsHTML() {
    if (!reels.length) return emptyState('reels');
    return `<div class="reel-grid">${reels.map(r => `
      <a class="reel-tile" href="reels.html">
        ${N.media(r.grad)}
        <span class="reel-tile__views">${N.ic('eye')}${r.views}</span>
        <span class="reel-tile__badge">${r.time}</span>
      </a>`).join('')}</div>`;
  }

  function roomsHTML() {
    if (!rooms.length) return emptyState('rooms');
    return `<div style="display:flex;flex-direction:column;gap:0">${rooms.map(r => {
      const ru = N.user(r.user);
      return `<div class="hosted-row">
        <div class="hosted-row__art">${N.ic('headphones')}</div>
        <div class="hosted-row__meta">
          <div class="hosted-row__title">${N.esc(r.title)}</div>
          <div class="hosted-row__sub">
            <span class="live-badge" style="height:16px;font-size:8.5px"><i class="live-dot"></i>Live</span>
            <span class="dot-sep"></span><span>${N.esc(ru.name)}</span>
            <span class="dot-sep"></span><span class="row" style="gap:3px">${N.ic('users')}${r.listeners}</span>
          </div>
        </div>
        <button class="btn btn--ghost btn--sm" onclick="location.href='room.html?id=${r.id}'">Join</button>
      </div>`;
    }).join('')}</div>`;
  }

  function aboutHTML() {
    return `<div class="about-block">
      <div class="row">${N.ic('user')}<b style="color:#fff;font-weight:600">${N.esc(state.name)}</b></div>
      <div style="margin-top:8px;font-size:12.5px;line-height:1.7;color:var(--muted)">${N.esc(state.bio)}. ${visitor ? 'I host weekly streams on motion design and product craft. Say hi in the chat.' : 'I design the Nusumo experience and host weekly sessions on product craft and motion.'}</div>
    </div>
    <div class="about-block">
      <div style="font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--faint);font-weight:650;margin-bottom:8px">Details</div>
      <div class="row">${N.ic('location')}<span>${N.esc(state.location)}</span></div>
      <div class="row">${N.ic('link')}<a href="#" style="color:var(--violet-soft)">${N.esc(state.website)}</a></div>
      <div class="row">${N.ic('calendar')}<span>Joined March 2024</span></div>
      <div class="row">${N.ic('mail')}<span>${state.handle.replace('@','')}@nusumo.app</span></div>
    </div>
    <div class="about-block">
      <div style="font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--faint);font-weight:650;margin-bottom:8px">Interests</div>
      <div class="row--wrap" style="gap:6px">${['Motion design','Audio','Product craft','Open source','Community'].map(t => `<span class="chip chip--sm">${t}</span>`).join('')}</div>
    </div>`;
  }

  function emptyState(kind) {
    return `<div style="text-align:center;padding:60px 12px;color:var(--faint);font-size:12px">
      ${N.ic('info')}<div style="margin-top:8px">No ${kind} yet.</div></div>`;
  }

  function tabContent() {
    if (tab === 'posts') return postsHTML();
    if (tab === 'reels') return reelsHTML();
    if (tab === 'rooms') return roomsHTML();
    return aboutHTML();
  }

  function rightRail() {
    return `<div class="stack">
      <div class="card" style="padding:16px">
        <h3 style="font-size:12.5px;font-weight:650;margin-bottom:10px">About</h3>
        <div class="about-block" style="border:0;padding:0;margin:0">
          <div class="row" style="font-size:11.5px;margin-bottom:7px">${N.ic('location')}<span>${N.esc(state.location)}</span></div>
          <div class="row" style="font-size:11.5px;margin-bottom:7px">${N.ic('link')}<a href="#" style="color:var(--violet-soft)">${N.esc(state.website)}</a></div>
          <div class="row" style="font-size:11.5px;margin-bottom:7px">${N.ic('calendar')}<span>Joined March 2024</span></div>
          <div class="row" style="font-size:11.5px">${N.ic('users')}<span>${u.followers} followers</span></div>
        </div>
      </div>
      <div class="card" style="padding:16px">
        <h3 style="font-size:12.5px;font-weight:650;margin-bottom:10px">Shared media</h3>
        <div class="shared-grid">
          ${Array.from({length:6}, (_, i) => `<div class="media media--${['violet','rose','sunset','ocean','amber','ruby'][i]}"></div>`).join('')}
        </div>
      </div>
      <div class="card" style="padding:16px">
        <h3 style="font-size:12.5px;font-weight:650;margin-bottom:10px">Similar creators</h3>
        <div style="display:flex;flex-direction:column;gap:2px">
          ${similar.map(su => `
            <a href="profile.html?visitor=1" style="display:flex;align-items:center;gap:9px;padding:7px 0;border-bottom:1px solid var(--border)">
              ${N.av(su.id, 30, 'av--hair')}
              <div style="min-width:0;flex:1">
                <div style="font-size:12px;font-weight:600">${N.esc(su.name)}${su.verified ? N.verified() : ''}</div>
                <div style="font-size:10px;color:var(--faint)">${su.handle} · ${su.followers}</div>
              </div>
              <button class="btn btn--ghost btn--sm" style="height:26px;padding:0 9px;font-size:10.5px" data-follow-sim="${su.id}">Follow</button>
            </a>`).join('')}
        </div>
      </div>
    </div>`;
  }

  N.view.innerHTML = `<div class="page page--tight">
    ${heroHTML()}
    <div class="profile-layout">
      <div class="profile-main">
        <div class="tabs" style="border-bottom:1px solid var(--border);margin-bottom:14px">
          ${[['posts','Posts', posts.length],['reels','Reels', reels.length],['rooms','Audio rooms', rooms.length],['about','About', null]].map(([k,l,c]) =>
            `<button class="tab-btn ${tab === k ? 'is-active' : ''}" data-tab="${k}">${l}${c != null ? `<span class="count">${c}</span>` : ''}</button>`).join('')}
        </div>
        ${tabContent()}
      </div>
      <aside class="profile-rail">${rightRail()}</aside>
    </div>
    <div class="sticky-profile" data-sticky>
      ${N.av(u.id, 34, 'av--hair')}
      <div><div class="sticky-profile__name">${N.esc(state.name)}</div><div class="sticky-profile__sub">${N.esc(state.handle)} · ${N.esc(state.bio.split('·')[0].trim())}</div></div>
      <div class="tabs">
        ${[['posts','Posts'],['reels','Reels'],['rooms','Rooms'],['about','About']].map(([k,l]) =>
          `<button class="tab-btn ${tab === k ? 'is-active' : ''}" data-tab="${k}">${l}</button>`).join('')}
      </div>
    </div>
  </div>`;

  N.reveal();

  // sticky header on scroll
  const hero = N.view.querySelector('[data-hero]');
  const sticky = N.view.querySelector('[data-sticky]');
  if (hero && sticky) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => sticky.classList.toggle('is-on', !e.isIntersecting));
    }, { threshold: 0.1 });
    io.observe(hero);
  }

  function rerender() { /* re-run page by reloading state via location */ location.reload(); }

  // tab switching (in-place)
  function setTab(next) {
    tab = next;
    // update tab buttons
    N.view.querySelectorAll('[data-tab]').forEach(b => {
      const on = b.dataset.tab === tab;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', String(on));
    });
    // replace tab content area: find the container after tabs in profile-main
    const main = N.view.querySelector('.profile-main');
    // remove old content (everything after tabs)
    const tabs = main.querySelector('.tabs');
    let sib = tabs.nextElementSibling;
    while (sib) { const n = sib.nextElementSibling; sib.remove(); sib = n; }
    const div = document.createElement('div');
    div.innerHTML = tabContent();
    main.appendChild(div);
    // sticky tabs too
    const st = N.view.querySelector('.sticky-profile');
    st.querySelectorAll('[data-tab]').forEach(b => b.classList.toggle('is-active', b.dataset.tab === tab));
  }

  N.view.addEventListener('click', (e) => {
    const tb = e.target.closest('[data-tab]');
    if (tb) { setTab(tb.dataset.tab); return; }

    if (e.target.closest('[data-edit]')) { editSheet(); return; }
    if (e.target.closest('[data-avatar-cam]') || e.target.closest('[data-banner-cam]')) { photoSheet(); return; }
    if (e.target.closest('[data-follow]')) {
      state.following = !state.following;
      const b = e.target.closest('[data-follow]');
      b.textContent = state.following ? 'Following' : 'Follow';
      b.classList.toggle('btn--primary', !state.following);
      b.classList.toggle('btn--ghost', state.following);
      N.toast(state.following ? 'Following ' + state.name : 'Unfollowed');
      return;
    }
    if (e.target.closest('[data-message]')) {
      N.openSheet({ title:'Message ' + state.name.split(' ')[0], sub: state.handle,
        body:`<div class="field"><label for="msgText">Message</label><textarea class="textarea" id="msgText" rows="4" placeholder="Say hi…"></textarea></div>`,
        foot:`<button class="btn btn--primary btn--block" data-send-msg>${N.ic('send')}Send</button>`,
        onMount(s){ s.querySelector('[data-send-msg]').addEventListener('click', ()=>{ N.closeSheet(); N.toast('Message sent'); }); }
      });
      return;
    }
    if (e.target.closest('[data-request-exclusive]')) {
      location.href = 'requests.html';
      return;
    }
    if (e.target.closest('[data-subscribe-creator]')) {
      location.href = 'exclusive.html';
      return;
    }
    if (e.target.closest('[data-share]')) {
      N.openSheet({ title:'Share profile', sub: state.handle,
        body:`<div class="gift-grid">${[['link','Copy link'],['chat','Send in chat'],['globe','Post']].map(([ic,l])=>`<button class="gift" data-share-to="${l}"><span class="gift__glyph">${N.ic(ic)}</span><span>${l}</span></button>`).join('')}</div>`,
        foot:`<button class="btn btn--primary btn--block" data-copy>Copy link</button>`,
        onMount(s){ s.querySelector('[data-copy]').addEventListener('click',()=>N.copy(location.origin+'/profile/'+state.handle.replace('@',''))); s.querySelectorAll('[data-share-to]').forEach(x=>x.addEventListener('click',()=>{N.closeSheet();N.toast('Shared');})); }
      });
      return;
    }
    if (e.target.closest('[data-more]')) {
      N.openMenu(e.target.closest('[data-more]'), [
        { icon:'link', label:'Copy profile link', onClick(){ N.copy(location.origin+'/profile/'+state.handle.replace('@','')); } },
        { icon:'bell', label:'Turn on notifications', onClick(){ N.toast('Notifications on'); } },
        { icon:'flag', label:'Report profile', danger:true, onClick(){ N.toast('Report submitted'); } }
      ]);
      return;
    }
  });

  function editSheet() {
    N.openSheet({ tall:true, title:'Edit profile', sub:'Update how people see you',
      body:`<div class="field"><label for="eName">Name</label><input class="input" id="eName" value="${N.esc(state.name)}"></div>
        <div class="field"><label for="eHandle">Handle</label><input class="input" id="eHandle" value="${N.esc(state.handle)}"></div>
        <div class="field"><label for="eBio">Bio</label><textarea class="textarea" id="eBio" rows="3">${N.esc(state.bio)}</textarea></div>
        <div class="field"><label for="eStatus">Status</label><input class="input" id="eStatus" value="${N.esc(state.status)}"></div>
        <div class="field"><label for="eLoc">Location</label><input class="input" id="eLoc" value="${N.esc(state.location)}"></div>
        <div class="field"><label for="eWeb">Website</label><input class="input" id="eWeb" value="${N.esc(state.website)}"></div>`,
      foot:`<button class="btn btn--primary btn--block" data-save-profile>${N.ic('check')}Save changes</button>`,
      onMount(s) {
        s.querySelector('[data-save-profile]').addEventListener('click', () => {
          state.name = s.querySelector('#eName').value.trim() || state.name;
          state.handle = s.querySelector('#eHandle').value.trim() || state.handle;
          state.bio = s.querySelector('#eBio').value.trim() || state.bio;
          state.status = s.querySelector('#eStatus').value.trim() || state.status;
          state.location = s.querySelector('#eLoc').value.trim() || state.location;
          state.website = s.querySelector('#eWeb').value.trim() || state.website;
          N.closeSheet();
          N.toast('Profile updated');
          // update hero text in place
          N.view.querySelector('.profile-name').firstChild.textContent = state.name + ' ';
          N.view.querySelector('.profile-handle').firstChild.textContent = state.handle + ' ';
          N.view.querySelector('.profile-bio').textContent = state.bio;
          N.view.querySelector('.profile-status').lastChild.textContent = state.status;
        });
      }
    });
  }

  function photoSheet() {
    N.openSheet({ title:'Change photo', sub:'Upload a new profile picture',
      body:`<div style="display:grid;place-items:center;padding:18px 0">
          <div class="profile-avatar-wrap" style="margin:0">${N.av(u.id, 104, 'av--gap')}</div>
        </div>
        <div class="gift-grid">
          ${[['camera','Take photo'],['download','Upload file'],['user','Use avatar']].map(([ic,l])=>`<button class="gift" data-photo-opt="${l}"><span class="gift__glyph">${N.ic(ic)}</span><span>${l}</span></button>`).join('')}
        </div>
        <div class="field" style="margin-top:14px"><label>Crop</label>
          <div style="aspect-ratio:1;border-radius:12px;border:1px dashed var(--border);display:grid;place-items:center;color:var(--faint);font-size:11.5px;background:rgba(var(--overlay-rgb),.02)">Drag to reposition</div>
        </div>`,
      foot:`<button class="btn btn--primary btn--block" data-save-photo>${N.ic('check')}Save photo</button>`,
      onMount(s) {
        s.querySelectorAll('[data-photo-opt]').forEach(b => b.addEventListener('click', () => {
          s.querySelectorAll('[data-photo-opt]').forEach(x => x.classList.toggle('is-active', x === b));
        }));
        s.querySelector('[data-save-photo]').addEventListener('click', () => { N.closeSheet(); N.toast('Photo updated'); });
      }
    });
  }
});