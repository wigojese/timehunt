// Screenshots of the Motion and Reveal prototypes in the Atlas look. Usage: node scripts/shots-protos.mjs <outdir>
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { start } from './serve.mjs';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || '/opt/node22/lib/node_modules/playwright');
const OUT = process.argv[2]; mkdirSync(OUT, { recursive: true });
const srv = await start(5192); const b = await chromium.launch();
const page = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
const shot = async n => { await page.waitForTimeout(400); await page.screenshot({ path: join(OUT, n + '.png') }); console.log('shot', n); };
await page.goto('http://127.0.0.1:5192/reveal/'); await page.waitForSelector('.hubcard'); await shot('reveal-1-hub');
await page.click('.hubcard .btn'); await page.waitForTimeout(1500); const e = await page.$('#entry:not([hidden])'); if (e) await e.click().catch(() => {}); await page.waitForTimeout(800); await shot('reveal-2-story');
await page.click('#next').catch(() => {}); await page.waitForTimeout(500); await shot('reveal-3-beat');
await page.goto('http://127.0.0.1:5192/motion/'); await page.waitForSelector('main .btn, main a'); await shot('motion-1-path');
const first = await page.$('main a[href*="case"], main .btn[data-case], main a.btn'); if (first) { await first.click(); await page.waitForTimeout(700); await shot('motion-2-case'); }
await b.close(); srv.close();
