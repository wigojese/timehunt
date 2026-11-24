// Records a short video of the welcome screen and the year dial in motion, and a filmstrip of frames. Usage: node scripts/record-atlas.mjs <outdir>
import { createRequire } from 'node:module';
import { mkdirSync, readdirSync, renameSync } from 'node:fs';
import { join } from 'node:path';
import { start } from './serve.mjs';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || '/opt/node22/lib/node_modules/playwright');
const OUT = process.argv[2]; mkdirSync(OUT, { recursive: true });
const srv = await start(5188); const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 780 }, deviceScaleFactor: 1, recordVideo: { dir: OUT, size: { width: 390, height: 780 } } });
const page = await ctx.newPage();
await page.goto('http://127.0.0.1:5188/'); await page.waitForSelector('[data-action]');
for (let i = 0; i < 4; i++) { await page.waitForTimeout(1100); await page.screenshot({ path: join(OUT, `strip-${i}.png`) }); }
await page.click('[data-action="onb-next"]'); await page.click('[data-action="onb-next"]'); await page.click('[data-action="onb-done"]');
await page.waitForTimeout(1500); await page.click('[data-action="trail-go"]'); await page.click('[data-action="to-hunt"]'); await page.waitForTimeout(1200);
const box = await page.locator('#yr').boundingBox();
await page.mouse.move(box.x + 30, box.y + box.height / 2); await page.mouse.down();
for (let x = 30; x < box.width - 30; x += 12) { await page.mouse.move(box.x + x, box.y + box.height / 2); await page.waitForTimeout(30); }
await page.mouse.up(); await page.waitForTimeout(800);
await page.screenshot({ path: join(OUT, 'dial-chosen.png') });
await ctx.close(); await b.close(); srv.close();
const v = readdirSync(OUT).find(f => f.endsWith('.webm')); if (v) renameSync(join(OUT, v), join(OUT, 'atlas-motion.webm'));
console.log('recorded');
