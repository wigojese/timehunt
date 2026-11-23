import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { validatePack } from '../src/engine/pack.js';
import { makeRules } from '../src/engine/rules.js';

const here = dirname(fileURLToPath(import.meta.url));
export const raw = () => JSON.parse(readFileSync(join(here, '..', 'data', 'daily-pack-draft.json'), 'utf8'));
export function loadContent() {
  const r = validatePack(raw(), { allowDraft: true });
  if (!r.ok) throw new Error('fixture pack invalid: ' + JSON.stringify(r.errors));
  return r.content;
}
export const rules = (o) => makeRules(o);
let n = 0;
export const id = () => `t-${++n}`;
export function deepFreeze(o) { if (o && typeof o === 'object' && !Object.isFrozen(o)) { Object.freeze(o); Object.values(o).forEach(deepFreeze); } return o; }
