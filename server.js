// Server lokal kecil (tanpa dependensi) agar overlay bisa dipakai sebagai Browser Source di OBS.
const http = require('http'), fs = require('fs'), path = require('path');
const PORT = process.env.PORT || 3000, ROOT = __dirname;
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml' };
const clients = new Set(); let lastCfg = null;

http.createServer((req, res) => {
  const u = req.url.split('?')[0];
  if (u === '/ping') return res.end('ok');
  if (u === '/events') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
    res.write('retry: 1000\n\n'); if (lastCfg) res.write('data: ' + lastCfg + '\n\n');
    clients.add(res); req.on('close', () => clients.delete(res)); return;
  }
  if (u === '/send' && req.method === 'POST') {
    let b = ''; req.on('data', d => { b += d; if (b.length > 1e6) req.destroy(); });
    req.on('end', () => { try { const m = JSON.parse(b); const line = JSON.stringify(m); if (m.t === 'cfg') lastCfg = line; clients.forEach(c => c.write('data: ' + line + '\n\n')); } catch (e) {} res.end('ok'); });
    return;
  }
  const f = path.join(ROOT, path.normalize(u === '/' ? '/index.html' : u));
  const ext = path.extname(f);
  if (!f.startsWith(ROOT) || !MIME[ext] || f === __filename) { res.writeHead(404); return res.end('404'); }
  fs.readFile(f, (e, d) => { if (e) { res.writeHead(404); return res.end('404'); } res.writeHead(200, { 'Content-Type': MIME[ext], 'Cache-Control': 'no-store' }); res.end(d); });
}).listen(PORT, '127.0.0.1', () => {
  console.log(`\n  Subtitle Studio berjalan\n  Studio : http://localhost:${PORT}\n  Overlay: http://localhost:${PORT}/overlay.html  (untuk OBS Browser Source)\n\n  Tutup jendela ini untuk menghentikan server.\n`);
});
