// Minimal static server for the gray-box (ES modules need http, not file://). Usage: node scripts/serve.mjs [port]
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { networkInterfaces } from 'node:os';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const lan = process.argv.includes('--lan');
const port = Number(process.argv.find(a => /^\d+$/.test(a)) || process.env.PORT || 5173);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8' };
export function start(p = port) {
  const srv = createServer(async (req, res) => {
    const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
    const file = join(root, path === '/' || path === '\\' ? 'index.html' : path);
    if (!file.startsWith(root) || /\/(test|scripts|fixtures)\//.test(file)) { res.writeHead(404); return res.end('not found'); }
    try { const data = await readFile(file); res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' }); res.end(data); }
    catch { res.writeHead(404); res.end('not found'); }
  });
  return new Promise(r => srv.listen(p, lan ? '0.0.0.0' : '127.0.0.1', () => r(srv)));
}
if (import.meta.url === `file://${process.argv[1]}`) start().then(() => {
  console.log(`Timehunt on http://127.0.0.1:${port}/   (motion prototype: /motion/, add ?perf=1 for the recorder; game: add ?debug=1 for test tools)`);
  if (lan) {
    const ips = Object.values(networkInterfaces()).flat().filter(i => i && i.family === 'IPv4' && !i.internal).map(i => i.address);
    console.log('On your phone (same Wi-Fi), open one of:');
    for (const ip of ips) console.log(`  http://${ip}:${port}/motion/   and   http://${ip}:${port}/`);
  }
});
