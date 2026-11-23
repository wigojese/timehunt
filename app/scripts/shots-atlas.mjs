// Screenshots the main game screens at phone width, for design review. Usage: node scripts/shots-atlas.mjs <outdir>
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { validatePack } from '../src/engine/pack.js';
import { start } from './serve.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || '/opt/node22/lib/node_modules/playwright');
const here = dirname(fileURLToPath(import.meta.url));
const OUT = process.argv[2] || join(here, '..', '..', 'docs', 'atlas');
mkdirSync(OUT, { recursive: true });
const raw = JSON.parse(readFileSync(join(here, '..', 'data', 'daily-pack-draft.json'), 'utf8'));
const content = validatePack(raw, { allowDraft: true }).content;
const target = content.cases[0].target;

const srv = await start(5195);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
const shot = async name => { await page.waitForTimeout(250); await page.evaluate(() => { if (!document.getElementById('nodebug')) { const s = document.createElement('style'); s.id = 'nodebug'; s.textContent = '.debug{display:none!important}'; document.head.append(s); } }); await page.screenshot({ path: join(OUT, name + '.png') }); console.log('shot', name); };
const click = async a => { await page.click(`[data-action="${a}"]`); await page.waitForTimeout(150); };
await page.goto('http://127.0.0.1:5195/');
await page.waitForSelector('[data-action]');
await shot('1-welcome');
await click('onb-next'); await shot('2-how');
await click('onb-next'); await click('onb-done');
await page.waitForTimeout(200); await shot('3-day');
await click('trail-go'); await shot('4-dossier');
await click('to-hunt'); await shot('4b-hunt');
await page.click('[data-action="to-evidence"]'); await page.waitForTimeout(150); await shot('5-evidence');
const rev = await page.$('[data-action="reveal"]:not([disabled]):not([aria-disabled="true"])');
if (rev) { await rev.click(); await page.waitForTimeout(200); await shot('5b-confirm-spend'); await page.click('dialog[open] [data-d="yes"]'); await page.waitForTimeout(300); await shot('6-evidence-revealed'); }
await click('to-hunt');
await page.check(`input[name="yr"][value="${target}"]`).catch(async () => { await page.click(`label.layer:has(input[value="${target}"])`); });
await shot('7-year-chosen');
await click('lock'); await page.waitForTimeout(300);
const confirm = await page.$('dialog[open] [data-d="yes"]'); if (confirm) { await confirm.click(); await page.waitForTimeout(300); }
await shot('8-result');
await b.close(); srv.close();
