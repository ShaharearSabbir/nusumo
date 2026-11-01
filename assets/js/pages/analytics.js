/* Nusumo — Creator analytics */
N.ready(function () {
  const D = N.D;
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const views = [120,180,95,240,310,280,360];
  const followers = [2,5,1,8,12,7,14];
  const maxV = Math.max(...views);

  N.view.innerHTML = `<div class="page">
    <div class="page-head">
      <div>
        <div class="eyebrow">Creator studio</div>
        <h1>Analytics</h1>
        <p class="lead">How your content is performing this week.</p>
      </div>
      <div class="page-head__actions">
        <div class="segmented"><button class="is-active">7d</button><button>30d</button><button>90d</button></div>
      </div>
    </div>

    <div class="stats-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:18px">
      <div class="stat-box"><span>Views</span><b>1.6K</b><span style="font-size:9px;color:var(--ok);margin-top:2px">↑ 24%</span></div>
      <div class="stat-box"><span>Followers</span><b>+49</b><span style="font-size:9px;color:var(--ok);margin-top:2px">↑ 12%</span></div>
      <div class="stat-box"><span>Engagement</span><b>8.4%</b><span style="font-size:9px;color:var(--warn);margin-top:2px">↓ 1%</span></div>
      <div class="stat-box"><span>Earnings</span><b>৳1,240</b><span style="font-size:9px;color:var(--ok);margin-top:2px">↑ 18%</span></div>
    </div>

    <div class="card" style="padding:16px;margin-bottom:14px">
      <h3 style="font-size:12.5px;font-weight:650;margin-bottom:12px">Views this week</h3>
      <div class="an-chart">
        ${views.map((v,i) => `<div class="an-bar"><div class="an-bar__fill" style="height:${(v/maxV*100).toFixed(0)}%"></div><div class="an-bar__label">${days[i]}</div><div class="an-bar__val">${v}</div></div>`).join('')}
      </div>
    </div>

    <div class="card" style="padding:16px;margin-bottom:14px">
      <h3 style="font-size:12.5px;font-weight:650;margin-bottom:12px">Follower growth</h3>
      <div class="an-chart an-chart--sm">
        ${followers.map((v,i) => `<div class="an-bar"><div class="an-bar__fill an-bar__fill--ok" style="height:${(v/14*100).toFixed(0)}%"></div><div class="an-bar__label">${days[i]}</div></div>`).join('')}
      </div>
    </div>

    <div class="card" style="padding:16px">
      <h3 style="font-size:12.5px;font-weight:650;margin-bottom:12px">Top content</h3>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${(D.reels || []).slice(0,4).map((r,i) => `
          <div class="ex-row">
            <div style="font-size:11px;color:var(--faint);width:18px">${i+1}</div>
            <div class="ex-row__art">${N.media(r.grad)}</div>
            <div style="min-width:0;flex:1">
              <div style="font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${N.esc(r.caption)}</div>
              <div style="font-size:10px;color:var(--faint)">${r.views} views · ${N.fmt(r.likes)} likes</div>
            </div>
            <button class="btn btn--ghost btn--sm">${N.ic('chevronRight')}</button>
          </div>`).join('')}
      </div>
    </div>
  </div>`;

  const style = document.createElement('style');
  style.textContent = `
    .an-chart{display:flex;align-items:flex-end;gap:8px;height:160px;padding:0 4px}
    .an-chart--sm{height:100px}
    .an-bar{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;position:relative}
    .an-bar__fill{width:100%;border-radius:6px 6px 0 0;background:var(--grad);min-height:4px;transition:height .4s var(--ease)}
    .an-bar__fill--ok{background:linear-gradient(180deg,var(--ok),rgba(84,211,155,.4))}
    .an-bar__label{font-size:9.5px;color:var(--faint)}
    .an-bar__val{position:absolute;top:-16px;font-size:9px;color:var(--muted)}
  `;
  document.head.appendChild(style);
  N.reveal();
});