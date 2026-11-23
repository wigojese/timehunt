// Storage adapters. The Session only needs getItem / setItem / removeItem. A single setItem is the unit of atomicity.
export class MemoryStorage {
  constructor() { this.m = new Map(); }
  getItem(k) { return this.m.has(k) ? this.m.get(k) : null; }
  setItem(k, v) { this.m.set(k, String(v)); }
  removeItem(k) { this.m.delete(k); }
}
/** Test wrapper that simulates a crash around a write. arm('before'): throw, nothing written. arm('after'): write, then throw. */
export class FaultyStorage {
  constructor(inner) { this.inner = inner; this.mode = null; }
  arm(mode) { this.mode = mode; }
  getItem(k) { return this.inner.getItem(k); }
  removeItem(k) { this.inner.removeItem(k); }
  setItem(k, v) {
    const m = this.mode;
    if (m) this.mode = null;
    if (m === 'before') throw new Error('simulated crash before write');
    this.inner.setItem(k, v);
    if (m === 'after') throw new Error('simulated crash after write');
  }
}
export function browserStorage() {
  try {
    const s = window.localStorage;
    s.setItem('__probe', '1'); s.removeItem('__probe');
    return { storage: s, persistent: true };
  } catch (e) {
    return { storage: new MemoryStorage(), persistent: false };
  }
}
