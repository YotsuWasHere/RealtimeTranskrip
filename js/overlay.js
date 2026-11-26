/* Overlay untuk OBS / Streamlabs / TikTok LIVE Studio: menerima perintah dari halaman Studio. */
const eng = createEngine(document.getElementById('sub'), document.getElementById('cap'));
function handle(m) {
  if (m.t === 'cfg') eng.cfg(m.v);
  else if (m.t === 'text') eng.text(m.v, m.lv);
  else if (m.t === 'feed') eng.feed(m.v);
  else if (m.t === 'cap') eng.caption(m.v);
  else if (m.t === 'clear') eng.clear();
  else if (m.t === 'reset') eng.reset();
}
const bc = new BroadcastChannel('subtitle-studio');
bc.onmessage = e => handle(e.data);
bc.postMessage({ t: 'hello' });
if (location.protocol.startsWith('http')) {
  const es = new EventSource('/events');
  es.onmessage = e => { try { handle(JSON.parse(e.data)); } catch (_) {} };
}
