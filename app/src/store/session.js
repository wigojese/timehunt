// Application controller: owns one expedition, applies commands transactionally, persists, resumes.
// The in-memory state advances only after the write succeeds (or after a re-read proves it did).
import { createExpedition, transition, stateDigest, STATE_SCHEMA } from '../engine/engine.js';
import { digest } from '../engine/canon.js';

export class Session {
  constructor({ content, rules, storage, mode = 'daily', dailyId = content.packId, caseIds = null }) {
    this.content = content; this.rules = rules; this.storage = storage; this.mode = mode; this.dailyId = dailyId; this.caseIds = caseIds;
    this.key = `timehunt:v${STATE_SCHEMA}:${mode}:${dailyId}${caseIds ? ':' + caseIds.join(',') : ''}`;
    this.state = null;
    this.loadStatus = null;
  }

  record(state) {
    return JSON.stringify({ schema: STATE_SCHEMA, packDigest: this.content.digest, rulesId: this.rules.id, stateDigest: stateDigest(state), state });
  }

  /** Returns 'fresh' | 'resumed' | 'corrupt' | 'content_changed' | 'rules_changed' | 'schema_unknown'. Never throws, never silently discards. */
  load() {
    let raw;
    try { raw = this.storage.getItem(this.key); } catch (e) { raw = null; }
    if (raw === null) return this.#fresh('fresh');
    let rec;
    try { rec = JSON.parse(raw); } catch (e) { return this.#hold('corrupt', raw); }
    if (!rec || typeof rec !== 'object' || !rec.state) return this.#hold('corrupt', raw);
    if (rec.schema !== STATE_SCHEMA) return this.#hold('schema_unknown', raw);
    if (stateDigest(rec.state) !== rec.stateDigest) return this.#hold('corrupt', raw);
    if (rec.packDigest !== this.content.digest) return this.#hold('content_changed', raw);
    if (rec.rulesId !== this.rules.id) return this.#hold('rules_changed', raw);
    this.state = rec.state;
    this.loadStatus = 'resumed';
    return 'resumed';
  }

  #fresh(status) {
    this.state = createExpedition(this.content, this.rules, { dailyId: this.dailyId, mode: this.mode, caseIds: this.caseIds });
    this.loadStatus = status;
    const w = this.#write(this.state);
    if (!w.ok) this.loadStatus = 'fresh_unsaved';
    return this.loadStatus;
  }

  #hold(status, raw) {
    this.heldRaw = raw;
    this.state = null;
    this.loadStatus = status;
    return status;
  }

  /** The player explicitly chooses to throw away the saved record and start again. The old record is kept under a .previous key. */
  discardAndStart() {
    try { if (this.heldRaw) this.storage.setItem(this.key + '.previous', this.heldRaw); } catch (e) { /* keep going */ }
    this.heldRaw = null;
    return this.#fresh('fresh');
  }

  #write(state) {
    try { this.storage.setItem(this.key, this.record(state)); return { ok: true }; } catch (e) { return { ok: false, error: e }; }
  }

  /**
   * dispatch(command) -> {ok, error, events, saved}
   * 1. compute next in memory   2. write one record   3. only then adopt next.
   * If the write throws we cannot know whether it landed (crash after write), so we re-read the store and adopt the truth.
   */
  dispatch(cmd) {
    if (!this.state) return { ok: false, error: { code: 'NO_STATE', message: 'no expedition loaded' }, events: [] };
    const r = transition(this.state, cmd, this.content, this.rules);
    if (r.error) return { ok: false, error: r.error, events: [] };
    if (r.next === this.state) return { ok: true, error: null, events: r.events, saved: true };
    const w = this.#write(r.next);
    if (w.ok) { this.state = r.next; return { ok: true, error: null, events: r.events, saved: true }; }
    let stored = null;
    try { const rec = JSON.parse(this.storage.getItem(this.key)); if (rec && rec.state && stateDigest(rec.state) === rec.stateDigest) stored = rec.state; } catch (e) { /* unreadable */ }
    if (stored && digest(stored) === digest(r.next)) { this.state = stored; return { ok: true, error: null, events: r.events, saved: true, recovered: true }; }
    return { ok: false, error: { code: 'SAVE_FAILED', message: 'Could not save. Nothing was charged.' }, events: [] };
  }
}
