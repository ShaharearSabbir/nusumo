/* Nusumo — PK battle */
N.ready(function () {
  const D = N.D;
  const host = N.user('me');
  const opp = N.user('rafi');

  const TABS = [
    { key:'arena', label:'Arena', icon:'swords' },
    { key:'matchmaking', label:'Matchmaking', icon:'target' },
    { key:'leaderboard', label:'Leaderboard', icon:'trophy' },
    { key:'history', label:'History', icon:'clock' }
  ];

  const initialMode = N.Q.get('mode') === 'audio' ? 'audio' : 'video';

  let tab = TABS.some(t => t.key === N.Q.get('tab')) ? N.Q.get('tab') : 'arena';
  let side = 'chat';
  let histFilter = 'all';
  let rankScope = 'season';
  let searching = false;
  let matched = null;
  let searchTimer = null;
  let tickTimer = null;

  const state = {
    hostScore: 8420,
    oppScore: 7150,
    round: 2,
    rounds: 3,
    hostRounds: 1,
    oppRounds: 0,
    roundWinners: [true],
    remaining: 154,
    total: 180,
    paused: false,
    ended: false,
    viewers: 1284,
    category: 'Music',
    mode: initialMode
  };

  const settings = { rounds: 3, category: 'Music', goal: 'Most points', private: false, mode: initialMode };

  let supporters = (D.pkSupporters || []).map(x => ({ ...x }));
  const initialChat = [
    { system: 'PK battle started · 3 rounds · Music' },
    { u:'nusrat', t:'rafi is stacking gifts already 😤', time:'42:02' },
    { u:'elena', t:'team mahfuza where you at', time:'42:14' },
    { gift:true, u:'zack', t:'sent a <b>Rocket</b> gift 🚀', time:'42:28' },
    { u:'farah', role:'Mod', t:'keep it friendly, no spamming the same gift', time:'42:39' },
    { system: 'Round 1 won by Mahfuza Akhter · 4,210 : 3,860' }
  ];
  let chat = initialChat.map(m => ({ ...m }));

  const oppParam = N.Q.get('opponent');
  if (oppParam && oppParam !== 'me' && N.user(oppParam)) {
    let o = (D.pkOpponents || []).find(x => x.user === oppParam);
    if (!o) {
      o = { user: oppParam, rank: '—', wins: 0, losses: 0, streak: 0, category: settings.category || 'Music', status: 'ready', winRate: 0, points: 0, avg: '—' };
      D.pkOpponents = D.pkOpponents || [];
      D.pkOpponents.unshift(o);
    }
    matched = o;
    tab = 'matchmaking';
  }

  function mmss(total) {
    const m = Math.floor(Math.max(0, total) / 60);
    const s = Math.max(0, total) % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }
  const share = () => Math.round(state.hostScore / Math.max(1, state.hostScore + state.oppScore) * 100);

  /* ------------------------------- chat ------------------------------- */
  function msgHTML(m) {
    if (m.gift) {
      const gu = N.user(m.u);
      return `<div class="msg msg--gift">${N.ic('gift')}<span><b>${N.esc(gu.name)}</b> ${m.t}</span></div>`;
    }
    if (m.system) return `<div class="msg msg--system">${N.esc(m.system)}</div>`;
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
  const chatBody = () => `<div class="pk-chat" data-pk-chat>${chat.map(msgHTML).join('')}</div>`;

  function scrollChat() {
    const el = document.querySelector('[data-pk-chat]');
    if (el) el.scrollTop = el.scrollHeight;
  }

  /* ------------------------------- arena ------------------------------- */
  function roundDotsHTML() {
    let out = '';
    for (let i = 1; i <= state.rounds; i++) {
      const done = i < state.round || (state.ended && i <= state.round);
      const won = done ? state.roundWinners[i - 1] : null;
      const cls = won === true ? 'is-won' : won === false ? 'is-lost' : i === state.round ? 'is-current' : '';
      out += `<span class="pk-dot ${cls}" title="Round ${i}"></span>`;
    }
    return out;
  }

  function stageHTML() {
    const pct = share();
    return `<section class="pk-stage ${state.paused ? 'is-paused' : ''} ${state.ended ? 'is-ended' : ''}" data-pk-stage aria-label="PK battle scoreboard">
      <div class="pk-stage__top">
        <span class="live-badge live-badge--solid"><i class="live-dot"></i>PK live</span>
        <span class="badge ${state.mode === 'audio' ? 'badge--ok' : 'badge--violet'}">${N.ic(state.mode === 'audio' ? 'headphones' : 'video')}${state.mode === 'audio' ? 'Audio PK' : 'Video PK'}</span>
        <span class="badge badge--violet">${N.esc(state.category)}</span>
        <span class="pk-stage__viewers">${N.ic('eye')}${N.fmt(state.viewers)} watching</span>
        <div class="pk-stage__tools">
          <button class="icon-btn" data-pk-pause aria-label="${state.paused ? 'Resume battle' : 'Pause battle'}">${N.ic(state.paused ? 'play' : 'pause')}</button>
          <button class="icon-btn" data-pk-menu aria-label="Battle options">${N.ic('more')}</button>
        </div>
      </div>

      <div class="pk-stage__grid">
        <div class="pk-side pk-side--host ${pct >= 50 ? 'is-leading' : ''}">
          <span class="pk-side__crown" aria-hidden="true">${N.ic('crown')}</span>
          <span class="pk-side__ava">${N.av(host, 74, 'av--ring')}</span>
          <div class="pk-side__name">${N.esc(host.name)}${host.verified ? N.verified() : ''}</div>
          <div class="pk-side__sub">Host · ${state.hostRounds} round${state.hostRounds === 1 ? '' : 's'} won</div>
          <div class="pk-side__score" data-pk-host-score>${N.fmt(state.hostScore)}</div>
          <div class="pk-side__bar"><span style="width:${pct}%"></span></div>
          <div class="pk-side__meta"><span>${N.ic('gift')}${supporters.reduce((a, s) => a + s.gifts, 0)} gifts</span><span>${N.ic('users')}${N.fmt(state.viewers)}</span></div>
        </div>

        <div class="pk-center">
          <div class="pk-center__vs">VS</div>
          <div class="pk-center__timer" data-pk-timer aria-live="polite">${mmss(state.remaining)}</div>
          <div class="pk-center__round">Round <b>${state.round}</b> of ${state.rounds}</div>
          <div class="pk-center__dots">${roundDotsHTML()}</div>
          <button class="pk-center__rules" data-pk-rules>${N.ic('target')}How PK works</button>
          <button class="btn btn--ghost btn--sm pk-center__end" data-pk-end>End battle</button>
        </div>

        <div class="pk-side pk-side--opp ${pct < 50 ? 'is-leading' : ''}">
          <span class="pk-side__ava">${N.av(opp, 74, 'av--ring')}</span>
          <div class="pk-side__name">${N.esc(opp.name)}${opp.verified ? N.verified() : ''}</div>
          <div class="pk-side__sub">Challenger · ${state.oppRounds} round${state.oppRounds === 1 ? '' : 's'} won</div>
          <div class="pk-side__score" data-pk-opp-score>${N.fmt(state.oppScore)}</div>
          <div class="pk-side__bar"><span style="width:${100 - pct}%"></span></div>
          <div class="pk-side__meta"><span>${N.ic('flame')}9 win streak</span><span>${N.ic('trophy')}Rank 4</span></div>
        </div>
      </div>

      <div class="pk-meter" role="img" aria-label="${pct}% of points to ${N.esc(host.name)}">
        <span class="pk-meter__host" style="width:${pct}%"></span>
        <span class="pk-meter__opp" style="width:${100 - pct}%"></span>
      </div>
      <div class="pk-stage__foot">
        <span class="row">${N.ic('flame')}Gift goal <b>15K</b> pts</span>
        <span class="row">${N.ic('clock')}<span data-pk-left>${mmss(state.remaining)}</span> left in round ${state.round}</span>
        <span class="row pk-stage__foot-right">${N.ic('trophy')}Winner takes the round bonus</span>
      </div>

      <div class="pk-paused">
        ${N.ic('pause')}
        <strong>Battle paused</strong>
        <span>${state.ended ? 'The battle has ended' : 'Scores are frozen until you resume'}</span>
        <button class="btn btn--primary btn--sm" data-pk-pause>Resume</button>
      </div>
    </section>`;
  }

  function giftsHTML() {
    const me = supporters.find(s => s.user === 'me') || { points: 0, gifts: 0 };
    return `<section class="card pk-gifts">
      <div class="panel-head">
        <h3>Send a gift</h3>
        <span class="sub">Points land on your host's score</span>
        <div class="panel-head__actions">
          <span class="badge badge--violet">${N.ic('swords')}Your support · ${N.fmt(me.points)} pts</span>
        </div>
      </div>
      <div class="pk-gifts__body">
        <div class="gift-grid pk-gift-grid">
          ${(D.pkGifts || []).map(g => `<button class="gift" data-pk-gift="${g.name}" aria-label="Send ${g.name} for ${g.coins} coins">
            <span class="gift__glyph">${g.glyph}</span>
            <span>${N.esc(g.name)}</span>
            <span class="gift__price">${g.coins} coins · +${g.points}</span>
          </button>`).join('')}
        </div>
        <div class="pk-gifts__foot">
          <button class="btn btn--ghost btn--sm" data-pk-share>${N.ic('share')}Share battle</button>
          <button class="btn btn--primary btn--sm" data-pk-invite>${N.ic('users')}Invite supporters</button>
        </div>
      </div>
    </section>`;
  }

  function arenaHTML() {
    return `<div class="pk-layout">
      <div class="pk-main">
        ${stageHTML()}
        ${giftsHTML()}
      </div>
      <aside class="pk-panel card" aria-label="Battle chat and supporters">
        <div class="pk-panel__head">
          <div class="segmented pk-panel__seg" role="tablist" aria-label="Battle panel">
            ${[['chat','Chat'],['supporters','Supporters'],['ranks','Ranks']].map(([k, l]) =>
              `<button role="tab" aria-selected="${side === k}" class="${side === k ? 'is-active' : ''}" data-pk-side="${k}">${l}</button>`).join('')}
          </div>
        </div>
        <div class="pk-panel__body" id="pkSideBody">${sideBodyHTML()}</div>
      </aside>
    </div>`;
  }

  function sideBodyHTML() {
    if (side === 'supporters') {
      return `<div class="pk-list">
        ${supporters.slice().sort((a, b) => b.points - a.points).map((s, i) => {
          const u = N.user(s.user);
          return `<div class="pk-list__row">
            <span class="pk-list__rank">${i + 1}</span>
            ${N.av(u, 30, 'av--hair')}
            <div class="pk-list__meta">
              <div class="pk-list__name">${N.esc(u.name)}${u.verified ? N.verified() : ''}</div>
              <div class="pk-list__sub">${s.gifts} gift${s.gifts === 1 ? '' : 's'} sent</div>
            </div>
            <span class="pk-list__val">${N.fmt(s.points)}<small>pts</small></span>
          </div>`;
        }).join('')}
      </div>`;
    }
    if (side === 'ranks') {
      return `<div class="pk-list">
        ${(D.pkLeaderboard || []).slice(0, 7).map((r, i) => {
          const u = N.user(r.user);
          return `<div class="pk-list__row ${r.user === 'me' ? 'is-me' : ''}">
            <span class="pk-list__rank ${i < 3 ? 'is-top' : ''}">${i + 1}</span>
            ${N.av(u, 30, 'av--hair')}
            <div class="pk-list__meta">
              <div class="pk-list__name">${N.esc(u.name)}${u.verified ? N.verified() : ''}</div>
              <div class="pk-list__sub">${r.wins} wins · ${r.streak} streak</div>
            </div>
            <span class="pk-list__val">${N.fmt(r.points)}<small>pts</small></span>
          </div>`;
        }).join('')}
      </div>
      <a class="btn btn--ghost btn--block btn--sm" style="margin-top:10px" href="#" data-pk-tab="leaderboard">Full leaderboard${N.ic('chevronRight')}</a>`;
    }
    return `<div class="pk-chat-wrap">
      ${chatBody()}
      <form class="chat-send pk-chat-send" data-pk-chat-form>
        <input class="input" name="message" placeholder="Say something kind…" aria-label="Chat message" autocomplete="off">
        <button class="icon-btn" type="button" data-pk-react="heart" aria-label="Send a heart">${N.ic('heart')}</button>
        <button class="icon-btn icon-btn--send" type="submit" aria-label="Send message">${N.ic('send')}</button>
      </form>
      <div class="chat-panel__rules">Be kind. Gifts are shared with the creators. <a href="#">Community rules</a></div>
    </div>`;
  }

  /* ----------------------------- matchmaking ----------------------------- */
  function matchmakingHTML() {
    const rivals = (D.pkOpponents || []).filter(o => o.status !== 'in-battle');
    const card = matched ? `
      <div class="pk-quick__matched">
        <div class="pk-quick__duo">
          <span>${N.av(host, 56, 'av--ring')}</span>
          <span class="pk-center__vs">VS</span>
          <span>${N.av(matched.user, 56, 'av--ring')}</span>
        </div>
        <h3>${N.esc(N.user(matched.user).name)} wants to battle</h3>
        <p>${N.esc(matched.category)} · ${settings.mode === 'audio' ? 'Audio' : 'Video'} PK · rank ${matched.rank} · ${matched.winRate}% win rate</p>
        <div class="pk-quick__actions">
          <button class="btn btn--primary" data-pk-accept>${N.ic('swords')}Accept battle</button>
          <button class="btn btn--ghost" data-pk-cancel>Keep searching</button>
        </div>
      </div>` : `
      <div class="pk-quick__empty">
        <span class="pk-radar ${searching ? 'is-scanning' : ''}" aria-hidden="true">
          <i></i><i></i><i></i>
          <span class="pk-radar__core">${N.ic('swords')}</span>
        </span>
        <h3>${searching ? 'Searching for a rival…' : 'Find someone your size'}</h3>
        <p>${searching ? 'Matching on category, rank and recent form.' : 'We match you with creators at a similar rank so every round stays close.'}</p>
        <button class="btn btn--primary" data-pk-quick ${searching ? 'disabled' : ''}>${N.ic(searching ? 'refresh' : 'target')}${searching ? 'Searching…' : 'Quick match'}</button>
        <span class="pk-quick__hint">Avg wait 3s · ${rivals.length} creators online</span>
      </div>`;

    return `<div class="pk-match">
      <div class="card pk-quick">${card}</div>

      <div class="card pk-settings">
        <div class="panel-head"><h3>Battle settings</h3><span class="sub">Applied to your next PK</span></div>
        <div class="pk-settings__body">
          <div class="pk-field">
            <span class="label">Mode</span>
            <div class="segmented">
              <button class="${settings.mode === 'video' ? 'is-active' : ''}" data-pk-mode="video">${N.ic('video')}Video</button>
              <button class="${settings.mode === 'audio' ? 'is-active' : ''}" data-pk-mode="audio">${N.ic('headphones')}Audio</button>
            </div>
          </div>
          <div class="pk-field">
            <div class="segmented">
              ${[1, 3, 5].map(n => `<button class="${settings.rounds === n ? 'is-active' : ''}" data-pk-rounds="${n}">${n} round${n === 1 ? '' : 's'}</button>`).join('')}
            </div>
          </div>
          <div class="pk-field">
            <span class="label">Category</span>
            <div class="pk-chips">
              ${['Music','Talk','Learning','Gaming'].map(c => `<button class="chip chip--sm ${settings.category === c ? 'is-active' : ''}" data-pk-cat="${c}">${c}</button>`).join('')}
            </div>
          </div>
          <div class="pk-field">
            <label class="label" for="pkGoal">Win condition</label>
            <select class="select" id="pkGoal" data-pk-goal>
              ${['Most points','First to 10K','First to 15K'].map(g => `<option ${settings.goal === g ? 'selected' : ''}>${g}</option>`).join('')}
            </select>
          </div>
          <div class="switch-row" style="border:0;padding-top:2px">
            <div class="switch-row__text"><strong>Private battle</strong><span>Only invited supporters can watch</span></div>
            <button class="switch ${settings.private ? 'is-on' : ''}" role="switch" aria-checked="${settings.private}" aria-label="Private battle" data-pk-private></button>
          </div>
          <button class="btn btn--primary btn--block" data-pk-start>${N.ic('swords')}Start battle</button>
        </div>
      </div>
    </div>

    <div class="card pk-creators">
      <div class="panel-head"><h3>Challenge a creator</h3><span class="sub">Ranked by recent form</span>
        <div class="panel-head__actions"><span class="badge badge--ok">${rivals.length} available</span></div>
      </div>
      <div class="pk-creators__list">
        ${(D.pkOpponents || []).map(o => {
          const u = N.user(o.user);
          const busy = o.status === 'in-battle';
          const live = o.status === 'live';
          return `<div class="pk-creator ${busy ? 'is-busy' : ''}">
            <span class="pk-creator__rank">#${o.rank}</span>
            ${N.av(u, 36, 'av--hair')}
            <div class="pk-creator__meta">
              <div class="pk-creator__name">${N.esc(u.name)}${u.verified ? N.verified() : ''}</div>
              <div class="pk-creator__sub">${N.esc(o.category)} · ${o.wins}W ${o.losses}L · ${o.winRate}% win rate</div>
            </div>
            <span class="pk-creator__streak">${N.ic('flame')}${o.streak}</span>
            <span class="badge ${busy ? '' : live ? 'badge--live' : 'badge--ok'}">${busy ? 'In battle' : live ? 'Live now' : 'Ready'}</span>
            <button class="btn ${busy ? 'btn--ghost' : 'btn--primary'} btn--sm" data-pk-challenge="${o.user}" ${busy ? 'disabled' : ''}>${busy ? 'Busy' : 'Challenge'}</button>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }

  /* ----------------------------- leaderboard ----------------------------- */
  function leaderboardHTML() {
    const board = (D.pkLeaderboard || []).slice();
    const top = board.slice(0, 3);
    const rest = board.slice(3);
    const order = [top[1], top[0], top[2]].filter(Boolean);
    const podium = order.map(u => {
      const rank = top.indexOf(u) + 1;
      const user = N.user(u.user);
      return `<div class="pk-podium__col pk-podium__col--${rank}">
        <span class="pk-podium__rank">${rank === 1 ? N.ic('crown') : '#' + rank}</span>
        ${N.av(user, rank === 1 ? 64 : 52, 'av--ring')}
        <div class="pk-podium__name">${N.esc(user.name)}${user.verified ? N.verified() : ''}</div>
        <div class="pk-podium__pts">${N.fmt(u.points)} pts</div>
        <div class="pk-podium__base">${u.wins} wins</div>
      </div>`;
    }).join('');

    return `<div class="pk-board">
      <div class="card pk-podium-card">
        <div class="pk-podium__head">
          <div>
            <h3>PK leaderboard</h3>
            <p class="sub">${rankScope === 'season' ? 'Season 4 · Sep–Nov 2026' : 'This week · 26 Oct – 1 Nov'}</p>
          </div>
          <div class="segmented">
            <button class="${rankScope === 'season' ? 'is-active' : ''}" data-pk-scope="season">Season</button>
            <button class="${rankScope === 'week' ? 'is-active' : ''}" data-pk-scope="week">This week</button>
          </div>
        </div>
        <div class="pk-podium">${podium}</div>
      </div>

      <div class="card pk-board-table">
        <div class="panel-head"><h3>Standings</h3><span class="sub">Points from PK wins and gifts</span></div>
        <div class="pk-board-table__head">
          <span>#</span><span>Creator</span><span>Wins</span><span>Streak</span><span>Points</span>
        </div>
        ${rest.map((r, i) => {
          const u = N.user(r.user);
          return `<div class="pk-board-row ${r.user === 'me' ? 'is-me' : ''}">
            <span class="pk-board-row__rank">${i + 4}</span>
            <span class="pk-board-row__who">${N.av(u, 28, 'av--hair')}<span>${N.esc(u.name)}${u.verified ? N.verified() : ''}${r.user === 'me' ? ' <span class="badge badge--violet" style="height:17px;font-size:9px">You</span>' : ''}</span></span>
            <span>${r.wins}</span>
            <span class="pk-board-row__streak">${N.ic('flame')}${r.streak}</span>
            <span class="pk-board-row__pts">${N.fmt(r.points)}</span>
          </div>`;
        }).join('')}
        <div class="pk-board-note">${N.ic('refresh')}Leaderboard updates every 5 minutes · Season resets 1 Dec</div>
      </div>
    </div>`;
  }

  /* ----------------------------- history ----------------------------- */
  function historyHTML() {
    let list = (D.pkHistory || []).slice();
    if (histFilter !== 'all') list = list.filter(h => h.result === histFilter);
    const wins = (D.pkHistory || []).filter(h => h.result === 'win').length;
    const totalPts = (D.pkHistory || []).reduce((a, h) => a + h.points, 0);

    return `<div class="pk-history">
      <div class="pk-history__stats">
        <div class="card pk-stat"><span class="pk-stat__icon">${N.ic('swords')}</span><div><b>${(D.pkHistory || []).length}</b><span>Battles fought</span></div></div>
        <div class="card pk-stat"><span class="pk-stat__icon">${N.ic('trophy')}</span><div><b>${Math.round(wins / (D.pkHistory || []).length * 100)}%</b><span>Win rate</span></div></div>
        <div class="card pk-stat"><span class="pk-stat__icon">${N.ic('flame')}</span><div><b>2</b><span>Current streak</span></div></div>
        <div class="card pk-stat"><span class="pk-stat__icon">${N.ic('target')}</span><div><b>${N.fmt(totalPts)}</b><span>Points earned</span></div></div>
      </div>

      <div class="card pk-history__card">
        <div class="panel-head"><h3>Battle history</h3>
          <div class="pk-history__filters">
            ${[['all','All',(D.pkHistory || []).length],['win','Wins',wins],['loss','Losses',(D.pkHistory || []).length - wins]].map(([k, l, n]) =>
              `<button class="chip chip--sm ${histFilter === k ? 'is-active' : ''}" data-pk-hist="${k}">${l} <span class="faint">${n}</span></button>`).join('')}
          </div>
        </div>
        <div class="pk-history__list">
          ${list.length ? list.map(h => {
            const u = N.user(h.opponent);
            return `<div class="pk-history__row">
              <span class="pk-history__result pk-history__result--${h.result}">${h.result === 'win' ? N.ic('trophy') : N.ic('x')}${h.result === 'win' ? 'Win' : 'Loss'}</span>
              <span class="pk-history__opp">${N.av(u, 36, 'av--hair')}<span><b>${N.esc(u.name)}</b>${u.verified ? N.verified() : ''}<small>${h.date} · ${h.rounds} round${h.rounds === 1 ? '' : 's'} · ${h.viewers} watched</small></span></span>
              <span class="pk-history__score">${N.fmt(h.hostScore)} <span class="faint">:</span> ${N.fmt(h.oppScore)}</span>
              <span class="pk-history__delta ${h.points >= 0 ? 'is-up' : 'is-down'}">${h.points >= 0 ? '+' : ''}${N.fmt(h.points)} pts</span>
              <button class="btn btn--ghost btn--sm" data-pk-rematch-id="${h.id}">${N.ic('refresh')}Rematch</button>
            </div>`;
          }).join('') : `<div class="empty" style="padding:32px"><div class="empty__icon">${N.ic('swords')}</div><h3>No battles here</h3><p>Try another filter or start a new PK from matchmaking.</p><button class="btn btn--primary" data-pk-tab="matchmaking">Find a rival</button></div>`}
        </div>
      </div>
    </div>`;
  }

  /* ------------------------------- shell ------------------------------- */
  function pageHTML() {
    return `<div class="page page--pk">
      <div class="page-head">
        <div>
          <div class="eyebrow">Two creators · one scoreboard</div>
          <h1>PK battle</h1>
          <p class="lead">Go head-to-head with another creator. Every gift, reaction and round moves the score.</p>
        </div>
        <div class="page-head__actions">
          <button class="btn btn--ghost" data-pk-share>${N.ic('share')}Share</button>
          <button class="btn btn--pk" data-pk-tab="matchmaking">${N.ic('target')}Find a rival</button>
        </div>
      </div>

      <div class="tabs pk-tabs" role="tablist" aria-label="PK sections">
        ${TABS.map(t => `<button class="tab-btn ${tab === t.key ? 'is-active' : ''}" role="tab" aria-selected="${tab === t.key}" data-pk-tab="${t.key}">${N.ic(t.icon)}${t.label}</button>`).join('')}
      </div>

      <div id="pkBody">${bodyHTML()}</div>
    </div>`;
  }

  function bodyHTML() {
    if (tab === 'matchmaking') return matchmakingHTML();
    if (tab === 'leaderboard') return leaderboardHTML();
    if (tab === 'history') return historyHTML();
    return arenaHTML();
  }

  function render(keepScroll) {
    const body = document.getElementById('pkBody');
    if (!body) return;
    body.innerHTML = bodyHTML();
    document.querySelectorAll('[data-pk-tab]').forEach(b => {
      if (b.closest('.tabs')) {
        const on = b.dataset.pkTab === tab;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', on);
      }
    });
    N.reveal(body);
    if (!keepScroll) window.scrollTo(0, 0);
    if (tab === 'arena' && side === 'chat') scrollChat();
    updateTimerDOM();
  }

  function renderSide() {
    document.querySelectorAll('[data-pk-side]').forEach(b => {
      const on = b.dataset.pkSide === side;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on);
    });
    const body = document.getElementById('pkSideBody');
    if (body) {
      body.innerHTML = sideBodyHTML();
      if (side === 'chat') scrollChat();
    }
  }

  /* ------------------------------- timer ------------------------------- */
  function updateTimerDOM() {
    const t = document.querySelector('[data-pk-timer]');
    if (t) t.textContent = mmss(state.remaining);
    const left = document.querySelector('[data-pk-left]');
    if (left) left.textContent = mmss(state.remaining);
    const hs = document.querySelector('[data-pk-host-score]');
    if (hs) hs.textContent = N.fmt(state.hostScore);
    const os = document.querySelector('[data-pk-opp-score]');
    if (os) os.textContent = N.fmt(state.oppScore);
    const meter = document.querySelector('.pk-meter__host');
    if (meter) meter.style.width = share() + '%';
    const meterOpp = document.querySelector('.pk-meter__opp');
    if (meterOpp) meterOpp.style.width = (100 - share()) + '%';
  }

  function tick() {
    if (tab !== 'arena' || state.paused || state.ended) return;
    state.remaining -= 1;
    if (state.remaining <= 0) { state.remaining = 0; finishRound(); return; }
    updateTimerDOM();
  }

  /* ------------------------------ rounds ------------------------------ */
  function finishRound() {
    if (state.ended) return;
    const hostWon = state.hostScore >= state.oppScore;
    state.roundWinners.push(hostWon);
    if (hostWon) state.hostRounds++; else state.oppRounds++;
    chat.push({ system: `Round ${state.round} won by ${hostWon ? host.name : opp.name} · ${N.fmt(state.hostScore)} : ${N.fmt(state.oppScore)}` });

    if (state.round >= state.rounds) { endBattle(); return; }

    const finished = state.round;
    state.round += 1;
    state.remaining = state.total;
    state.paused = true;
    render(true);

    N.openSheet({
      title: `Round ${finished} · ${hostWon ? 'You take it' : 'Rafi takes it'}`,
      sub: `${state.hostRounds} – ${state.oppRounds} in rounds`,
      body: `<div class="pk-round-result">
        <div class="pk-round-result__score"><span>${N.fmt(state.hostScore)}</span><i>:</i><span>${N.fmt(state.oppScore)}</span></div>
        <p>${hostWon ? 'Your supporters came through. Keep the pressure on.' : 'Rafi edged that round. One good gift run flips it back.'}</p>
        <div class="pk-round-result__meta">
          <span>${N.ic('gift')}${supporters.reduce((a, s) => a + s.gifts, 0)} gifts</span>
          <span>${N.ic('eye')}${N.fmt(state.viewers)} watching</span>
        </div>
      </div>`,
      foot: `<button class="btn btn--primary btn--block" data-pk-next>${N.ic('play')}Start round ${state.round}</button>`
    });
  }

  function endBattle() {
    state.ended = true;
    state.paused = true;
    state.remaining = Math.max(0, state.remaining);
    const won = state.hostRounds > state.oppRounds || (state.hostRounds === state.oppRounds && state.hostScore >= state.oppScore);
    chat.push({ system: `Battle ended · ${won ? host.name : opp.name} wins ${state.hostRounds}–${state.oppRounds}` });
    render(true);

    N.openSheet({
      title: won ? 'You won the PK' : 'Rafi won the PK',
      sub: `${state.hostRounds} – ${state.oppRounds} rounds · ${N.fmt(state.hostScore)} : ${N.fmt(state.oppScore)} points`,
      tall: true,
      body: `<div class="pk-result ${won ? 'is-win' : 'is-loss'}">
        <span class="pk-result__badge">${N.ic(won ? 'trophy' : 'flame')}${won ? 'Victory' : 'Defeat'}</span>
        <div class="pk-result__duo">
          <div class="pk-result__side">${N.av(host, 64, 'av--ring')}<b>${N.esc(host.name.split(' ')[0])}</b><span>${N.fmt(state.hostScore)}</span></div>
          <span class="pk-result__vs">VS</span>
          <div class="pk-result__side">${N.av(opp, 64, 'av--ring')}<b>${N.esc(opp.name.split(' ')[0])}</b><span>${N.fmt(state.oppScore)}</span></div>
        </div>
        <div class="pk-result__stats">
          <div><b>${state.rounds}</b><span>Rounds</span></div>
          <div><b>${supporters.reduce((a, s) => a + s.gifts, 0)}</b><span>Gifts</span></div>
          <div><b>${N.fmt(state.viewers)}</b><span>Viewers</span></div>
          <div><b>+${won ? '4,820' : '1,240'}</b><span>PK points</span></div>
        </div>
        <p class="pk-result__note">${won ? 'Your best round was round 2. Supporters sent 41 gifts in the final minute.' : 'Rafi pulled ahead on gift value. A rematch resets scores and keeps the same audience.'}</p>
      </div>`,
      foot: `<div class="pk-result__actions">
        <button class="btn btn--primary btn--block" data-pk-rematch>${N.ic('refresh')}Rematch</button>
        <button class="btn btn--ghost btn--block" data-pk-tab="history">${N.ic('clock')}View battle history</button>
      </div>`
    });
  }

  function rematch() {
    N.closeSheet();
    state.hostScore = 0;
    state.oppScore = 0;
    state.round = 1;
    state.hostRounds = 0;
    state.oppRounds = 0;
    state.roundWinners = [];
    state.remaining = state.total;
    state.paused = false;
    state.ended = false;
    chat.push({ system: 'Rematch started · scores reset' });
    tab = 'arena';
    render();
    N.toast('Rematch started — round 1');
  }

  /* ------------------------------- actions ------------------------------- */
  function spawnFloat(glyph) {
    const stage = document.querySelector('[data-pk-stage]');
    if (!stage) return;
    const el = document.createElement('span');
    el.className = 'pk-float';
    el.textContent = glyph;
    el.style.left = (18 + Math.random() * 56) + '%';
    stage.appendChild(el);
    setTimeout(() => el.remove(), 1400);
  }

  function sendGift(name) {
    if (state.ended) { N.toast('This battle has ended — start a rematch'); return; }
    const g = (D.pkGifts || []).find(x => x.name === name);
    if (!g) return;
    state.hostScore += g.points;
    chat.push({ gift: true, u: 'me', t: `sent a <b>${N.esc(g.name)}</b> gift ${g.glyph}` });
    let me = supporters.find(s => s.user === 'me');
    if (!me) { me = { user: 'me', points: 0, gifts: 0 }; supporters.push(me); }
    me.points += g.points;
    me.gifts += 1;
    render(true);
    if (side === 'chat') scrollChat();
    spawnFloat(g.glyph);
    N.toast(`${g.glyph} ${g.name} sent · +${g.points} pts`);
  }

  function quickMatch() {
    if (searching) return;
    searching = true;
    matched = null;
    render(true);
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      searching = false;
      const pool = (D.pkOpponents || []).filter(o => o.status === 'ready');
      matched = pool[Math.floor(Math.random() * pool.length)] || (D.pkOpponents || [])[0];
      if (tab === 'matchmaking') render(true);
      if (matched) N.toast(`Matched with ${N.user(matched.user).name}`);
    }, 1500);
  }

  function challenge(userId) {
    const o = (D.pkOpponents || []).find(x => x.user === userId);
    if (!o) return;
    const u = N.user(userId);
    N.confirmDialog({
      title: `Challenge ${u.name}?`,
      message: `${o.category} · ${settings.rounds} rounds · ${settings.goal}. They have 30 seconds to accept.`,
      confirmLabel: 'Send challenge',
      onConfirm() {
        matched = o;
        searching = false;
        tab = 'matchmaking';
        render();
        N.toast(`Challenge sent to ${u.name}`);
      }
    });
  }

  function shareSheet() {
    const url = location.origin + '/pk-battle.html' + (matched ? '?id=' + matched.user : '');
    N.openSheet({
      title: 'Share this battle',
      sub: 'Friends land straight in the arena',
      body: `<div class="copy-row">${N.ic('link')}<code>${N.esc(url.replace(/^https?:\/\//, ''))}</code><button class="btn btn--ghost btn--sm" data-pk-copy>Copy</button></div>
        <div class="gift-grid pk-share-grid">
          <button class="gift" data-pk-copy><span class="gift__glyph">${N.ic('copy')}</span><span>Copy link</span></button>
          <button class="gift" data-pk-share-to="Chat"><span class="gift__glyph">${N.ic('chat')}</span><span>Chat</span></button>
          <button class="gift" data-pk-share-to="Stories"><span class="gift__glyph">${N.ic('plus')}</span><span>Stories</span></button>
          <button class="gift" data-pk-share-to="X"><span class="gift__glyph">${N.ic('share')}</span><span>X</span></button>
        </div>
        <div class="pk-share-note">${N.ic('users')}Anyone with the link can watch and send gifts. Gifts are split 50/50 between both creators.</div>`,
      foot: `<button class="btn btn--primary btn--block" data-pk-share-done>Done</button>`
    });
  }

  function inviteSheet() {
    const list = supporters.slice(0, 5);
    N.openSheet({
      title: 'Invite supporters',
      sub: 'Your top supporters get a push notification',
      body: `<div class="pk-list">
        ${list.map(s => {
          const u = N.user(s.user);
          return `<label class="pk-list__row pk-list__row--pick">
            <input type="checkbox" checked aria-label="Invite ${N.esc(u.name)}">
            ${N.av(u, 30, 'av--hair')}
            <div class="pk-list__meta"><div class="pk-list__name">${N.esc(u.name)}</div><div class="pk-list__sub">${s.gifts} gifts sent this season</div></div>
            <span class="pk-list__val">${N.fmt(s.points)}<small>pts</small></span>
          </label>`;
        }).join('')}
      </div>`,
      foot: `<button class="btn btn--primary btn--block" data-pk-invite-send>${N.ic('bell')}Send invites</button>`
    });
  }

  function rulesSheet() {
    N.openSheet({
      title: 'How PK battles work',
      sub: 'Three rounds, one scoreboard',
      body: `<div class="pk-rules">
        <div class="pk-rules__row"><span>1</span><div><b>Rounds</b><p>Each round runs ${state.total / 60} minutes. The creator with more points when the timer ends takes the round.</p></div></div>
        <div class="pk-rules__row"><span>2</span><div><b>Gifts move the score</b><p>Every gift adds its point value to your host. Bigger gifts are worth more — a Crown is 700 points.</p></div></div>
        <div class="pk-rules__row"><span>3</span><div><b>Reactions and chat</b><p>Hearts and chat don't add points, but they keep the room warm and push you up the discovery rail.</p></div></div>
        <div class="pk-rules__row"><span>4</span><div><b>Winning</b><p>Most rounds won takes the battle. Tied rounds go to the creator with the higher point total.</p></div></div>
      </div>`,
      foot: `<button class="btn btn--primary btn--block" data-sheet-close>Got it</button>`
    });
  }

  /* ------------------------------- events ------------------------------- */
  N.view.innerHTML = pageHTML();
  N.reveal();
  if (tab === 'arena' && side === 'chat') scrollChat();

  tickTimer = setInterval(tick, 1000);

  document.addEventListener('click', function (e) {
    const tabBtn = e.target.closest('[data-pk-tab]');
    if (tabBtn) {
      e.preventDefault();
      const next = tabBtn.dataset.pkTab;
      if (next === tab) return;
      tab = next;
      N.closeSheet();
      render();
      return;
    }

    const sideBtn = e.target.closest('[data-pk-side]');
    if (sideBtn) { side = sideBtn.dataset.pkSide; renderSide(); return; }

    const gift = e.target.closest('[data-pk-gift]');
    if (gift) { sendGift(gift.dataset.pkGift); return; }

    if (e.target.closest('[data-pk-pause]')) {
      if (state.ended) { N.toast('This battle has ended — rematch to play again'); return; }
      state.paused = !state.paused;
      render(true);
      N.toast(state.paused ? 'Battle paused' : 'Battle resumed');
      return;
    }

    if (e.target.closest('[data-pk-end]')) {
      if (state.ended) { N.toast('This battle has already ended'); return; }
      N.confirmDialog({
        title: 'End this battle?',
        message: 'The current score decides the winner and the battle is saved to history.',
        confirmLabel: 'End battle',
        danger: true,
        onConfirm() { endBattle(); }
      });
      return;
    }

    if (e.target.closest('[data-pk-next]')) { N.closeSheet(); state.paused = false; render(true); N.toast(`Round ${state.round} started`); return; }
    if (e.target.closest('[data-pk-rematch]')) { rematch(); return; }

    if (e.target.closest('[data-pk-rules]')) { rulesSheet(); return; }
    if (e.target.closest('[data-pk-share]')) { shareSheet(); return; }
    if (e.target.closest('[data-pk-invite]')) { inviteSheet(); return; }

    if (e.target.closest('[data-pk-copy]')) {
      N.copy(location.origin + '/pk-battle.html');
      return;
    }
    if (e.target.closest('[data-pk-share-to]')) {
      N.toast(`Shared to ${e.target.closest('[data-pk-share-to]').dataset.pkShareTo}`);
      return;
    }
    if (e.target.closest('[data-pk-share-done]')) { N.closeSheet(); return; }
    if (e.target.closest('[data-pk-invite-send]')) { N.closeSheet(); N.toast('Invites sent to 5 supporters'); return; }

    const menuBtn = e.target.closest('[data-pk-menu]');
    if (menuBtn) {
      N.openMenu(menuBtn, [
        { icon:'share', label:'Share battle', onClick: shareSheet },
        { icon:'users', label:'Invite supporters', onClick: inviteSheet },
        { icon:'refresh', label:'End round now', onClick() { finishRound(); } },
        { sep:true },
        { icon:'flag', label:'Report battle', danger:true, onClick() { N.confirmDialog({ title:'Report this battle?', message:'Our moderation team reviews reports within 24 hours.', confirmLabel:'Report', danger:true, onConfirm() { N.toast('Report submitted'); } }); } },
        { icon:'logout', label:'Leave arena', danger:true, onClick() { tab = 'matchmaking'; render(); N.toast('You left the arena'); } }
      ]);
      return;
    }

    if (e.target.closest('[data-pk-quick]')) { quickMatch(); return; }

    const challengeBtn = e.target.closest('[data-pk-challenge]');
    if (challengeBtn) { challenge(challengeBtn.dataset.pkChallenge); return; }

    if (e.target.closest('[data-pk-accept]')) {
      if (matched) {
        state.category = matched.category;
        state.rounds = settings.rounds;
        state.round = 1;
        state.hostScore = 0;
        state.oppScore = 0;
        state.hostRounds = 0;
        state.oppRounds = 0;
        state.roundWinners = [];
        state.remaining = state.total;
        state.paused = false;
        state.ended = false;
        state.mode = settings.mode;
        N.toast(`Battle started vs ${N.user(matched.user).name}`);
        matched = null;
        tab = 'arena';
        render();
      }
      return;
    }
    if (e.target.closest('[data-pk-cancel]')) {
      matched = null;
      N.toast('Search cancelled');
      render(true);
      return;
    }

    const modeBtn = e.target.closest('[data-pk-mode]');
    if (modeBtn) { settings.mode = modeBtn.dataset.pkMode; render(true); return; }

    const roundsBtn = e.target.closest('[data-pk-rounds]');
    if (roundsBtn) {
      settings.rounds = +roundsBtn.dataset.pkRounds;
      render(true);
      return;
    }
    const catBtn = e.target.closest('[data-pk-cat]');
    if (catBtn) {
      settings.category = catBtn.dataset.pkCat;
      render(true);
      return;
    }
    if (e.target.closest('[data-pk-private]')) {
      settings.private = !settings.private;
      render(true);
      N.toast(settings.private ? 'Private battle on' : 'Battle is public');
      return;
    }
    if (e.target.closest('[data-pk-start]')) {
      state.category = settings.category;
      state.mode = settings.mode;
      state.rounds = settings.rounds;
      state.round = 1;
      state.hostScore = 0;
      state.oppScore = 0;
      state.hostRounds = 0;
      state.oppRounds = 0;
      state.roundWinners = [];
      state.remaining = state.total;
      state.paused = false;
      state.ended = false;
      tab = 'arena';
      N.closeSheet();
      render();
      N.toast(`${settings.rounds}-round ${settings.category} ${settings.mode} battle started`);
      return;
    }

    const scopeBtn = e.target.closest('[data-pk-scope]');
    if (scopeBtn) { rankScope = scopeBtn.dataset.pkScope; render(true); return; }

    const histBtn = e.target.closest('[data-pk-hist]');
    if (histBtn) { histFilter = histBtn.dataset.pkHist; render(true); return; }

    const rematchBtn = e.target.closest('[data-pk-rematch-id]');
    if (rematchBtn) {
      const h = (D.pkHistory || []).find(x => x.id === rematchBtn.dataset.pkRematchId);
      if (h) challenge(h.opponent);
      return;
    }

    const react = e.target.closest('[data-pk-react]');
    if (react) {
      const stage = document.querySelector('[data-pk-stage]');
      if (stage) {
        const burst = document.createElement('span');
        burst.className = 'pk-react-burst';
        burst.innerHTML = N.ic('heart');
        stage.appendChild(burst);
        setTimeout(() => burst.remove(), 1200);
      }
      return;
    }
  });

  document.addEventListener('submit', function (e) {
    const form = e.target.closest('[data-pk-chat-form]');
    if (!form) return;
    e.preventDefault();
    const input = form.querySelector('input[name="message"]');
    const text = (input.value || '').trim();
    if (!text) { N.toast('Type a message first'); return; }
    chat.push({ u: 'me', t: N.esc(text) });
    input.value = '';
    renderSide();
    scrollChat();
  });

  document.addEventListener('change', function (e) {
    const goal = e.target.closest('[data-pk-goal]');
    if (goal) { settings.goal = goal.value; N.toast(`Win condition · ${goal.value}`); }
  });
});
