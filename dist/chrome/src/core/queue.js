export class ActionQueue {
  constructor(seed = {}) {
    this.items = seed.items || [];
    this.inflight = new Map((seed.inflight || []).map((a) => [a.id, a]));
  }

  enqueue(action) {
    this.items.push(action);
  }

  next() {
    const action = this.items.shift();
    if (!action) return null;
    this.inflight.set(action.id, action);
    return action;
  }

  ack(id) {
    this.inflight.delete(id);
  }

  requeueInflight() {
    const entries = [...this.inflight.values()];
    this.inflight.clear();
    this.items.unshift(...entries);
  }

  serialize() {
    return {
      items: this.items,
      inflight: [...this.inflight.values()]
    };
  }

  size() {
    return this.items.length + this.inflight.size;
  }
}
