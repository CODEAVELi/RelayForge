const MAX_AUDIT = 500;

export class AuditLog {
  constructor(seed = []) {
    this.items = seed;
  }

  add(entry) {
    this.items.push({ ts: Date.now(), ...entry });
    if (this.items.length > MAX_AUDIT) this.items.shift();
  }

  list(limit = 100) {
    return this.items.slice(-limit);
  }
}
