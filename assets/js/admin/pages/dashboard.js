/* ==========================================================================
   Nusumo Admin — dashboard page
   State · data shaping · painters · interactions
   ========================================================================== */
(function () {
  const D = window.ADMIN;
  const A = window.A;
  const F = A.fmt;
  const ic = A.ic;
  const esc = A.esc;
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));

  A.boot();

  const PAGE = document.getElementById('aPage');
  const params = new URLSearchParams(location.search);
  const DEBUG = params.get('state');
  const RANGE_KEYS = ['7d', '30d', '90d', '12m'];

  const S = {
    range: RANGE_KEYS.indexOf(params.get('range')) >= 0
      ? params.get('range')
      : (function () { try { const r = localStorage.getItem('nusumo.admin.range'); return RANGE_KEYS.indexOf(r) >= 0 ? r : '30d'; } catch (e) { return '30d'; } })(),
    revenueMode: 'daily',
    hidden: new Set(),
    contentKeys: new Set(['posts', 'reels', 'live']),
    activityTab: 'all',
    resolved: new Set(),
    charts: {},
    sparks: [],
    creatorSparks: [],
    empty: DEBUG === 'empty',
    error: DEBUG === 'error',
    loading: DEBUG === 'loading'
  };

  /* ---------------------------------------------------------------- data helpers */
  const sum = (arr, fn) => arr.reduce((s, x) => s + (fn(x) || 0), 0);
  const monthLabel = (iso) => F.dateShort(iso).split(' ')[1];

  function windowData(range) {
    if (range === '12m') {
      // 12 complete calendar months, so the current partial month never
      // flattens the last bucket or skews the year-over-year delta.
      const last = D.daily[D.daily.length - 1];
      const end = new Date(last.ts);
      const y = end.getUTCFullYear();
      const m = end.getUTCMonth();
      const curStart = Date.UTC(y, m - 11, 1);
      const curEnd = Date.UTC(y, m, 0);
      const prevStart = Date.UTC(y - 1, m - 11, 1);
      const prevEnd = Date.UTC(y - 1, m, 0);
      const cur = D.daily.filter(d => d.ts >= curStart && d.ts <= curEnd);
      const prev = D.daily.filter(d => d.ts >= prevStart && d.ts <= prevEnd);
      return { cur, prev, days: cur.length };
    }
    const days = { '7d': 7, '30d': 30, '90d': 90 }[range] || 30;
    const cur = D.daily.slice(-days);
    const prev = D.daily.slice(-days * 2, -days);
    return { cur, prev, days };
  }

  function bucketRows(arr, bucket) {
    if (!arr.length) return [];
    if (bucket === 'month') {
      const map = new Map();
      arr.forEach(d => {
        const key = d.date.slice(0, 7);
        if (!map.has(key)) map.set(key, { label: monthLabel(d.date), rows: [] });
        map.get(key).rows.push(d);
      });
      return Array.from(map.values()).slice(-12);
    }
    if (bucket === 'week') {
      const out = [];
      for (let i = arr.length; i > 0; i -= 7) {
        const chunk = arr.slice(Math.max(0, i - 7), i);
        out.unshift({ label: F.dateShort(chunk[chunk.length - 1].date), rows: chunk });
      }
      return out;
    }
    return arr.map(d => ({ label: F.dateShort(d.date), rows: [d] }));
  }

  function rangeLabel(range) {
    return { '7d': 'last 7 days', '30d': 'last 30 days', '90d': 'last 90 days', '12m': 'last 12 months' }[range];
  }
  function rangeShort(range) {
    return { '7d': '7 days', '30d': '30 days', '90d': '90 days', '12m': '12 months' }[range];
  }

  function revenueBucket() {
    if (S.range === '12m') return 'month';
    if (S.revenueMode === 'weekly') return 'week';
    if (S.revenueMode === 'monthly') return 'month';
    return 'day';
  }

  function deltaPct(cur, prev) { return prev ? (cur - prev) / prev * 100 : 0; }
  function deltaChip(value) {
    const cls = Math.abs(value) < 0.05 ? '' : value > 0 ? 'a-delta--ok' : 'a-delta--bad';
    const glyph = Math.abs(value) < 0.05 ? '' : value > 0 ? 'arrowUp' : 'arrowDown';
    return `<span class="a-delta ${cls}">${glyph ? ic(glyph) : ''}${Math.abs(value) < 0.05 ? 'No change' : (value > 0 ? '+' : '−') + F.pct(Math.abs(value))}</span>`;
  }

  function emptyBlock(icon, title, text) {
    return `<div class="a-empty"><span class="a-empty__icon">${ic(icon)}</span><strong>${title}</strong><span>${text}</span></div>`;
  }
  function skelBlock(height) {
    return `<div class="a-skel" style="height:${height}px;border-radius:10px"></div>`;
  }
  function skelRows(n) {
    let out = '';
    for (let i = 0; i < n; i++) out += `<div class="a-skeleton-row"><span class="a-skel" style="width:32px;height:32px;border-radius:9px"></span><span style="flex:1"><span class="a-skel" style="display:block;height:9px;width:${55 + (i % 3) * 12}%;"></span><span class="a-skel" style="display:block;height:8px;width:38%;margin-top:6px"></span></span></div>`;
    return `<div class="a-skel-list">${out}</div>`;
  }

  /* ---------------------------------------------------------------- page skeleton */
  function skeletonHTML() {
    return `
      <div class="a-hd">
        <div class="a-hd__main">
          <div class="a-hd__eyebrow">${ic('grid')} Overview</div>
          <h1>Good evening, Mahfuza</h1>
          <p class="a-hd__sub">Here's what happened across Nusumo in the <b data-range-label>${rangeLabel(S.range)}</b>.</p>
          <div class="a-hd__note">${ic('clock')}Updated 2 min ago <span class="a-spacer" style="width:2px"></span> <button data-action="refresh-all">${ic('refresh')}Refresh</button></div>
        </div>
        <div class="a-hd__actions">
          <button class="a-btn" data-action="export">${ic('download')}Export CSV</button>
          <button class="a-btn a-btn--primary" data-action="quick-menu" aria-haspopup="menu">${ic('plus')}Quick action ${ic('chevronDown')}</button>
        </div>
      </div>

      <div class="a-grid a-row-gap">
        ${[0, 1, 2, 3].map(i => `<button class="a-card a-kpi a-card--link a-col-3" id="kpi${i}" data-action="kpi" data-kpi="${['revenue', 'subs', 'users', 'content'][i]}"></button>`).join('')}

        <section class="a-card a-col-8 a-card--h360" id="cardRevenue" aria-labelledby="hRevenue"></section>
        <section class="a-card a-col-4 a-card--h360" id="cardAttention" aria-labelledby="hAttention"></section>

        <section class="a-card a-col-7 a-card--h360" id="cardContent" aria-labelledby="hContent"></section>
        <section class="a-card a-col-5 a-card--h360" id="cardAudience" aria-labelledby="hAudience"></section>

        <section class="a-card a-col-7 a-card--h420" id="cardActivity" aria-labelledby="hActivity"></section>
        <section class="a-card a-col-5 a-card--h420" id="cardCreators" aria-labelledby="hCreators"></section>

        <section class="a-card a-card--compact a-col-4 a-card--h240" id="cardFunnel" aria-labelledby="hFunnel"></section>
        <section class="a-card a-card--compact a-col-4 a-card--h240" id="cardMix" aria-labelledby="hMix"></section>
        <section class="a-card a-card--compact a-col-4 a-card--h240" id="cardHealth" aria-labelledby="hHealth"></section>

        <section class="a-card a-col-12 a-card--h104" id="cardSystem" aria-labelledby="hSystem"></section>
      </div>
      <div class="a-sr" id="aRangeLive" aria-live="polite"></div>`;
  }

  /* ---------------------------------------------------------------- KPI */
  const KPI_META = {
    revenue: { label: 'Net revenue', icon: 'wallet', color: 'var(--a-accent)' },
    subs: { label: 'Active subscribers', icon: 'users', color: 'var(--a-info)' },
    users: { label: 'New users', icon: 'user', color: 'var(--a-warn)' },
    content: { label: 'Published content', icon: 'film', color: 'var(--a-ok)' }
  };

  function kpiData() {
    const { cur, prev } = windowData(S.range);
    const revCur = sum(cur, d => d.revenue.total);
    const revPrev = sum(prev, d => d.revenue.total);
    const usersCur = sum(cur, d => d.users.new);
    const usersPrev = sum(prev, d => d.users.new);
    const contentCur = sum(cur, d => d.content.total);
    const contentPrev = sum(prev, d => d.content.total);
    const subsNow = cur.length ? cur[cur.length - 1].subsActive : 0;
    const subsStart = cur.length ? cur[0].subsActive : 0;

    const sparkOf = (arr, fn, n) => arr.slice(-(n || 30)).map(fn);
    return {
      revenue: {
        value: F.money(revCur),
        delta: deltaPct(revCur, revPrev),
        spark: sparkOf(cur, d => d.revenue.total),
        footer: `vs ${F.money(revPrev)} prior`,
        sub: `${F.num(cur.length)} days`
      },
      subs: {
        value: F.num(subsNow),
        delta: deltaPct(subsNow, subsStart),
        spark: sparkOf(cur, d => d.subsActive),
        footer: `${F.num(Math.round(subsNow * 1.09))} total seats`,
        sub: `+${F.num(Math.round(subsNow * 0.045))} pending`
      },
      users: {
        value: F.num(usersCur),
        delta: deltaPct(usersCur, usersPrev),
        spark: sparkOf(cur, d => d.users.new),
        footer: `${F.num(Math.round(usersCur * 0.15))} pending verification`,
        sub: `${F.num(sum(cur, d => d.users.signups))} signups`
      },
      content: {
        value: F.num(contentCur),
        delta: deltaPct(contentCur, contentPrev),
        spark: sparkOf(cur, d => d.content.total),
        footer: `${F.num(sum(cur, d => d.content.reels))} reels · ${F.num(sum(cur, d => d.content.live))} live`,
        sub: `${F.num(sum(cur, d => d.content.posts))} posts`
      }
    };
  }

  function paintKpis() {
    const data = kpiData();
    clearSparks();
    ['revenue', 'subs', 'users', 'content'].forEach((key, i) => {
      const el = $('#kpi' + i);
      const meta = KPI_META[key];
      const d = data[key];
      if (S.error) {
        el.innerHTML = `<div class="a-kpi__top"><span class="a-kpi__label">${meta.label}</span><span class="a-kpi__icon">${ic(meta.icon)}</span></div>
          <div class="a-kpi__value-row"><span class="a-kpi__value">—</span><span class="a-delta">Unavailable</span></div>
          <div class="a-kpi__spark"></div><div class="a-kpi__foot"><span>Could not load metric</span></div>`;
        return;
      }
      if (S.loading) {
        el.innerHTML = `<div class="a-kpi__top"><span class="a-kpi__label">${meta.label}</span><span class="a-kpi__icon">${ic(meta.icon)}</span></div>
          <div class="a-skel a-skel--value"></div><div class="a-skel a-skel--line" style="margin-top:10px"></div>
          <div class="a-kpi__spark"></div>`;
        return;
      }
      el.innerHTML = `
        <div class="a-kpi__top">
          <span class="a-kpi__label">${meta.label}</span>
          <span class="a-kpi__icon">${ic(meta.icon)}</span>
        </div>
        <div class="a-kpi__value-row">
          <span class="a-kpi__value">${S.empty ? (key === 'revenue' ? F.money(0) : '0') : d.value}</span>
          ${S.empty ? '<span class="a-delta">No change</span>' : deltaChip(d.delta)}
        </div>
        <div class="a-kpi__spark" data-spark="${key}" style="height:36px"></div>
        <div class="a-kpi__foot"><span>${S.empty ? 'Nothing recorded in this period' : d.footer}</span>${ic('chevronRight')}</div>`;

      const sparkEl = el.querySelector('[data-spark]');
      S.sparks.push(Chart.spark(sparkEl, {
        values: S.empty ? new Array(12).fill(0) : d.spark,
        height: 36,
        color: meta.color
      }));
    });
  }

  /* ---------------------------------------------------------------- revenue */
  function revenueSeries() {
    const { cur } = windowData(S.range);
    const rows = bucketRows(cur, revenueBucket());
    const labels = rows.map(r => r.label);
    const series = [
      { key: 'subs', label: 'Subscriptions', color: 'var(--a-accent)', values: rows.map(r => sum(r.rows, d => d.revenue.subs)) },
      { key: 'premium', label: 'Premium', color: 'var(--a-info)', values: rows.map(r => sum(r.rows, d => d.revenue.premium)) },
      { key: 'boosts', label: 'Boosts', color: 'var(--a-ok)', values: rows.map(r => sum(r.rows, d => d.revenue.boosts)) }
    ];
    return { labels, series, rows };
  }

  function destroyChart(key) {
    if (S.charts[key] && S.charts[key].destroy) S.charts[key].destroy();
    delete S.charts[key];
  }

  function clearSparks() {
    S.sparks.forEach(s => { if (s && s.destroy) s.destroy(); });
    S.sparks = [];
  }

  function paintRevenue() {
    const el = $('#cardRevenue');
    destroyChart('revenue');
    const { labels, series } = revenueSeries();
    const visible = series.filter(s => !S.hidden.has(s.key));
    const total = series.reduce((s, sr) => s + sr.values.reduce((a, b) => a + b, 0), 0);
    const { cur, prev } = windowData(S.range);
    const prevTotal = sum(prev, d => d.revenue.total);
    const delta = deltaPct(total, prevTotal);
    const mode = S.range === '12m' ? 'monthly' : S.revenueMode;

    el.innerHTML = `
      <div class="a-card__head">
        <div class="a-card__titles">
          <h2 class="a-card__title" id="hRevenue">Revenue</h2>
          <p class="a-card__meta">Subscriptions, premium and boosts</p>
        </div>
        <div class="a-card__actions">
          <div class="a-seg" role="group" aria-label="Revenue granularity">
            ${['daily', 'weekly', 'monthly'].map(m => `<button data-action="revenue-mode" data-mode="${m}" class="${mode === m ? 'is-active' : ''}" ${S.range === '12m' ? 'disabled' : ''}>${m[0].toUpperCase() + m.slice(1)}</button>`).join('')}
          </div>
        </div>
      </div>
      <div class="a-card__body">
        <div class="a-legend" style="margin-bottom:10px">
          ${series.map(s => `<button class="a-legend__item ${S.hidden.has(s.key) ? 'is-off' : ''}" data-action="revenue-series" data-key="${s.key}" aria-pressed="${!S.hidden.has(s.key)}" ${visible.length === 1 && !S.hidden.has(s.key) ? 'aria-disabled="true"' : ''}>
            <i style="background:${s.color}"></i>${s.label}
          </button>`).join('')}
        </div>
        ${S.empty ? emptyBlock('chart', 'No revenue in this period', 'When subscribers renew or boosts sell, it appears here.')
          : S.error ? emptyBlock('alert', 'Revenue could not load', 'The metrics service did not respond. Try refreshing.')
            : S.loading ? '<div class="a-skel" style="height:190px;border-radius:10px"></div>'
              : '<div class="a-chart" data-chart="revenue" style="height:190px"></div>'}
        ${!S.empty && !S.error && !S.loading ? Chart.dataTable(labels, series, v => F.moneyCompact(v)) : ''}
      </div>
      <div class="a-card__foot">
        <span>Total <b>${S.empty || S.error || S.loading ? '—' : F.money(total)}</b></span>
        ${!S.empty && !S.error && !S.loading ? deltaChip(delta) : ''}
        <span class="a-spacer"></span>
        <button data-action="kpi" data-kpi="revenue">Open report ${ic('arrowRight')}</button>
      </div>`;

    if (!S.empty && !S.error && !S.loading) {
      S.charts.revenue = Chart.area(el.querySelector('[data-chart="revenue"]'), {
        labels,
        series: visible,
        height: 190,
        stacked: true,
        yFmt: v => F.moneyCompact(v),
        tipFmt: v => F.money(v),
        ariaLabel: `Revenue, ${rangeLabel(S.range)}, total ${F.money(total)}`
      });
    }
  }

  /* ---------------------------------------------------------------- attention */
  function attentionRows() {
    return D.attention.filter(a => !S.resolved.has(a.id));
  }

  function paintAttention() {
    const el = $('#cardAttention');
    const rows = attentionRows();
    const total = rows.reduce((s, a) => s + a.count, 0);
    el.innerHTML = `
      <div class="a-card__head">
        <div class="a-card__titles">
          <h2 class="a-card__title" id="hAttention">Needs attention</h2>
          <p class="a-card__meta">${total ? total + ' items waiting across ' + rows.length + ' queues' : 'Everything is handled'}</p>
        </div>
        <div class="a-card__actions">
          <span class="a-badge ${total ? 'a-badge--bad' : 'a-badge--ok'}">${total}</span>
          <button class="a-icon-btn" data-action="refresh-attention" aria-label="Refresh tasks">${ic('refresh')}</button>
        </div>
      </div>
      ${rows.length ? `<div class="a-attn">${rows.map(a => `
        <button class="a-attn__row a-attn__row--${a.severity}" data-action="attention-row" data-id="${a.id}">
          <span class="a-dot a-dot--${a.severity === 'bad' ? 'bad' : 'warn'}"></span>
          <span class="a-attn__meta">
            <span class="a-attn__title">${esc(a.title)}</span>
            <span class="a-attn__sub">${esc(a.meta)}${a.amount ? ' · ' + F.money(a.amount) : ''}</span>
          </span>
          <span class="a-attn__count">${a.count}</span>
          ${ic('chevronRight')}
        </button>`).join('')}</div>`
        : emptyBlock('shield', 'Nothing needs you right now', 'Payouts, flags and failures will surface here.')}
      <div class="a-card__foot">
        ${rows.length ? `<span>Updated ${F.rel(new Date(F.now()).toISOString())}</span>` : '<span>No open queues</span>'}
        <span class="a-spacer"></span>
        <button data-action="open-attention-first">Review queue ${ic('arrowRight')}</button>
      </div>`;
  }

  /* ---------------------------------------------------------------- content */
  function contentData() {
    const { cur } = windowData(S.range);
    const rows = bucketRows(cur, S.range === '12m' ? 'month' : 'day');
    return {
      labels: rows.map(r => r.label),
      series: [
        { key: 'posts', label: 'Posts', color: 'var(--a-accent)', values: rows.map(r => sum(r.rows, d => d.content.posts)) },
        { key: 'reels', label: 'Reels', color: 'var(--a-info)', values: rows.map(r => sum(r.rows, d => d.content.reels)) },
        { key: 'live', label: 'Live', color: 'var(--a-ok)', values: rows.map(r => sum(r.rows, d => d.content.live)) }
      ]
    };
  }

  function paintContent() {
    const el = $('#cardContent');
    destroyChart('content');
    const { labels, series } = contentData();
    const visible = series.filter(s => S.contentKeys.has(s.key));
    const totals = series.reduce((acc, s) => { acc[s.key] = s.values.reduce((a, b) => a + b, 0); return acc; }, {});
    const grand = Object.values(totals).reduce((a, b) => a + b, 0);
    let best = { label: '—', value: 0 };
    labels.forEach((l, i) => {
      const v = series.reduce((s, sr) => s + (sr.values[i] || 0), 0);
      if (v > best.value) best = { label: l, value: v };
    });

    el.innerHTML = `
      <div class="a-card__head">
        <div class="a-card__titles">
          <h2 class="a-card__title" id="hContent">Content performance</h2>
          <p class="a-card__meta">Published items ${S.range === '12m' ? 'per month' : 'by day'}</p>
        </div>
        <div class="a-card__actions">
          <div class="a-content-legend" role="group" aria-label="Content types">
            ${series.map(s => `<button class="a-chip ${S.contentKeys.has(s.key) ? 'is-active' : ''}" data-action="content-chip" data-key="${s.key}" aria-pressed="${S.contentKeys.has(s.key)}">
              <svg viewBox="0 0 24 24" style="fill:${s.color}"><circle cx="12" cy="12" r="8"/></svg>${s.label}
            </button>`).join('')}
          </div>
        </div>
      </div>
      <div class="a-card__body">
        ${S.empty ? emptyBlock('film', 'No content published', 'Posts, reels and live streams will be counted here.')
          : S.error ? emptyBlock('alert', 'Content metrics could not load', 'Try refreshing the dashboard.')
            : S.loading ? '<div class="a-skel" style="height:212px;border-radius:10px"></div>'
              : '<div class="a-chart a-content-chart" data-chart="content"></div>'}
        ${!S.empty && !S.error && !S.loading ? Chart.dataTable(labels, series, v => F.num(v)) : ''}
      </div>
      <div class="a-card__foot">
        <span><b>${S.empty || S.error || S.loading ? '—' : F.num(grand)}</b> published</span>
        <span class="a-spacer"></span>
        <span>${S.empty ? 'Nothing published in this period' : S.error ? 'Content metrics unavailable' : S.loading ? 'Loading content metrics…' : `${S.range === '12m' ? 'Top month' : 'Best day'} <b>${best.label}</b> · ${best.value} items`}</span>
      </div>`;

    if (!S.empty && !S.error && !S.loading) {
      S.charts.content = Chart.bars(el.querySelector('[data-chart="content"]'), {
        labels,
        series: visible.length ? visible : series,
        height: 212,
        stacked: true,
        yFmt: v => F.num(v),
        ariaLabel: `Content published, ${rangeLabel(S.range)}`
      });
    }
  }

  /* ---------------------------------------------------------------- audience */
  function paintAudience() {
    const el = $('#cardAudience');
    const { cur } = windowData(S.range);
    const subs = cur.length ? cur[cur.length - 1].subsActive : 0;
    const segs = D.audience.gender.map(g => ({ label: g.label, color: g.color, value: Math.round(subs * g.share) }));
    el.innerHTML = `
      <div class="a-card__head">
        <div class="a-card__titles">
          <h2 class="a-card__title" id="hAudience">Audience</h2>
          <p class="a-card__meta">Active subscribers by gender and country</p>
        </div>
      </div>
      <div class="a-card__body">
        ${S.empty ? emptyBlock('users', 'No audience data yet', 'Once people subscribe, their profile mix appears here.')
          : S.error ? emptyBlock('alert', 'Audience could not load', 'The profile service did not respond. Try refreshing.')
          : S.loading ? skelBlock(190)
          : `
        <div class="a-aud">
          <div class="a-aud__donut" style="width:150px;height:150px">
            <div data-chart="audience"></div>
            <div class="a-aud__center"><b>${F.compact(subs)}</b><span>subscribers</span></div>
          </div>
          <div class="a-aud__legend">
            ${segs.map(s => `<div class="a-aud__row"><i style="background:${s.color}"></i><span>${s.label}</span><b>${Math.round(s.value / subs * 100)}%</b><small>${F.compact(s.value)}</small></div>`).join('')}
          </div>
        </div>
        <div class="a-aud__countries">
          ${D.audience.countries.map(c => `<div class="a-aud__country">
            <span>${esc(c.name)}</span>
            <div class="a-aud__bar"><i style="width:${Math.round(c.share * 100)}%"></i></div>
            <b>${Math.round(c.share * 100)}%</b>
          </div>`).join('')}
        </div>`}
      </div>
      <div class="a-card__foot">
        <span>${S.empty ? 'No subscribers in this period' : S.error ? 'Audience unavailable' : S.loading ? 'Loading audience…' : F.num(subs) + ' active subscribers'}</span>
        <span class="a-spacer"></span>
        <button data-action="audience-more" ${S.loading ? 'disabled' : ''}>Explore audience ${ic('arrowRight')}</button>
      </div>`;

    if (!S.empty && !S.error && !S.loading) {
      Chart.donut(el.querySelector('[data-chart="audience"]'), {
        size: 150, thickness: 20, segments: segs,
        ariaLabel: 'Subscribers by gender'
      });
    }
  }

  /* ---------------------------------------------------------------- activity */
  const ACTIVITY_TABS = [
    { key: 'all', label: 'All' },
    { key: 'users', label: 'Users' },
    { key: 'revenue', label: 'Revenue' },
    { key: 'moderation', label: 'Moderation' }
  ];

  function activityList() {
    return D.activity.filter(ev => {
      if (S.activityTab === 'all') return true;
      if (S.activityTab === 'users') return ev.kind === 'user_joined' || ev.kind === 'verification';
      if (S.activityTab === 'revenue') return ev.kind === 'subscription_new' || ev.kind === 'payment' || ev.kind === 'payout';
      return ev.kind === 'post_flagged';
    });
  }

  function activityRow(ev) {
    const u = ev.user;
    let lead, text, meta = '', end = '';
    if (ev.kind === 'user_joined') {
      lead = A.av(u, 32);
      text = `<b>${esc(u.name)}</b> joined Nusumo`;
      meta = `Community · via ${ev.via}`;
    } else if (ev.kind === 'subscription_new') {
      lead = `<span class="a-feed__lead a-feed__lead--accent">${ic('card')}</span>`;
      text = `<b>${esc(u.name)}</b> subscribed to ${ev.plan}`;
      meta = 'Subscription · monthly';
      end = `<b>${F.money(ev.amount)}</b>`;
    } else if (ev.kind === 'payment') {
      lead = `<span class="a-feed__lead a-feed__lead--ok">${ic('wallet')}</span>`;
      text = `<b>${esc(u.name)}</b> paid for ${esc(ev.product)}`;
      meta = 'Payment · card';
      end = `<b>${F.money(ev.amount)}</b>`;
    } else if (ev.kind === 'payout') {
      lead = `<span class="a-feed__lead a-feed__lead--warn">${ic('arrowRight')}</span>`;
      text = `Payout sent to <b>${esc(u.name)}</b>`;
      meta = 'Payout · bank transfer';
      end = `<b>${F.money(ev.amount)}</b>`;
    } else if (ev.kind === 'post_flagged') {
      lead = `<span class="a-feed__lead a-feed__lead--bad">${ic('flag')}</span>`;
      text = `Post by <b>${esc(u.name)}</b> was flagged`;
      meta = `Moderation · ${ev.reason}`;
      end = `<span class="a-badge a-badge--bad">Review</span>`;
    } else {
      lead = `<span class="a-feed__lead a-feed__lead--accent">${ic('shield')}</span>`;
      text = `<b>${esc(u.name)}</b> verification approved`;
      meta = `Community · ${ev.doc}`;
      end = `<span class="a-badge a-badge--ok">Verified</span>`;
    }
    return `<button class="a-feed__row" data-action="activity" data-id="${ev.id}">
      ${lead}
      <span class="a-feed__meta"><span class="a-feed__text">${text}</span><span class="a-feed__sub">${meta} · ${F.rel(ev.at)}</span></span>
      <span class="a-feed__end">${end}</span>
    </button>`;
  }

  function paintActivity() {
    const el = $('#cardActivity');
    const list = activityList();
    el.innerHTML = `
      <div class="a-card__head">
        <div class="a-card__titles">
          <h2 class="a-card__title" id="hActivity">Recent activity</h2>
          <p class="a-card__meta">Everything that happened across the workspace</p>
        </div>
        <div class="a-card__actions">
          <div class="a-tabs" role="tablist" aria-label="Activity filter">
            ${ACTIVITY_TABS.map(t => `<button class="a-tab ${S.activityTab === t.key ? 'is-active' : ''}" data-action="activity-tab" data-tab="${t.key}" role="tab" aria-selected="${S.activityTab === t.key}">${t.label}</button>`).join('')}
          </div>
        </div>
      </div>
      ${S.loading ? skelRows(5)
        : S.empty || S.error || !list.length
        ? (S.error
          ? emptyBlock('alert', 'Activity could not load', 'The activity feed did not respond. Try refreshing.')
          : emptyBlock('clock', 'No activity in this period', 'User, revenue and moderation events will appear here as they happen.'))
        : `<div class="a-feed">${list.slice(0, 24).map(activityRow).join('')}</div>`}
      <div class="a-card__foot">
        <span>${S.empty || S.error ? 'Nothing to show' : S.loading ? 'Loading events…' : F.num(list.length) + ' events'}</span>
        <span class="a-spacer"></span>
        <button data-action="activity-all">View all ${ic('arrowRight')}</button>
      </div>`;
  }

  /* ---------------------------------------------------------------- creators */
  function paintCreators() {
    const el = $('#cardCreators');
    el.innerHTML = `
      <div class="a-card__head">
        <div class="a-card__titles">
          <h2 class="a-card__title" id="hCreators">Top creators</h2>
          <p class="a-card__meta">By net earnings · ${rangeShort(S.range)}</p>
        </div>
        <div class="a-card__actions">
          <button class="a-chip" data-action="creators-all">View all</button>
        </div>
      </div>
      ${S.loading
        ? skelRows(5)
        : S.empty
        ? emptyBlock('users', 'No creator earnings yet', 'When creators make sales, their ranking shows up here.')
        : S.error
          ? emptyBlock('alert', 'Creator earnings could not load', 'The payouts service did not respond. Try refreshing.')
        : `<div class="a-creators">
        ${D.creators.map((c, i) => `
          <button class="a-creator" data-action="creator" data-id="${c.id}">
            <span class="a-creator__rank">${i + 1}</span>
            ${A.av({ name: c.name, initials: c.name.split(' ').map(x => x[0]).join('').slice(0, 2), grad: c.grad }, 30)}
            <span class="a-creator__meta">
              <span class="a-creator__name">${esc(c.name)}${c.verified ? '<svg class="verified" viewBox="0 0 24 24" style="width:11px;height:11px;fill:var(--a-accent-soft)" aria-hidden="true"><path d="M12 1.8l2.6 2 3.2-.2 1 3.1 2.6 1.9-1.2 3 1.2 3-2.6 1.9-1 3.1-3.2-.2-2.6 2-2.6-2-3.2.2-1-3.1L2.6 15l1.2-3-1.2-3 2.6-1.9 1-3.1 3.2.2Z"/></svg>' : ''}</span>
              <span class="a-creator__sub">${esc(c.handle)} · ${F.compact(c.subscribers)} subs</span>
            </span>
            <span class="a-creator__spark" data-spark="${c.id}"></span>
            <span class="a-creator__earn"><b>${F.money(c.earnings)}</b><small style="color:${c.growth >= 0 ? 'var(--a-ok)' : 'var(--a-bad)'}">${c.growth >= 0 ? '+' : ''}${c.growth}%</small></span>
          </button>`).join('')}
      </div>`}
      <div class="a-card__foot">
        <span>${S.loading ? 'Loading creators…' : (S.empty || S.error) ? 'Creator ranking unavailable' : 'Top 5 of ' + F.num(D.users.length) + ' creators'}</span>
        <span class="a-spacer"></span>
        <button data-action="creators-all">Leaderboard ${ic('arrowRight')}</button>
      </div>`;

    if (!S.empty && !S.error && !S.loading) {
      S.creatorSparks.forEach(s => { if (s && s.destroy) s.destroy(); });
      S.creatorSparks = [];
      D.creators.forEach(c => {
        const holder = el.querySelector(`[data-spark="${c.id}"]`);
        if (holder) S.creatorSparks.push(Chart.spark(holder, { values: c.spark, height: 20, color: c.growth >= 0 ? 'var(--a-ok)' : 'var(--a-bad)' }));
      });
    }
  }

  /* ---------------------------------------------------------------- funnel + mix + health */
  function funnelData() {
    const { cur } = windowData(S.range);
    const visits = sum(cur, d => d.users.visits);
    const signups = sum(cur, d => d.users.signups);
    const subscribed = Math.round(signups * 0.392);
    const renewed = Math.round(subscribed * 0.755);
    return { visits, signups, subscribed, renewed };
  }

  function paintFunnel() {
    const el = $('#cardFunnel');
    const f = funnelData();
    const rows = [
      { label: 'Visits', value: f.visits, conversion: 100 },
      { label: 'Signups', value: f.signups, conversion: (f.signups / f.visits * 100) },
      { label: 'Subscribed', value: f.subscribed, conversion: (f.subscribed / f.signups * 100) },
      { label: 'Renewed', value: f.renewed, conversion: (f.renewed / f.subscribed * 100) }
    ];
    el.innerHTML = `
      <div class="a-card__head">
        <div class="a-card__titles"><h2 class="a-card__title" id="hFunnel">Acquisition funnel</h2>
        <p class="a-card__meta">Visit to renewal</p></div>
      </div>
      <div class="a-card__body">
        ${S.empty ? emptyBlock('chart', 'No funnel data', 'Not enough traffic in this period.')
          : S.error ? emptyBlock('alert', 'Funnel could not load', 'Traffic data is unavailable right now.')
          : S.loading ? skelBlock(120)
          : '<div data-chart="funnel"></div>'}
      </div>`;
    if (!S.empty && !S.error && !S.loading) Chart.hbar(el.querySelector('[data-chart="funnel"]'), { rows, fmt: v => F.compact(v) });
  }

  function paintMix() {
    const el = $('#cardMix');
    const { cur } = windowData(S.range);
    const total = sum(cur, d => d.revenue.total);
    const segs = D.paymentsMix.map(p => ({ label: p.method, color: p.color, value: Math.round(total * p.share) }));
    el.innerHTML = `
      <div class="a-card__head">
        <div class="a-card__titles"><h2 class="a-card__title" id="hMix">Payment mix</h2>
        <p class="a-card__meta">How revenue arrived</p></div>
      </div>
      <div class="a-card__body">
        ${S.empty ? emptyBlock('wallet', 'No payments yet', 'Payment methods appear once money moves.')
          : S.error ? emptyBlock('alert', 'Payment mix could not load', 'Payment data is unavailable right now.')
          : S.loading ? skelBlock(120)
          : '<div data-chart="mix"></div>'}
      </div>`;
    if (!S.empty && !S.error && !S.loading) Chart.mix(el.querySelector('[data-chart="mix"]'), { segments: segs, fmt: v => F.moneyCompact(v) });
  }

  function paintHealth() {
    const el = $('#cardHealth');
    const { cur } = windowData(S.range);
    const active = cur.length ? cur[cur.length - 1].subsActive : 0;
    const grace = Math.round(active * 0.034);
    const cancelled = Math.round(active * 0.056);
    const total = active + grace + cancelled;
    const segs = [
      { label: 'Active', value: active, color: 'var(--a-ok)' },
      { label: 'In grace', value: grace, color: 'var(--a-warn)' },
      { label: 'Cancelled', value: cancelled, color: 'var(--a-bad)' }
    ];
    el.innerHTML = `
      <div class="a-card__head">
        <div class="a-card__titles"><h2 class="a-card__title" id="hHealth">Subscription health</h2>
        <p class="a-card__meta">Active, grace and churn</p></div>
      </div>
      <div class="a-card__body">
        ${S.empty ? emptyBlock('card', 'No subscription activity yet', 'The health mix appears once subscriptions exist.')
          : S.error ? emptyBlock('alert', 'Subscription health could not load', 'Billing data is unavailable right now.')
          : S.loading ? skelBlock(120)
          : `
          <div class="a-health">
            <div class="a-health__bar" role="img" aria-label="${active} active, ${grace} in grace, ${cancelled} cancelled">
              ${segs.map(s => `<i style="width:${(s.value / total * 100).toFixed(2)}%;background:${s.color}"></i>`).join('')}
            </div>
            <div class="a-health__legend">
              ${segs.map(s => `<div class="a-health__row"><i style="background:${s.color}"></i><span>${s.label}</span><b>${F.num(s.value)}</b></div>`).join('')}
            </div>
            <div class="a-health__note">${ic('info')}Churn ${(cancelled / total * 100).toFixed(1)}% · target under 3%</div>
          </div>`}
      </div>`;
  }

  /* ---------------------------------------------------------------- system */
  function paintSystem() {
    const el = $('#cardSystem');
    el.innerHTML = `
      <h2 class="a-sr" id="hSystem">System status</h2>
      <div class="a-system">
        ${D.system.map(t => `<button class="a-system__tile" data-action="system-tile" data-key="${t.key}">
          <span class="a-system__label">${esc(t.label)}</span>
          <span class="a-system__value">${esc(t.value)}</span>
          <span class="a-system__note"><span class="a-dot a-dot--${t.status}"></span>${esc(t.note)}</span>
        </button>`).join('')}
      </div>`;
  }

  /* ---------------------------------------------------------------- paint all */
  function paintAll() {
    paintKpis();
    paintRevenue();
    paintAttention();
    paintContent();
    paintAudience();
    paintActivity();
    paintCreators();
    paintFunnel();
    paintMix();
    paintHealth();
    paintSystem();
    const label = $('[data-range-label]');
    if (label) label.textContent = rangeLabel(S.range);
  }

  /* ---------------------------------------------------------------- sheets */
  function openKpiSheet(key) {
    if (S.empty || S.error) { A.toast('No data available for this metric in the current state', 'warn'); return; }
    const meta = KPI_META[key];
    const { cur } = windowData(S.range);
    const rows = bucketRows(cur, key === 'content' ? (S.range === '12m' ? 'month' : 'day') : 'day');
    const labels = rows.map(r => r.label);
    const pick = {
      revenue: { title: 'Net revenue', series: [{ label: 'Revenue', color: 'var(--a-accent)', values: rows.map(r => sum(r.rows, d => d.revenue.total)) }], fmt: F.money, total: sum(cur, d => d.revenue.total) },
      subs: { title: 'Active subscribers', series: [{ label: 'Active', color: 'var(--a-info)', values: rows.map(r => r.rows[r.rows.length - 1].subsActive) }], fmt: F.num, total: cur.length ? cur[cur.length - 1].subsActive : 0 },
      users: { title: 'New users', series: [{ label: 'New users', color: 'var(--a-warn)', values: rows.map(r => sum(r.rows, d => d.users.new)) }], fmt: F.num, total: sum(cur, d => d.users.new) },
      content: { title: 'Published content', series: [{ label: 'Items', color: 'var(--a-ok)', values: rows.map(r => sum(r.rows, d => d.content.total)) }], fmt: F.num, total: sum(cur, d => d.content.total) }
    }[key];

    A.sheet({
      title: pick.title,
      sub: `${rangeShort(S.range)} · ${labels.length ? labels[0] : ''} to ${labels.length ? labels[labels.length - 1] : ''}`,
      body: `<div class="a-sheet-stats">
          <div class="a-sheet-stat"><span>Total</span><b>${key === 'revenue' ? F.money(pick.total) : F.num(pick.total)}</b></div>
          <div class="a-sheet-stat"><span>Daily avg</span><b>${key === 'revenue' ? F.money(pick.total / Math.max(1, rows.length)) : F.num(pick.total / Math.max(1, rows.length))}</b></div>
          <div class="a-sheet-stat"><span>Period</span><b>${rangeShort(S.range)}</b></div>
        </div>
        <div class="a-chart" style="height:220px" data-sheet-chart></div>
        ${Chart.dataTable(labels, pick.series, v => pick.fmt(v))}`,
      foot: `<button class="a-btn" data-close-sheet>Close</button><span class="a-spacer"></span><button class="a-btn a-btn--primary" data-export-metric>Export this series</button>`,
      onMount(panel, close) {
        const chart = Chart.area(panel.querySelector('[data-sheet-chart]'), {
          labels,
          series: pick.series,
          height: 220,
          stacked: false,
          yFmt: v => key === 'revenue' ? F.moneyCompact(v) : F.compact(v),
          tipFmt: v => key === 'revenue' ? F.money(v) : F.num(v),
          ariaLabel: `${pick.title} over ${rangeShort(S.range)}`
        });
        panel.querySelectorAll('[data-close-sheet]').forEach(b => b.addEventListener('click', () => { chart.destroy(); close(); }));
        panel.querySelector('[data-export-metric]').addEventListener('click', () => {
          A.toast(`${pick.title} exported`, 'ok');
        });
      }
    });
  }

  function openCreator(id) {
    const c = D.creators.find(x => x.id === id) || D.creators[0];
    A.sheet({
      title: 'Creator detail',
      sub: 'Performance in the current period',
      body: `<div class="a-row" style="gap:12px;margin-bottom:16px">
          ${A.av({ name: c.name, initials: c.name.split(' ').map(x => x[0]).join('').slice(0, 2), grad: c.grad }, 44)}
          <div style="min-width:0">
            <div style="font-size:14px;font-weight:650">${esc(c.name)}</div>
            <div style="font-size:11.5px;color:var(--a-faint)">${esc(c.handle)} · ${esc(c.verified ? 'Verified creator' : 'Creator')}</div>
          </div>
        </div>
        <div class="a-sheet-stats">
          <div class="a-sheet-stat"><span>Earnings</span><b>${F.money(c.earnings)}</b></div>
          <div class="a-sheet-stat"><span>Subscribers</span><b>${F.num(c.subscribers)}</b></div>
          <div class="a-sheet-stat"><span>Published</span><b>${F.num(c.content)}</b></div>
        </div>
        <div class="a-chart" style="height:160px" data-creator-chart></div>
        <h3 style="font-size:12px;font-weight:650;margin:18px 0 8px">Top content</h3>
        <div class="a-sheet-list">
          ${['Modular ambient set', 'Studio walkthrough', 'Patch notes deep dive'].map((t, i) => `
            <div class="a-sheet-row">
              <span class="a-feed__lead a-feed__lead--accent">${ic(i === 0 ? 'film' : i === 1 ? 'live' : 'book')}</span>
              <span class="a-sheet-row__meta"><b>${t}</b><span>${F.compact(1200 - i * 260)} views · ${F.num(180 - i * 40)} likes</span></span>
              <span class="a-badge">${i === 0 ? 'Reel' : i === 1 ? 'Live' : 'Post'}</span>
            </div>`).join('')}
        </div>`,
      foot: `<button class="a-btn" data-close-sheet>Close</button><span class="a-spacer"></span><button class="a-btn a-btn--primary" data-msg>Message creator</button>`,
      onMount(panel, close) {
        Chart.spark(panel.querySelector('[data-creator-chart]'), { values: c.spark, height: 160, color: 'var(--a-accent)' });
        panel.querySelectorAll('[data-close-sheet]').forEach(b => b.addEventListener('click', close));
        panel.querySelector('[data-msg]').addEventListener('click', () => { close(); A.toast(`Message draft opened for ${c.name}`, 'ok'); });
      }
    });
  }

  function openSystemSheet(key) {
    const tiles = D.system.map(t => ({ ...t }));
    A.sheet({
      title: 'System health',
      sub: 'Five checks · one warning',
      body: `<div class="a-sheet-stats">
          <div class="a-sheet-stat"><span>Checks</span><b>5</b></div>
          <div class="a-sheet-stat"><span>Warnings</span><b style="color:var(--a-warn)">1</b></div>
          <div class="a-sheet-stat"><span>Failures</span><b style="color:var(--a-bad)">1</b></div>
        </div>
        <div class="a-sheet-list">
          ${tiles.map(t => `<div class="a-sheet-row" data-check="${t.key}">
            <span class="a-dot a-dot--${t.status}"></span>
            <span class="a-sheet-row__meta"><b>${esc(t.label)}</b><span>${esc(t.note)}</span></span>
            <span style="font-size:12px;font-weight:650;font-variant-numeric:tabular-nums">${esc(t.value)}</span>
          </div>`).join('')}
        </div>
        <p class="a-form-note" style="margin-top:14px">Failed jobs are retried automatically every 15 minutes. Storage crosses 80% at 40 GB.</p>`,
      foot: `<button class="a-btn a-btn--primary" data-run>${ic('refresh')}Run health check</button><span class="a-spacer"></span><button class="a-btn" data-close-sheet>Close</button>`,
      onMount(panel, close) {
        panel.querySelectorAll('[data-close-sheet]').forEach(b => b.addEventListener('click', close));
        panel.querySelector('[data-run]').addEventListener('click', () => { close(); A.runHealthCheck(); });
      }
    });
  }

  function openActivityAll() {
    const list = activityList();
    A.sheet({
      title: 'All activity',
      sub: `${list.length} events in the ${rangeLabel(S.range)}`,
      body: `<div class="a-sheet-list">${list.slice(0, 40).map(ev => {
        const u = ev.user;
        return `<div class="a-sheet-row">
          ${ev.kind === 'user_joined' ? A.av(u, 28) : `<span class="a-feed__lead" style="width:28px;height:28px">${ic(ev.kind === 'post_flagged' ? 'flag' : ev.kind === 'payment' ? 'wallet' : ev.kind === 'payout' ? 'arrowRight' : 'card')}</span>`}
          <span class="a-sheet-row__meta"><b>${esc(u.name)}</b><span>${esc(ev.kind.replace('_', ' '))} · ${F.rel(ev.at)}</span></span>
          ${ev.amount ? `<span style="font-size:11.5px;font-weight:650">${F.money(ev.amount)}</span>` : ''}
        </div>`;
      }).join('')}</div>`,
      foot: `<button class="a-btn" data-close-sheet>Close</button><span class="a-spacer"></span><button class="a-btn a-btn--primary" data-export-all>Export events</button>`,
      onMount(panel, close) {
        panel.querySelectorAll('[data-close-sheet]').forEach(b => b.addEventListener('click', close));
        panel.querySelector('[data-export-all]').addEventListener('click', () => { close(); A.toast('Activity exported', 'ok'); });
      }
    });
  }

  function quickMenu(anchor) {
    A.menu(anchor, [
      { label: 'Create' },
      { text: 'New announcement', icon: 'bell', onClick: A.announceSheet },
      { text: 'Invite a user', icon: 'plus', onClick: A.inviteSheet },
      { text: 'Create promotion', icon: 'zap', onClick: promotionSheet },
      { sep: true },
      { label: 'Revenue' },
      { text: 'Refund a payment', icon: 'wallet', onClick: refundSheet },
      { text: 'Export dashboard', icon: 'download', onClick: exportCSV }
    ]);
  }

  function promotionSheet() {
    A.sheet({
      title: 'Create promotion',
      sub: 'Applies to every plan in the selected scope.',
      body: `<div class="a-field"><label for="pmName">Name</label><input class="a-input" id="pmName" placeholder="Autumn boost week"></div>
        <div class="a-field"><label for="pmPct">Discount</label><select class="a-select" id="pmPct"><option>10% off</option><option>20% off</option><option>30% off</option><option>First month free</option></select></div>
        <div class="a-field"><label for="pmScope">Scope</label><select class="a-select" id="pmScope"><option>All subscriptions</option><option>Creator tier</option><option>Studio tier</option></select></div>
        <p class="a-form-note">Promotions run for 7 days by default and can be ended early from the promotions page.</p>`,
      foot: `<button class="a-btn a-btn--primary" data-create>Create promotion</button><span class="a-spacer"></span><button class="a-btn" data-close-sheet>Cancel</button>`,
      onMount(panel, close) {
        panel.querySelectorAll('[data-close-sheet]').forEach(b => b.addEventListener('click', close));
        panel.querySelector('[data-create]').addEventListener('click', () => {
          const name = panel.querySelector('#pmName').value.trim();
          if (!name) { panel.querySelector('#pmName').focus(); A.toast('Give the promotion a name', 'warn'); return; }
          close(); A.toast(`Promotion “${name}” created`, 'ok');
        });
      }
    });
  }

  function refundSheet() {
    A.sheet({
      title: 'Refund a payment',
      sub: 'Refunds are returned to the original payment method.',
      body: `<div class="a-field"><label for="rfPay">Payment</label><select class="a-select" id="rfPay">
          ${D.activity.filter(a => a.kind === 'payment').slice(0, 6).map(a => `<option>${esc(a.user.name)} · ${F.money(a.amount)}</option>`).join('')}
        </select></div>
        <div class="a-field"><label for="rfReason">Reason</label><select class="a-select" id="rfReason"><option>Duplicate charge</option><option>Creator did not deliver</option><option>Requested by customer</option><option>Fraud</option></select></div>
        <div class="a-field"><label for="rfNote">Internal note</label><textarea class="a-textarea" id="rfNote" placeholder="Visible to admins only"></textarea></div>`,
      foot: `<button class="a-btn a-btn--primary" data-refund>Issue refund</button><span class="a-spacer"></span><button class="a-btn" data-close-sheet>Cancel</button>`,
      onMount(panel, close) {
        panel.querySelectorAll('[data-close-sheet]').forEach(b => b.addEventListener('click', close));
        panel.querySelector('[data-refund]').addEventListener('click', () => { close(); A.toast('Refund issued · the user has been notified', 'ok'); });
      }
    });
  }

  function openAudience() {
    A.sheet({
      title: 'Audience',
      sub: 'Who is subscribing and where they are',
      body: `<div class="a-sheet-stats">
          <div class="a-sheet-stat"><span>Subscribers</span><b>${F.num(windowData(S.range).cur.slice(-1)[0].subsActive)}</b></div>
          <div class="a-sheet-stat"><span>Countries</span><b>3</b></div>
          <div class="a-sheet-stat"><span>Top share</span><b>41%</b></div>
        </div>
        <div class="a-sheet-list">
          ${D.audience.countries.map(c => `<div class="a-sheet-row"><span class="a-sheet-row__meta"><b>${esc(c.name)}</b><span>Share of active subscribers</span></span><span style="font-weight:650">${Math.round(c.share * 100)}%</span></div>`).join('')}
        </div>
        <p class="a-form-note" style="margin-top:14px">Country is inferred from billing address. VPN traffic is grouped under “Other”.</p>`,
      foot: `<button class="a-btn" data-close-sheet>Close</button><span class="a-spacer"></span><button class="a-btn a-btn--primary" data-export-aud>Export audience</button>`,
      onMount(panel, close) {
        panel.querySelectorAll('[data-close-sheet]').forEach(b => b.addEventListener('click', close));
        panel.querySelector('[data-export-aud]').addEventListener('click', () => { close(); A.toast('Audience exported', 'ok'); });
      }
    });
  }

  function openActivity(id) {
    const ev = D.activity.find(a => a.id === id);
    if (!ev) return;
    A.sheet({
      title: 'Activity detail',
      sub: F.dateFull(ev.at) + ' · ' + F.rel(ev.at),
      body: `<div class="a-row" style="gap:12px;margin-bottom:16px">
          ${A.av(ev.user, 40)}
          <div><div style="font-size:13.5px;font-weight:650">${esc(ev.user.name)}</div>
          <div style="font-size:11.5px;color:var(--a-faint)">${esc(ev.user.handle)} · ${esc(ev.user.role)}</div></div>
        </div>
        <div class="a-sheet-list">
          <div class="a-sheet-row"><span class="a-sheet-row__meta"><b>Event</b><span>${esc(ev.kind.replace(/_/g, ' '))}</span></span></div>
          ${ev.amount ? `<div class="a-sheet-row"><span class="a-sheet-row__meta"><b>Amount</b><span>Processed successfully</span></span><b>${F.money(ev.amount)}</b></div>` : ''}
          ${ev.product ? `<div class="a-sheet-row"><span class="a-sheet-row__meta"><b>Product</b><span>${esc(ev.product)}</span></span></div>` : ''}
          ${ev.plan ? `<div class="a-sheet-row"><span class="a-sheet-row__meta"><b>Plan</b><span>${esc(ev.plan)}</span></span></div>` : ''}
          ${ev.reason ? `<div class="a-sheet-row"><span class="a-sheet-row__meta"><b>Reason</b><span>${esc(ev.reason)}</span></span></div>` : ''}
        </div>`,
      foot: `<button class="a-btn" data-close-sheet>Close</button><span class="a-spacer"></span><button class="a-btn a-btn--primary" data-open-user>Open user</button>`,
      onMount(panel, close) {
        panel.querySelectorAll('[data-close-sheet]').forEach(b => b.addEventListener('click', close));
        panel.querySelector('[data-open-user]').addEventListener('click', () => { close(); A.toast('User page is not part of this build', 'warn'); });
      }
    });
  }

  /* ---------------------------------------------------------------- export */
  function exportCSV() {
    if (S.empty || S.error) {
      A.toast(S.error ? 'Export unavailable while the data cannot load' : 'Nothing to export in this state', 'warn');
      return;
    }
    const { cur } = windowData(S.range);
    const head = ['Date', 'Subscription revenue', 'Premium revenue', 'Boost revenue', 'Total revenue', 'Posts', 'Reels', 'Live', 'New users', 'Signups', 'Visits', 'Active subscribers'];
    const lines = [head.join(',')];
    cur.forEach(d => {
      lines.push([d.date, d.revenue.subs, d.revenue.premium, d.revenue.boosts, d.revenue.total,
        d.content.posts, d.content.reels, d.content.live, d.users.new, d.users.signups, d.users.visits, d.subsActive].join(','));
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nusumo-dashboard-${S.range}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    A.toast(`Exported ${cur.length} rows as CSV`);
  }

  /* ---------------------------------------------------------------- interactions */
  function bindDashboard() {
    PAGE.addEventListener('click', e => {
      const el = e.target.closest('[data-action]');
      if (!el) return;
      const action = el.dataset.action;
      if (action === 'kpi') { openKpiSheet(el.dataset.kpi); return; }
      if (action === 'quick-menu') { quickMenu(el); return; }
      if (action === 'export') { exportCSV(); return; }
      if (action === 'refresh-all') { paintAll(); A.toast('Dashboard refreshed'); return; }
      if (action === 'refresh-attention') { paintAttention(); A.toast('Queues refreshed'); return; }
      if (action === 'attention-row') { A.openAttention(el.dataset.id); return; }
      if (action === 'open-attention-first') { const first = attentionRows()[0]; if (first) A.openAttention(first.id); return; }
      if (action === 'attention-resolve') {
        const id = el.dataset.id;
        S.resolved.add(id);
        paintAttention();
        A.toast('Marked as resolved', { kind: 'ok', action: { label: 'Undo', onClick: () => { S.resolved.delete(id); paintAttention(); } } });
        return;
      }
      if (action === 'revenue-mode') {
        if (S.range === '12m') return;
        S.revenueMode = el.dataset.mode;
        paintRevenue();
        return;
      }
      if (action === 'revenue-series') {
        const key = el.dataset.key;
        const visibleCount = 3 - S.hidden.size;
        if (S.hidden.has(key)) S.hidden.delete(key);
        else if (visibleCount > 1) S.hidden.add(key);
        else { A.toast('Keep at least one series visible', 'warn'); return; }
        paintRevenue();
        return;
      }
      if (action === 'content-chip') {
        const key = el.dataset.key;
        if (S.contentKeys.has(key)) {
          if (S.contentKeys.size === 1) { A.toast('Keep at least one content type visible', 'warn'); return; }
          S.contentKeys.delete(key);
        } else S.contentKeys.add(key);
        paintContent();
        return;
      }
      if (action === 'activity-tab') {
        S.activityTab = el.dataset.tab;
        paintActivity();
        return;
      }
      if (action === 'activity-all') { openActivityAll(); return; }
      if (action === 'activity') { openActivity(el.dataset.id); return; }
      if (action === 'creator') { openCreator(el.dataset.id); return; }
      if (action === 'creators-all') { A.toast('Creator leaderboard is not part of this build', 'warn'); return; }
      if (action === 'system-tile') { openSystemSheet(el.dataset.key); return; }
      if (action === 'audience-more') { openAudience(); return; }
    });

    document.addEventListener('admin:range', e => {
      const range = e.detail.range;
      if (range === S.range) return;
      S.range = range;
      try { localStorage.setItem('nusumo.admin.range', range); } catch (err) { /* ignore */ }
      if (range === '12m') S.revenueMode = 'monthly';
      paintAll();
      const live = document.getElementById('aRangeLive');
      if (live) live.textContent = `Showing the ${rangeLabel(range)}`;
    });

    document.addEventListener('admin:resolve-attention', e => {
      S.resolved.add(e.detail.id);
      paintAttention();
      A.toast('Queue cleared', { kind: 'ok', action: { label: 'Undo', onClick: () => { S.resolved.delete(e.detail.id); paintAttention(); } } });
    });

    document.addEventListener('admin:export', exportCSV);

    document.addEventListener('click', e => {
      const tab = e.target.closest('.a-tabbar__item[data-nav]');
      if (tab) {
        e.preventDefault();
        A.toast('That section is not part of this build', 'warn');
      }
    });
  }

  /* ---------------------------------------------------------------- boot */
  function init() {
    PAGE.innerHTML = skeletonHTML();
    A.setRangeUI(S.range);
    bindDashboard();

    paintAll();
    if (S.loading) {
      setTimeout(() => { S.loading = false; paintAll(); }, 900);
    }

    if (S.empty) A.toast('Reviewing empty states', { kind: 'warn' });
    if (S.error) A.toast('Reviewing error states', { kind: 'bad' });
  }

  init();
})();
