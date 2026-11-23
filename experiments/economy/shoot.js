// Screenshots the generated HTML figures to PNG. Run from this folder:  node shoot.js
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const out = path.resolve(__dirname, '..', '..', 'docs', 'economy');
(async () => {
  const b = await chromium.launch();
  for (const [file, name, w, h] of [['figures.html', 'economy-results.png', 1500, 1040], ['state-machine.html', 'state-machine.png', 1500, 900]]) {
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
    await p.goto('file://' + path.join(out, file), { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(400);
    await p.screenshot({ path: path.join(out, name), clip: { x: 0, y: 0, width: w, height: h } });
    console.log('wrote', name);
    await p.close();
  }
  await b.close();
})();
