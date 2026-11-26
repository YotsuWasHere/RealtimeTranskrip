(() => {
const $ = id => document.getElementById(id);
const P = a => a.map(x => [x, x]);
const KEY = 'subtitle-studio-v3';

/* ---------- data ---------- */
const FONTS = ['Rubik','Poppins','Montserrat','Anton','Bangers','Luckiest Guy','Permanent Marker','Bungee','Baloo 2','Fredoka','Pacifico','Rubik Mono One'];
const LANGS = [['id-ID','Indonesia'],['en-US','English'],['ms-MY','Melayu'],['ja-JP','日本語'],['ko-KR','한국어'],['es-ES','Español'],['ar-SA','العربية']];
const TRL = [['en','English'],['id','Indonesia'],['ja','日本語'],['ko','한국어'],['es','Español'],['zh-CN','中文'],['ar','العربية']];
const UIS = [['ember','Ember'],['lime','Lime'],['ocean','Ocean'],['sakura','Sakura'],['violet','Violet'],['paper','Terang']];
const TXT = {
 'Cyber Lime': {tx:'#ffffff',bx:'#1b2030',bd:'#ffffff',hlC:'#b6ff1a',hlTx:'#10200a'},
 'Hot Pink':   {tx:'#ffffff',bx:'#2a0f1e',bd:'#ff7eb6',hlC:'#ff2d87',hlTx:'#ffffff'},
 'Ice Blue':   {tx:'#eaf6ff',bx:'#0b1a2b',bd:'#7dd3fc',hlC:'#38bdf8',hlTx:'#04121f'},
 'Gold':       {tx:'#fff8e1',bx:'#241a05',bd:'#ffd23f',hlC:'#ffb400',hlTx:'#241a05'},
 'Sunset':     {tx:'#ffffff',bx:'#2b1020',bd:'#ff9a5a',hlC:'#ff6a3d',hlTx:'#ffffff'},
 'Mono Putih': {tx:'#111111',bx:'#ffffff',bd:'#111111',hlC:'#111111',hlTx:'#ffffff'}
};
const QUICK = {
 'TikTok Sticker (Bounce miring)': {inA:'bounce',outA:'pop',rot:5,font:'Rubik',weight:'800',size:44,hlMode:'latest',boxStyle:'box',hollow:false,stroke:false,glow:22,bxA:85,bdW:2,...TXT['Cyber Lime']},
 'Stretch Karaoke':   {inA:'stretch',outA:'shrink',rot:0,font:'Montserrat',weight:'900',size:48,hlMode:'latest',boxStyle:'box',hollow:false,stroke:false,glow:30,...TXT['Hot Pink']},
 'Komik Meledak':     {inA:'spring',outA:'scatter',rot:9,font:'Bangers',weight:'400',size:70,hlMode:'rainbow',boxStyle:'none',hollow:false,stroke:true,strokeW:5,glow:18,tx:'#ffffff'},
 'Minimal Bersih':    {inA:'fade',outA:'fade',rot:0,font:'Poppins',weight:'600',size:40,hlMode:'off',boxStyle:'none',hollow:false,stroke:true,strokeW:3,glow:0,tx:'#ffffff'},
 'Neon Hollow':       {inA:'blur',outA:'blur',rot:0,font:'Bungee',weight:'400',size:46,hlMode:'latest',boxStyle:'none',hollow:true,stroke:false,glow:45,...TXT['Ice Blue']},
 'Gamer Slide':       {inA:'sidepop',outA:'sweep',rot:2,font:'Rubik Mono One',weight:'400',size:38,hlMode:'latest',boxStyle:'box',hollow:false,stroke:false,glow:26,...TXT['Gold']}
};

const SCHEMA = [
 {b:'mic',id:'lang',t:'sel',l:'Bahasa bicara',o:LANGS,v:'id-ID'},
 {b:'mic',id:'tr',t:'tog',l:'Auto Translate (baris bawah)',v:false},
 {b:'mic',id:'trL',t:'sel',l:'Terjemahkan ke',o:TRL,v:'en'},
 {b:'mic',id:'hold',t:'rng',l:'Auto-clear (detik)',min:.5,max:10,st:.1,v:1.5},

 {b:'anim',id:'inA',t:'sel',l:'Animasi masuk',o:[['pop','Pop up'],['spring','Spring (membal elastis)'],['bounce','Bounce jatuh'],['stretch','Ramping → melebar'],['sidepop','Pop ke samping'],['fade','Fade in'],['slide','Naik dari bawah'],['drop','Jatuh dari atas'],['spin','Berputar'],['flip','Flip 3D'],['blur','Fokus dari blur'],['zoom','Zoom dari besar'],['skew','Miring meluncur']],v:'bounce'},
 {b:'anim',id:'inP',t:'rng',l:'Kekuatan efek',min:0,max:100,v:60},
 {b:'anim',id:'inD',t:'rng',l:'Durasi masuk (ms)',min:100,max:1200,v:480},
 {b:'anim',id:'outA',t:'sel',l:'Animasi keluar',o:[['pop','Pop down (mengecil)'],['fade','Fade out'],['scatter','Berhamburan'],['drop','Jatuh'],['up','Terbang ke atas'],['blur','Memudar blur'],['shrink','Melebar → ramping'],['sweep','Tersapu ke samping']],v:'pop'},
 {b:'anim',id:'outD',t:'rng',l:'Durasi keluar (ms)',min:150,max:1500,v:350},
 {b:'anim',id:'stag',t:'rng',l:'Jeda antar kata keluar (ms)',min:0,max:250,v:25},
 {b:'anim',id:'align',t:'seg',l:'Rata teks',o:[['left','Kiri'],['center','Tengah'],['right','Kanan']],v:'center'},
 {b:'anim',id:'pos',t:'seg',l:'Posisi di layar',o:[['flex-start','Atas'],['center','Tengah'],['flex-end','Bawah']],v:'flex-end'},
 {b:'anim',id:'maxW',t:'rng',l:'Maks. kata di layar (turun baris otomatis)',min:2,max:30,v:7},
 {b:'anim',id:'paging',t:'seg',l:'Kalau sudah penuh',o:[['slide','Geser kata lama'],['page','Ganti halaman']],v:'slide'},
 {b:'anim',id:'width',t:'rng',l:'Lebar area teks (%)',min:30,max:100,v:85},
 {b:'anim',id:'rot',t:'rng',l:'Kemiringan acak (derajat)',min:0,max:20,v:4},
 {b:'anim',id:'szR',t:'rng',l:'Acak ukuran kata (%)',min:0,max:50,v:0},

 {b:'font',id:'font',t:'sel',l:'Font (12 bawaan)',o:P(FONTS),v:'Rubik'},
 {b:'font',id:'fontL',t:'txt',l:'Atau ketik nama font di PC kamu',ph:'mis. Impact, Komika Axis',v:''},
 {b:'font',id:'size',t:'rng',l:'Ukuran (px)',min:20,max:160,v:44},
 {b:'font',id:'weight',t:'sel',l:'Ketebalan',o:[['400','Normal'],['600','Semibold'],['700','Bold'],['800','Extra'],['900','Black']],v:'800'},
 {b:'font',id:'caps',t:'tog',l:'HURUF KAPITAL',v:false},
 {b:'font',id:'stroke',t:'tog',l:'Border teks (stroke)',v:false},
 {b:'font',id:'strokeW',t:'rng',l:'Tebal stroke',min:1,max:10,v:3,h:1},
 {b:'font',id:'strokeC',t:'col',l:'Warna stroke',v:'#000000',h:1},

 {b:'color',id:'hlMode',t:'sel',l:'Highlight',o:[['latest','Hanya kata yang baru diucapkan'],['rainbow','Pelangi (tiap kata beda warna)'],['off','Tanpa highlight']],v:'latest'},
 {b:'color',id:'boxStyle',t:'sel',l:'Background teks',o:[['box','Kotak per kata'],['underline','Garis bawah'],['none','Tanpa background']],v:'box'},
 {b:'color',id:'tx',t:'col',l:'Warna teks',v:'#ffffff',h:1},
 {b:'color',id:'bx',t:'col',l:'Warna kotak',v:'#1b2030',h:1},
 {b:'color',id:'bd',t:'col',l:'Warna border kotak',v:'#ffffff',h:1},
 {b:'color',id:'hlC',t:'col',l:'Warna highlight',v:'#b6ff1a',h:1},
 {b:'color',id:'hlTx',t:'col',l:'Teks saat highlight',v:'#10200a',h:1},
 {b:'color',id:'hollow',t:'tog',l:'Teks transparan (hollow outline)',v:false},
 {b:'color',id:'txA',t:'rng',l:'Opasitas teks (%)',min:10,max:100,v:100,h:1},
 {b:'color',id:'bxA',t:'rng',l:'Opasitas kotak (%)',min:0,max:100,v:85,h:1},
 {b:'color',id:'bdW',t:'rng',l:'Tebal border',min:0,max:8,v:2,h:1},
 {b:'color',id:'rad',t:'rng',l:'Radius sudut',min:0,max:40,v:10,h:1},
 {b:'color',id:'pad',t:'rng',l:'Padding kotak',min:0,max:24,v:8,h:1},
 {b:'color',id:'gap',t:'rng',l:'Jarak antar kata',min:0,max:30,v:10,h:1},
 {b:'color',id:'glow',t:'rng',l:'Kekuatan glow',min:0,max:60,v:22},

 {b:'smart',id:'keys',t:'txt',l:'Kata kunci (pisah koma) — otomatis berwarna & lebih besar',ph:'mis. gila, mantap, giveaway',v:''},
 {b:'smart',id:'keyC',t:'col',l:'Warna kata kunci',v:'#ffd23f',h:1},
 {b:'smart',id:'keyS',t:'rng',l:'Ukuran kata kunci (%)',min:100,max:200,v:125,h:1},
 {b:'smart',id:'censor',t:'txt',l:'Sensor kata (pisah koma) → b***',ph:'kata yang ingin disamarkan',v:''},
 {b:'smart',id:'vol',t:'rng',l:'Teks reaktif volume (suara keras = kata lebih besar)',min:0,max:80,v:0},

 {b:'out',id:'ui',t:'seg',l:'Tema website',o:UIS,v:'ember'},
 {b:'out',id:'accent',t:'col',l:'Warna aksen kustom (klik untuk memakai)',v:'#ff8a3d'},
 {b:'out',id:'previewBg',t:'sel',l:'Background preview',o:[['checker','Kotak-kotak (transparan)'],['dark','Gelap'],['light','Terang'],['video','Gradasi mirip video'],['green','Hijau chroma']],v:'checker'},
 {b:'out',id:'chroma',t:'tog',l:'Mode OBS: latar hijau (chroma key)',v:true}
];

/* ---------- panel ---------- */
const ctl = {}, S = {};
let saved = {}; try { saved = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) {}
let accentOn = !!saved.accentOn;

function build(it) {
  const w = document.createElement('div'); w.className = 'ctl' + (it.h ? ' half' : '');
  const init = saved[it.id] ?? it.v; let get, set;
  if (it.t === 'tog') {
    w.innerHTML = `<label class="tog"><span>${it.l}</span><input type="checkbox"></label>`;
    const i = w.querySelector('input'); i.checked = !!init;
    i.oninput = apply; get = () => i.checked; set = v => i.checked = !!v;
  } else {
    const lab = document.createElement('label'); lab.innerHTML = `<span>${it.l}</span><b></b>`; w.append(lab);
    if (it.t === 'seg') {
      const box = document.createElement('div'); box.className = 'seg'; let cur = init;
      const paint = () => [...box.children].forEach(b => b.classList.toggle('on', b.dataset.v === String(cur)));
      it.o.forEach(([v, n]) => { const b = document.createElement('button'); b.textContent = n; b.dataset.v = v; b.onclick = () => { cur = v; paint(); apply(); }; box.append(b); });
      paint(); w.append(box); get = () => cur; set = v => { cur = v; paint(); };
    } else if (it.t === 'sel') {
      const s = document.createElement('select'); it.o.forEach(([v, n]) => s.add(new Option(n, v)));
      s.value = init; s.oninput = apply; w.append(s); get = () => s.value; set = v => s.value = v;
    } else {
      const i = document.createElement('input'); i.type = { rng: 'range', txt: 'text', col: 'color' }[it.t];
      if (it.t === 'rng') { i.min = it.min; i.max = it.max; i.step = it.st || 1; }
      if (it.ph) i.placeholder = it.ph;
      i.value = init; i.oninput = () => { if (it.id === 'accent') accentOn = true; apply(); }; w.append(i);
      get = () => it.t === 'rng' ? parseFloat(i.value) : i.value; set = v => i.value = v;
      ctl[it.id] = { get, set, lab: lab.lastChild, rng: it.t === 'rng' }; return w;
    }
    ctl[it.id] = { get, set, lab: lab.lastChild }; return w;
  }
  ctl[it.id] = { get, set }; return w;
}

function presetSelect(body, label, obj, onPick) {
  const w = document.createElement('div'); w.className = 'sel-sp';
  const s = document.createElement('select'); s.add(new Option(label, ''));
  Object.keys(obj).forEach(k => s.add(new Option(k, k)));
  s.onchange = () => { if (s.value) { onPick(obj[s.value]); s.value = ''; } };
  w.append(s); body.append(w);
}
const setAll = o => { Object.entries(o).forEach(([k, v]) => ctl[k] && ctl[k].set(v)); apply(); };

document.querySelectorAll('[data-body]').forEach(body => {
  const k = body.dataset.body;
  if (k === 'anim') presetSelect(body, 'Quick Preset (1-klik combo)…', QUICK, setAll);
  if (k === 'color') presetSelect(body, 'Tema warna teks…', TXT, setAll);
  SCHEMA.filter(i => i.b === k).forEach(i => body.append(build(i)));
});

/* ---------- engine, preview & kirim ke overlay ---------- */
const stage = $('stage'), eng = createEngine($('sub'), $('cap'));
const bc = new BroadcastChannel('subtitle-studio');
let srv = false;
function emit(m) { bc.postMessage(m); if (srv) fetch('/send', { method: 'POST', body: JSON.stringify(m) }).catch(() => {}); }
bc.onmessage = e => { if (e.data.t === 'hello') emit({ t: 'cfg', v: S }); };
function setSrv() { const b = $('bSrv'); b.textContent = srv ? 'Server OBS: Online' : 'Server OBS: Offline'; b.classList.toggle('ok', srv); }
if (location.protocol.startsWith('http')) fetch('/ping').then(r => { srv = r.ok; setSrv(); emit({ t: 'cfg', v: S }); }).catch(setSrv); else setSrv();

function apply() {
  for (const k in ctl) { S[k] = ctl[k].get(); if (ctl[k].rng) ctl[k].lab.textContent = S[k]; }
  S.accentOn = accentOn;
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
  document.documentElement.dataset.ui = S.ui;
  const rs = document.documentElement.style;
  if (accentOn) { rs.setProperty('--acc', S.accent); rs.setProperty('--on', '#111'); } else { rs.removeProperty('--acc'); rs.removeProperty('--on'); }
  stage.dataset.bg = S.previewBg;
  document.body.classList.toggle('chroma', S.chroma);
  eng.cfg(S); emit({ t: 'cfg', v: S });
  $('pvInfo').textContent = `${S.font} · ${S.inA} · ${S.align}`;
  $('pvL').textContent = `Auto-clear: ${S.hold}s · Opacity: ${S.bxA}%`;
  $('pvR').textContent = `Mode: ${S.maxW} kata (${S.paging === 'page' ? 'Halaman' : 'Geser'})`;
  $('micInfo').textContent = running ? `Live • ${S.maxW} kata/layar` : 'Siap';
  if (rec) rec.lang = S.lang;
}

/* ---------- audio meter ---------- */
let lvl = 0, ac, an, st, buf;
async function audioOn() {
  try {
    st = await navigator.mediaDevices.getUserMedia({ audio: true });
    ac = new AudioContext(); an = ac.createAnalyser(); an.fftSize = 512;
    ac.createMediaStreamSource(st).connect(an); buf = new Uint8Array(an.fftSize); tick();
  } catch (e) {}
}
function audioOff() { if (st) st.getTracks().forEach(t => t.stop()); if (ac) ac.close(); an = null; lvl = 0; $('meter').style.width = '0'; }
function tick() {
  if (!an) return;
  an.getByteTimeDomainData(buf); let s = 0; for (const v of buf) { const d = (v - 128) / 128; s += d * d; }
  lvl = Math.min(1, Math.sqrt(s / buf.length) * 4); $('meter').style.width = lvl * 100 + '%'; requestAnimationFrame(tick);
}

/* ---------- speech, rekaman, terjemahan ---------- */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec = null, running = false, done = -1, segS = {}, recOn = false, t0 = 0, segs = [];
const status = t => $('status').textContent = t;

function final(text, s, e) {
  if (recOn) { segs.push({ s: Math.max(0, s - t0), e: Math.max(0, e - t0), t: text }); $('srt').disabled = $('txtx').disabled = false; $('rec').textContent = `● REC (${segs.length})`; }
  const src = S.lang.split('-')[0];
  if (S.tr && src !== S.trL) {
    fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${src}|${S.trL}`)
      .then(r => r.json()).then(j => { const t = j.responseData && j.responseData.translatedText; if (t) { eng.caption(t); emit({ t: 'cap', v: t }); } }).catch(() => {});
  }
}

if (!SR) { status('Browser ini tidak mendukung speech recognition. Pakai Chrome atau Edge.'); $('mic').disabled = true; }
else {
  rec = new SR(); rec.continuous = true; rec.interimResults = true;
  rec.onresult = e => {
    let full = ''; const now = Date.now();
    for (let i = 0; i < e.results.length; i++) { full += e.results[i][0].transcript + ' '; if (segS[i] === undefined) segS[i] = now; }
    eng.text(full, lvl); emit({ t: 'text', v: full, lv: lvl });
    for (let i = e.resultIndex; i < e.results.length; i++) if (e.results[i].isFinal && i > done) { done = i; final(e.results[i][0].transcript.trim(), segS[i], now); }
  };
  rec.onerror = e => status('Error: ' + e.error + (e.error === 'not-allowed' ? ' (izinkan akses mic di browser)' : ''));
  rec.onend = () => { if (running) { eng.reset(); emit({ t: 'reset' }); done = -1; segS = {}; try { rec.start(); } catch (e) {} } };
}

$('mic').onclick = () => {
  if (!rec) return;
  running = !running;
  if (running) { done = -1; segS = {}; eng.reset(); rec.lang = S.lang; try { rec.start(); } catch (e) {} audioOn(); status('Mendengarkan… silakan bicara.'); }
  else { rec.stop(); audioOff(); status('Mic berhenti.'); }
  $('mic').textContent = running ? 'Stop mic' : 'Mulai mic';
  $('mic').classList.toggle('live', running); $('bAir').classList.toggle('air', running);
  $('bAir').textContent = running ? 'On-Air' : 'Off-Air'; apply();
};
$('rec').onclick = () => {
  recOn = !recOn; $('rec').classList.toggle('live', recOn);
  if (recOn) { segs = []; t0 = Date.now(); $('srt').disabled = $('txtx').disabled = true; $('rec').textContent = '● REC (0)'; status('Merekam sesi. Nyalakan mic lalu bicara.'); }
  else { $('rec').textContent = `● REC (${segs.length})`; status(segs.length ? 'Rekaman selesai. Unduh .srt atau .txt.' : 'Rekaman berhenti (belum ada kalimat).'); }
};
const dl = (n, t) => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([t], { type: 'text/plain' })); a.download = n; a.click(); };
const tm = ms => { const p = (n, l = 2) => String(n).padStart(l, '0'); return `${p(ms / 36e5 | 0)}:${p(ms / 6e4 % 60 | 0)}:${p(ms / 1e3 % 60 | 0)},${p(ms % 1e3 | 0, 3)}`; };
$('srt').onclick = () => dl('subtitle.srt', segs.map((g, i) => `${i + 1}\n${tm(g.s)} --> ${tm(Math.max(g.e, g.s + 800))}\n${g.t}\n`).join('\n'));
$('txtx').onclick = () => dl('transkrip.txt', segs.map(g => g.t).join('\n'));

/* ---------- tombol lain ---------- */
const feed = s => { eng.feed(s); emit({ t: 'feed', v: s }); };
$('test').onclick = () => feed('Halo semua selamat datang di stream saya hari ini jangan lupa follow');
$('clear').onclick = () => { eng.clear(); emit({ t: 'clear' }); };
const send = () => { const v = $('manual').value.trim(); if (v) { feed(v); $('manual').value = ''; } };
$('send').onclick = send; $('manual').onkeydown = e => { if (e.key === 'Enter') send(); };
$('obs').onclick = () => document.body.classList.add('obs');
addEventListener('keydown', e => { if (e.key === 'Escape') document.body.classList.remove('obs'); });

document.querySelectorAll('.url').forEach(b => b.onclick = () => {
  if (!srv) { status('Server belum jalan. Jalankan start-windows.bat (atau node server.js), lalu buka http://localhost:3000 — lihat README.'); return; }
  const u = location.origin + '/overlay.html';
  (navigator.clipboard ? navigator.clipboard.writeText(u) : Promise.reject()).catch(() => {}).finally(() =>
    status(`URL disalin: ${u}\n${b.dataset.t}: tambahkan sebagai Browser Source / Web Overlay (lebar 1920, tinggi 1080).`));
});
$('exp').onclick = () => dl('subtitle-studio-pengaturan.json', JSON.stringify(S, null, 2));
$('imp').onclick = () => $('impF').click();
$('impF').onchange = e => { const f = e.target.files[0]; if (!f) return; f.text().then(t => { try { const o = JSON.parse(t); accentOn = !!o.accentOn; setAll(o); status('Pengaturan diimpor.'); } catch (x) { status('File JSON tidak valid.'); } }); };
const defaults = () => Object.fromEntries(SCHEMA.map(i => [i.id, i.v]));
$('rAll').onclick = () => { accentOn = false; setAll(defaults()); };
$('rAnim').onclick = () => setAll(Object.fromEntries(SCHEMA.filter(i => i.b === 'anim').map(i => [i.id, i.v])));

apply();
})();
