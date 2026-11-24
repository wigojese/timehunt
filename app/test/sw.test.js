import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { manifestText, precacheList } from '../scripts/build-sw.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('sw-manifest.js is current: run `npm run build:sw` after changing any shipped file', () => {
  assert.equal(readFileSync(join(root, 'sw-manifest.js'), 'utf8'), manifestText(), 'sw-manifest.js is stale');
});
test('the offline shell covers every file the game needs and nothing dev-only', () => {
  const list = precacheList();
  for (const f of ['index.html', 'ui.css', 'atlas.css', 'src/ui/app.js', 'src/engine/engine.js', 'data/daily-pack-draft.json', 'manifest.webmanifest', 'icons/icon-192.png', 'assets/characters/guide-idle.webp', 'assets/scenes/home-hero.webp', 'assets/textures/map-green.webp']) assert.ok(list.includes(f), f);
  for (const f of list) assert.ok(!/(^|\/)(test|scripts|fixtures|node_modules|motion|reveal|atlas)\//.test(f), 'dev-only file in the offline shell: ' + f);
});
test('the committed manifest is never a kill switch', () => {
  assert.match(readFileSync(join(root, 'sw-manifest.js'), 'utf8'), /__KILL = false/);
});
