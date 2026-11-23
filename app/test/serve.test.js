import { test } from 'node:test';
import assert from 'node:assert/strict';
import { start } from '../scripts/serve.mjs';

// Regression: TRY_IT.md tells people to open /motion/ and /reveal/. A directory URL must serve its index.html.
test('static server: directory URLs serve index.html; dev-only folders and outside paths stay hidden', async () => {
  const srv = await start(5197);
  try {
    const get = async p => (await fetch('http://127.0.0.1:5197' + p));
    for (const p of ['/', '/motion/', '/reveal/']) assert.equal((await get(p)).status, 200, p);
    assert.match(await (await get('/reveal/')).text(), /<title>/i);
    for (const p of ['/test/engine.test.js', '/scripts/serve.mjs', '/fixtures/x.json', '/nope.js']) assert.equal((await get(p)).status, 404, p);
  } finally { srv.close(); }
});
