/* Mesin render subtitle. Dipakai bersama oleh index.html (preview) dan overlay.html (OBS). */
(function (g) {
const rnd = (a, b) => a + Math.random() * (b - a);
const rgb = h => { h = (h || '#000').replace('#', ''); if (h.length === 3) h = [...h].map(c => c + c).join(''); const n = parseInt(h, 16) || 0; return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
const norm = w => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const list = s => (s || '').split(',').map(norm).filter(Boolean);

g.createEngine = function (sub, cap) {
  const stage = sub.parentElement;
  let S = {}, words = [], base = 0, total = 0, holdT, capT, lock = 0, level = 0, keys = [], bad = [];
  const vis = () => words.filter(w => w.el);

  function cfg(c) {
    S = c; keys = list(S.keys); bad = list(S.censor);
    const [r, g2, b] = rgb(S.bx), pw = S.inP / 100, f = (S.fontL || '').trim() || S.font;
    sub.style.cssText = `--pw:${pw};--inD:${S.inD}ms;--outD:${S.outD}ms;--ease:cubic-bezier(.2,${(1 + pw * 1.3).toFixed(2)},.4,1);` +
      `--bx:rgba(${r},${g2},${b},${S.bxA / 100});--bd:${S.bd};--bdW:${S.bdW}px;--rad:${S.rad}px;--pad:${S.pad}px;--gap:${S.gap}px;` +
      `--tx:${S.tx};--txA:${S.txA / 100};--hlC:${S.hlC};--hlTx:${S.hlTx};--glow:${S.glow}px;--sw:${S.strokeW}px;--sc:${S.strokeC};--keyC:${S.keyC};` +
      `font-family:"${f}",sans-serif;font-size:${S.size}px;font-weight:${S.weight};width:${S.width}%;` +
      `justify-content:${{ left: 'flex-start', center: 'center', right: 'flex-end' }[S.align]};text-align:${S.align}`;
    sub.className = [S.caps ? 'caps' : '', S.hollow ? 'hollow' : '', S.stroke ? 'stroke' : '', 'bs-' + S.boxStyle].join(' ');
    stage.style.justifyContent = S.pos;
    cap.style.cssText = `font-family:"${f}",sans-serif;font-size:${Math.round(S.size * .45)}px;color:${S.tx}`;
  }

  function disp(t) {
    const n = norm(t);
    return bad.includes(n) ? t[0] + '*'.repeat(Math.max(1, t.length - 1)) : t;
  }

  function add(t) {
    let v = vis();
    if (S.paging === 'page' && v.length >= S.maxW) { v.forEach((w, i) => { exit(w.el, i * S.stag); w.el = null; }); v = []; }
    else while (v.length >= S.maxW) { const w = v.shift(); exit(w.el, 0); w.el = null; }
    const prev = v[v.length - 1];
    if (S.hlMode === 'latest' && prev) prev.el.classList.remove('hl');
    const el = document.createElement('span');
    el.className = 'w in-' + S.inA + (S.hlMode === 'latest' ? ' hl' : '');
    el.textContent = disp(t);
    if (keys.includes(norm(t))) el.classList.add('key');
    el.style.setProperty('--rot', rnd(-S.rot, +S.rot).toFixed(1) + 'deg');
    el.style.setProperty('--dir', Math.random() < .5 ? -1 : 1);
    el.style.fontSize = (100 + rnd(-S.szR, +S.szR) + level * S.vol + (el.classList.contains('key') ? S.keyS - 100 : 0)) + '%';
    if (S.hlMode === 'rainbow') { el.classList.add('hl'); el.style.setProperty('--hlC', `hsl(${Math.floor(rnd(0, 360))} 90% 55%)`); }
    sub.append(el);
    words.push({ t, el });
  }

  function exit(el, delay) {
    el.className = el.className.replace(/\bin-\w+/g, '') + ' out-' + S.outA;
    el.style.setProperty('--delay', delay + 'ms');
    el.style.setProperty('--sx', rnd(-460, 460) + 'px');
    el.style.setProperty('--sy', rnd(-400, 280) + 'px');
    el.style.setProperty('--sr', rnd(-540, 540) + 'deg');
    setTimeout(() => el.remove(), +S.outD + delay + 100);
  }

  function clear() {
    clearTimeout(holdT);
    vis().forEach((w, i) => exit(w.el, i * S.stag));
    words = []; base = total;
    cap.classList.remove('show');
  }
  const bump = () => { clearTimeout(holdT); holdT = setTimeout(clear, S.hold * 1000); };

  function text(full, lv) {
    if (Date.now() < lock) return;
    level = lv || 0;
    const all = full.trim() ? full.trim().split(/\s+/) : [];
    total = all.length; if (base > all.length) base = 0;
    const ws = all.slice(base); if (!ws.length) return;
    ws.forEach((t, i) => {
      if (!words[i]) add(t);
      else if (words[i].t !== t) { words[i].t = t; if (words[i].el) words[i].el.textContent = disp(t); }
    });
    while (words.length > ws.length) { const w = words.pop(); if (w.el) w.el.remove(); }
    bump();
  }

  function feed(s) {
    clear();
    const ws = s.trim().split(/\s+/).filter(Boolean);
    lock = Date.now() + ws.length * 170 + S.hold * 1000 + 300;
    ws.forEach((t, i) => setTimeout(() => { add(t); bump(); }, i * 170));
  }

  function caption(t) {
    cap.textContent = t; cap.classList.add('show');
    clearTimeout(capT); capT = setTimeout(() => cap.classList.remove('show'), (S.hold + 2) * 1000);
  }

  function reset() { clear(); base = 0; total = 0; }

  return { cfg, text, feed, clear, caption, reset };
};
})(window);
