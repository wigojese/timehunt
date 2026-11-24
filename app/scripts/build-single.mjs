// Builds ONE self-contained HTML file of the game: bundled JS (esbuild), CSS, fonts, art and the day's pack all inlined as data.
// Used for the private shareable page (no server, no service worker). Usage: node scripts/build-single.mjs <out.html>
import { build } from 'esbuild';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const out = process.argv[2];
if (!out) { console.error('usage: node scripts/build-single.mjs <out.html>'); process.exit(1); }
const b64 = f => readFileSync(join(root, f)).toString('base64');
const mime = f => ({ webp: 'image/webp', png: 'image/png', woff2: 'font/woff2', jpg: 'image/jpeg' }[f.split('.').pop()]);
const dataUri = f => `data:${mime(f)};base64,${b64(f)}`;

// 1. JS
const js = (await build({ entryPoints: [join(root, 'src/ui/app.js')], bundle: true, minify: true, format: 'iife', target: 'es2022', write: false })).outputFiles[0].text;

// 2. CSS with every url(...) inlined
let css = readFileSync(join(root, 'ui.css'), 'utf8') + '\n' + readFileSync(join(root, 'atlas.css'), 'utf8');
css = css.replace(/url\((?!["']?data:)([^)'"]+)\)/g, (m, p) => (existsSync(join(root, p)) ? `url(${dataUri(p)})` : m));

// 3. art used by the game (poses, home scene, banners)
const assetFiles = ['characters/guide-idle', 'characters/guide-earlier', 'characters/guide-later', 'characters/guide-clue', 'characters/guide-discovery', 'characters/guide-uncertain', 'characters/guide-rest', 'characters/guide-back', 'characters/guide-lantern-map',
  'scenes/home-hero', 'scenes/banner-aqueduct', 'scenes/banner-city', 'scenes/banner-coast', 'scenes/banner-desert', 'scenes/banner-mountain'].map(f => f + '.webp');
const assets = Object.fromEntries(assetFiles.map(f => [f, dataUri('assets/' + f)]));
const pack = JSON.parse(readFileSync(join(root, 'data/daily-pack-draft.json'), 'utf8'));

// 4. body markup from index.html
const body = readFileSync(join(root, 'index.html'), 'utf8').match(/<body>([\s\S]*?)<script/)[1].trim();

const html = `<title>Timehunt</title>
<meta name="theme-color" content="#274B41">
<style>${css}
html,body{margin:0;background:#F7F0DE}</style>
${body}
<script>globalThis.__ASSETS=${JSON.stringify(assets)};globalThis.__PACK=${JSON.stringify(pack)};</script>
<script>${js.replace(/<\/script/gi, '<\\/script')}</script>
`;
writeFileSync(out, html);
console.log(`${out}: ${(html.length / 1024 / 1024).toFixed(2)} MB (css ${(css.length / 1024).toFixed(0)} KB, js ${(js.length / 1024).toFixed(0)} KB, ${assetFiles.length} images)`);
