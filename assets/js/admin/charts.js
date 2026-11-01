/* ==========================================================================
   Nusumo Admin — chart primitives
   Hand-rolled inline SVG. No dependencies. One shared tooltip per chart.
   API: Chart.spark · area · bars · donut · hbar · mix · dataTable
   ========================================================================== */
(function () {
  const NS = 'http://www.w3.org/2000/svg';

  function niceNum(range, round) {
    if (!isFinite(range) || range <= 0) return 1;
    const exp = Math.floor(Math.log10(range));
    const f = range / Math.pow(10, exp);
    let nf;
    if (round) nf = f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10;
    else nf = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10;
    return nf * Math.pow(10, exp);
  }
  function scaleFor(max, ticks) {
    if (!isFinite(max) || max <= 0) return { top: 1, step: 1, count: 1 };
    const step = niceNum(max / Math.max(1, ticks - 1), true);
    let top = Math.ceil(max / step) * step;
    let count = Math.round(top / step);
    if (count < ticks - 1) { count = ticks - 1; top = step * count; }
    if (top < max) { top += step; count += 1; }
    return { top, step, count };
  }
  function pickIndices(n, count) {
    if (n <= 1) return [0];
    const out = [];
    for (let i = 0; i < count; i++) {
      const idx = Math.round(i * (n - 1) / (count - 1));
      if (out[out.length - 1] !== idx) out.push(idx);
    }
    return out;
  }
  function svgEl(w, h, cls) {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', `0 0 ${w} ${h}`);
    s.setAttribute('width', w);
    s.setAttribute('height', h);
    s.setAttribute('role', 'img');
    if (cls) s.setAttribute('class', cls);
    return s;
  }
  function node(name, attrs) {
    const n = document.createElementNS(NS, name);
    Object.keys(attrs || {}).forEach(k => n.setAttribute(k, attrs[k]));
    return n;
  }
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------------------------------------------------------------- spark */
  function spark(root, cfg) {
    const values = (cfg.values || []).slice();
    let raf = null, lastW = 0;

    function render() {
      const w = root.clientWidth || 120;
      const h = cfg.height || 36;
      if (w < 8) return;
      const pad = 1;
      const min = Math.min.apply(null, values);
      const max = Math.max.apply(null, values);
      const span = (max - min) || 1;
      const x = i => pad + (values.length <= 1 ? 0 : i / (values.length - 1)) * (w - pad * 2);
      const y = v => pad + (1 - (v - min) / span) * (h - pad * 2);
      const pts = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');

      root.innerHTML = '';
      const s = svgEl(w, h);
      s.setAttribute('aria-hidden', 'true');
      const area = node('polygon', {
        points: `${pad},${h - pad} ${pts} ${w - pad},${h - pad}`,
        fill: cfg.color || 'var(--a-accent)', 'fill-opacity': '0.10'
      });
      const line = node('polyline', {
        points: pts, fill: 'none', stroke: cfg.color || 'var(--a-accent)',
        'stroke-width': '1.8', 'stroke-linecap': 'round', 'stroke-linejoin': 'round'
      });
      s.appendChild(area); s.appendChild(line);
      const last = values.length - 1;
      if (last >= 0) {
        s.appendChild(node('circle', {
          cx: x(last).toFixed(1), cy: y(values[last]).toFixed(1), r: '2.2',
          fill: cfg.color || 'var(--a-accent)'
        }));
      }
      root.appendChild(s);
      lastW = w;
    }
    render();
    const ro = new ResizeObserver(() => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        if (Math.abs(root.clientWidth - lastW) > 2) render();
      });
    });
    ro.observe(root);
    return { destroy() { ro.disconnect(); }, update(next) { if (next.values) { values.length = 0; values.push.apply(values, next.values); render(); } } };
  }

  /* ---------------------------------------------------------------- area */
  function area(root, cfg) {
    const series = cfg.series || [];
    const labels = cfg.labels || [];
    const stacked = cfg.stacked !== false;
    const height = cfg.height || 232;
    const yFmt = cfg.yFmt || (v => v);
    const tipFmt = cfg.tipFmt || yFmt;
    let raf = null, lastW = 0, hideTimer = null;

    function render() {
      const width = root.clientWidth;
      if (!width || width < 40) return;
      if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
      const pad = { t: 12, r: 10, b: 24, l: 48 };
      const pw = Math.max(10, width - pad.l - pad.r);
      const ph = Math.max(10, height - pad.t - pad.b);
      const n = labels.length;

      const totals = [];
      for (let i = 0; i < n; i++) {
        totals[i] = stacked
          ? series.reduce((s, sr) => s + (sr.values[i] || 0), 0)
          : Math.max.apply(null, series.map(sr => sr.values[i] || 0));
      }
      const scale = scaleFor(Math.max.apply(null, totals.concat([1])), 5);
      const top = scale.top;

      const X = i => pad.l + (n <= 1 ? pw / 2 : (i / (n - 1)) * pw);
      const Y = v => pad.t + ph - (v / top) * ph;

      root.innerHTML = '';
      const s = svgEl(width, height);
      s.setAttribute('aria-label', cfg.ariaLabel || 'Trend chart');

      const defs = node('defs');
      const grad = node('linearGradient', { id: 'aarea' + Math.random().toString(36).slice(2), x1: 0, y1: 0, x2: 0, y2: 1 });
      grad.appendChild(node('stop', { offset: '0%', 'stop-color': series[0] ? series[0].color : 'var(--a-accent)', 'stop-opacity': '0.22' }));
      grad.appendChild(node('stop', { offset: '100%', 'stop-color': series[0] ? series[0].color : 'var(--a-accent)', 'stop-opacity': '0' }));
      defs.appendChild(grad);
      s.appendChild(defs);

      for (let k = 0; k <= scale.count; k++) {
        const val = scale.step * k;
        if (val > top + 0.001) break;
        const yy = Y(val);
        s.appendChild(node('line', { x1: pad.l, y1: yy, x2: pad.l + pw, y2: yy, class: 'a-chart__grid' }));
        const t = node('text', { x: pad.l - 9, y: yy + 3, 'text-anchor': 'end' });
        t.textContent = yFmt(val);
        s.appendChild(t);
      }
      s.appendChild(node('line', { x1: pad.l, y1: pad.t + ph, x2: pad.l + pw, y2: pad.t + ph, class: 'a-chart__axis' }));

      const xCount = width < 420 ? 3 : width < 620 ? 4 : 6;
      pickIndices(n, xCount).forEach(i => {
        const t = node('text', { x: X(i), y: height - 7, 'text-anchor': 'middle' });
        t.textContent = labels[i] || '';
        s.appendChild(t);
      });

      const acc = new Array(n).fill(0);
      const paths = [];
      series.forEach((sr) => {
        const lower = acc.slice();
        for (let i = 0; i < n; i++) acc[i] += (sr.values[i] || 0);
        const upper = acc.slice();
        if (stacked) {
          let d = `M ${X(0)} ${Y(upper[0])}`;
          for (let i = 1; i < n; i++) d += ` L ${X(i)} ${Y(upper[i])}`;
          for (let i = n - 1; i >= 0; i--) d += ` L ${X(i)} ${Y(lower[i])}`;
          d += ' Z';
          const p = node('path', { d, fill: sr.color, 'fill-opacity': '0.17' });
          s.appendChild(p);
        }
        let line = `M ${X(0)} ${Y(upper[0])}`;
        for (let i = 1; i < n; i++) line += ` L ${X(i)} ${Y(upper[i])}`;
        s.appendChild(node('path', {
          d: line, fill: 'none', stroke: sr.color, 'stroke-width': '2',
          'stroke-linecap': 'round', 'stroke-linejoin': 'round'
        }));
        paths.push(upper);
      });

      if (!stacked) {
        series.forEach(sr => {
          let line = `M ${X(0)} ${Y(sr.values[0] || 0)}`;
          for (let i = 1; i < n; i++) line += ` L ${X(i)} ${Y(sr.values[i] || 0)}`;
          s.appendChild(node('path', { d: line, fill: 'none', stroke: sr.color, 'stroke-width': '2' }));
        });
      }

      const cross = node('line', {
        x1: 0, y1: pad.t, x2: 0, y2: pad.t + ph,
        stroke: 'rgba(255,255,255,.28)', 'stroke-width': '1', 'stroke-dasharray': '3 3', opacity: '0'
      });
      s.appendChild(cross);
      const dots = series.map(sr => {
        const c = node('circle', { r: '3.4', fill: sr.color, stroke: '#0d0b13', 'stroke-width': '1.5', opacity: '0' });
        s.appendChild(c);
        return c;
      });
      const hit = node('rect', { x: pad.l, y: pad.t, width: pw, height: ph, class: 'a-chart__hit' });
      s.appendChild(hit);
      root.appendChild(s);

      const tip = document.createElement('div');
      tip.className = 'a-chart__tip';
      tip.setAttribute('aria-hidden', 'true');
      root.appendChild(tip);
      const live = document.createElement('div');
      live.className = 'a-sr';
      live.setAttribute('aria-live', 'polite');
      root.appendChild(live);

      let active = -1;
      function show(i) {
        active = Math.max(0, Math.min(n - 1, i));
        const cx = X(active);
        cross.setAttribute('x1', cx); cross.setAttribute('x2', cx);
        cross.setAttribute('opacity', '1');
        series.forEach((sr, si) => {
          dots[si].setAttribute('cx', cx);
          dots[si].setAttribute('cy', Y(paths[si][active]));
          dots[si].setAttribute('opacity', '1');
        });
        let total = 0;
        const rows = series.map(sr => {
          const v = sr.values[active] || 0;
          total += v;
          return `<div class="a-chart__tip-row"><i style="background:${sr.color}"></i><span>${esc(sr.label)}</span><strong>${esc(tipFmt(v))}</strong></div>`;
        }).join('');
        tip.innerHTML = `<b>${esc(labels[active] || '')}</b>${rows}` +
          (stacked && series.length > 1 ? `<div class="a-chart__tip-total"><span>Total</span><strong>${esc(tipFmt(total))}</strong></div>` : '');
        const tw = Math.min(220, Math.max(132, tip.offsetWidth || 150));
        let left = cx + 12;
        if (left + tw > width - 4) left = cx - tw - 12;
        tip.style.left = Math.max(4, left) + 'px';
        tip.style.top = '4px';
        tip.classList.add('is-on');
        live.textContent = `${labels[active]}, ${series.map(sr => `${sr.label} ${tipFmt(sr.values[active] || 0)}`).join(', ')}`;
      }
      function hide() {
        cross.setAttribute('opacity', '0');
        dots.forEach(d => d.setAttribute('opacity', '0'));
        tip.classList.remove('is-on');
        active = -1;
      }
      function fromEvent(e) {
        const rect = s.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width * width;
        const ratio = (px - pad.l) / pw;
        return Math.round(ratio * (n - 1));
      }
      hit.addEventListener('pointermove', e => show(fromEvent(e)));
      hit.addEventListener('pointerdown', e => show(fromEvent(e)));
      hit.addEventListener('pointerleave', () => { hideTimer = setTimeout(hide, 60); });
      s.setAttribute('tabindex', '0');
      s.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') { e.preventDefault(); show(active < 0 ? 0 : active + 1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); show(active < 0 ? n - 1 : active - 1); }
        else if (e.key === 'Escape') hide();
      });
      s.addEventListener('blur', hide);

      lastW = width;
    }

    render();
    const ro = new ResizeObserver(() => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        if (Math.abs(root.clientWidth - lastW) > 2) render();
      });
    });
    ro.observe(root);
    return { destroy() { ro.disconnect(); }, update() { render(); } };
  }

  /* ---------------------------------------------------------------- bars */
  function bars(root, cfg) {
    const series = cfg.series || [];
    const labels = cfg.labels || [];
    const height = cfg.height || 232;
    const stacked = cfg.stacked !== false;
    const yFmt = cfg.yFmt || (v => v);
    const tipFmt = cfg.tipFmt || yFmt;
    let raf = null, lastW = 0, hideTimer = null;

    function render() {
      const width = root.clientWidth;
      if (!width || width < 40) return;
      if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
      const pad = { t: 12, r: 10, b: 24, l: 34 };
      const pw = Math.max(10, width - pad.l - pad.r);
      const ph = Math.max(10, height - pad.t - pad.b);
      const n = labels.length;
      const bw = pw / Math.max(1, n);
      const gap = Math.min(5, Math.max(2, bw * 0.18));
      const barW = Math.max(2, bw - gap);

      const totals = [];
      for (let i = 0; i < n; i++) {
        totals[i] = stacked
          ? series.reduce((s, sr) => s + (sr.values[i] || 0), 0)
          : Math.max.apply(null, series.map(sr => sr.values[i] || 0));
      }
      const scale = scaleFor(Math.max.apply(null, totals.concat([1])), 4);
      const top = scale.top;
      const Y = v => pad.t + ph - (v / top) * ph;
      const X = i => pad.l + i * bw + gap / 2;

      root.innerHTML = '';
      const s = svgEl(width, height);
      s.setAttribute('aria-label', cfg.ariaLabel || 'Bar chart');

      for (let k = 0; k <= scale.count; k++) {
        const val = scale.step * k;
        if (val > top + 0.001) break;
        const yy = Y(val);
        s.appendChild(node('line', { x1: pad.l, y1: yy, x2: pad.l + pw, y2: yy, class: 'a-chart__grid' }));
        const t = node('text', { x: pad.l - 7, y: yy + 3, 'text-anchor': 'end' });
        t.textContent = yFmt(val);
        s.appendChild(t);
      }
      s.appendChild(node('line', { x1: pad.l, y1: pad.t + ph, x2: pad.l + pw, y2: pad.t + ph, class: 'a-chart__axis' }));

      pickIndices(n, width < 420 ? 3 : width < 620 ? 4 : 6).forEach(i => {
        const t = node('text', { x: X(i) + barW / 2, y: height - 7, 'text-anchor': 'middle' });
        t.textContent = labels[i] || '';
        s.appendChild(t);
      });

      const highlight = node('rect', {
        x: 0, y: pad.t, width: bw, height: ph,
        fill: 'rgba(255,255,255,.05)', opacity: '0', 'pointer-events': 'none'
      });
      s.appendChild(highlight);

      for (let i = 0; i < n; i++) {
        let base = 0;
        series.forEach(sr => {
          const v = sr.values[i] || 0;
          if (!v) return;
          const yTop = Y(base + v);
          const h = Math.max(1, Y(base) - yTop);
          const r = node('rect', {
            x: X(i), y: yTop, width: barW, height: h,
            fill: sr.color, rx: Math.min(3, h / 2)
          });
          s.appendChild(r);
          base += v;
        });
      }

      const hit = node('rect', { x: pad.l, y: pad.t, width: pw, height: ph, class: 'a-chart__hit' });
      s.appendChild(hit);
      root.appendChild(s);

      const tip = document.createElement('div');
      tip.className = 'a-chart__tip';
      tip.setAttribute('aria-hidden', 'true');
      root.appendChild(tip);
      const live = document.createElement('div');
      live.className = 'a-sr';
      live.setAttribute('aria-live', 'polite');
      root.appendChild(live);

      function show(i) {
        i = Math.max(0, Math.min(n - 1, i));
        highlight.setAttribute('x', pad.l + i * bw);
        highlight.setAttribute('opacity', '1');
        const rows = series.map(sr =>
          `<div class="a-chart__tip-row"><i style="background:${sr.color}"></i><span>${esc(sr.label)}</span><strong>${esc(tipFmt(sr.values[i] || 0))}</strong></div>`
        ).join('');
        const total = series.reduce((s2, sr) => s2 + (sr.values[i] || 0), 0);
        tip.innerHTML = `<b>${esc(labels[i] || '')}</b>${rows}` +
          (stacked && series.length > 1 ? `<div class="a-chart__tip-total"><span>Total</span><strong>${esc(tipFmt(total))}</strong></div>` : '');
        const tw = Math.min(220, Math.max(132, tip.offsetWidth || 150));
        let left = pad.l + i * bw + barW + 10;
        if (left + tw > width - 4) left = pad.l + i * bw - tw - 8;
        tip.style.left = Math.max(4, left) + 'px';
        tip.style.top = '4px';
        tip.classList.add('is-on');
        live.textContent = `${labels[i]}, ${total} total`;
      }
      function hide() {
        highlight.setAttribute('opacity', '0');
        tip.classList.remove('is-on');
      }
      function fromEvent(e) {
        const rect = s.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width * width;
        return Math.floor((px - pad.l) / bw);
      }
      hit.addEventListener('pointermove', e => show(fromEvent(e)));
      hit.addEventListener('pointerleave', () => { hideTimer = setTimeout(hide, 60); });
      s.setAttribute('tabindex', '0');
      let active = -1;
      s.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') { e.preventDefault(); active = Math.min(n - 1, active + 1); show(active); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); active = Math.max(0, active - 1); show(active); }
        else if (e.key === 'Escape') hide();
      });
      s.addEventListener('blur', hide);

      lastW = width;
    }

    render();
    const ro = new ResizeObserver(() => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        if (Math.abs(root.clientWidth - lastW) > 2) render();
      });
    });
    ro.observe(root);
    return { destroy() { ro.disconnect(); }, update() { render(); } };
  }

  /* ---------------------------------------------------------------- donut */
  function donut(root, cfg) {
    const size = cfg.size || 168;
    const thickness = cfg.thickness || 22;
    const segments = cfg.segments || [];
    const total = segments.reduce((s, x) => s + x.value, 0) || 1;
    const r = (size - thickness) / 2;
    const c = 2 * Math.PI * r;
    const gap = 3;

    root.innerHTML = '';
    const s = svgEl(size, size);
    s.setAttribute('aria-label', cfg.ariaLabel || 'Distribution chart');
    const track = node('circle', {
      cx: size / 2, cy: size / 2, r: r, fill: 'none',
      stroke: 'rgba(255,255,255,.055)', 'stroke-width': thickness
    });
    s.appendChild(track);

    let offset = 0;
    segments.forEach(seg => {
      const frac = seg.value / total;
      const len = Math.max(0, frac * c - gap);
      const circle = node('circle', {
        cx: size / 2, cy: size / 2, r: r, fill: 'none',
        stroke: seg.color || 'var(--a-accent)',
        'stroke-width': thickness,
        'stroke-dasharray': `${len} ${c - len}`,
        'stroke-dashoffset': -offset,
        transform: `rotate(-90 ${size / 2} ${size / 2})`,
        'stroke-linecap': 'butt'
      });
      const title = document.createElementNS(NS, 'title');
      title.textContent = `${seg.label}: ${Math.round(frac * 100)}%`;
      circle.appendChild(title);
      s.appendChild(circle);
      offset += frac * c;
    });
    root.appendChild(s);
    return { destroy() { }, update() { } };
  }

  /* ---------------------------------------------------------------- hbar (funnel) */
  function hbar(root, cfg) {
    const rows = cfg.rows || [];
    const max = Math.max.apply(null, rows.map(r => r.value).concat([1]));
    root.innerHTML = rows.map((r, i) => {
      const pct = Math.max(2, Math.round(r.value / max * 100));
      return `
        <div class="a-funnel__step">
          <span>${esc(r.label)}</span><b>${esc(cfg.fmt ? cfg.fmt(r.value) : r.value)}</b>
          <div class="a-funnel__bar"><i style="width:${pct}%"></i></div>
        </div>
        ${i === 0 ? '' : `<div class="a-funnel__conv">↓ ${(Math.round(r.conversion * 10) / 10).toFixed(1)}% of previous</div>`}`;
    }).join('');
    return { destroy() { }, update() { } };
  }

  /* ---------------------------------------------------------------- mix */
  function mix(root, cfg) {
    const segs = cfg.segments || [];
    const total = segs.reduce((s, x) => s + x.value, 0) || 1;
    root.innerHTML = `
      <div class="a-mix__bar" role="img" aria-label="${esc(cfg.ariaLabel || 'Payment method mix')}">
        ${segs.map(s2 => `<i style="width:${(s2.value / total * 100).toFixed(2)}%;background:${s2.color}"></i>`).join('')}
      </div>
      <div class="a-mix__legend">
        ${segs.map(s2 => `<div class="a-mix__row"><i style="background:${s2.color}"></i><span>${esc(s2.label)}</span><b>${esc(cfg.fmt ? cfg.fmt(s2.value) : s2.value)}</b><small>${Math.round(s2.value / total * 100)}%</small></div>`).join('')}
      </div>`;
    return { destroy() { }, update() { } };
  }

  /* ---------------------------------------------------------------- data table fallback */
  function dataTable(labels, series, fmt) {
    if (!labels.length) return '';
    const idx = pickIndices(labels.length, Math.min(8, labels.length));
    const head = series.map(s => `<th>${esc(s.label)}</th>`).join('');
    const rows = idx.map(i => `<tr><td>${esc(labels[i])}</td>${series.map(s => `<td>${esc(fmt ? fmt(s.values[i] || 0) : (s.values[i] || 0))}</td>`).join('')}</tr>`).join('');
    return `<details class="a-chart-data"><summary>View data</summary>
      <table><thead><tr><th>Period</th>${head}</tr></thead><tbody>${rows}</tbody></table>
    </details>`;
  }

  window.Chart = { spark, area, bars, donut, hbar, mix, dataTable };
})();
