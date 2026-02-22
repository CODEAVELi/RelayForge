const MAX_EVENTS = 200;

export class Telemetry {
  constructor() {
    this.events = [];
    this.counts = {
      wsOpen: 0,
      wsClose: 0,
      wsError: 0,
      execOk: 0,
      execFail: 0,
      requeue: 0
    };
  }

  push(type, data = {}) {
    const evt = { ts: Date.now(), type, ...data };
    this.events.push(evt);
    if (this.events.length > MAX_EVENTS) this.events.shift();
    if (this.counts[type] !== undefined) this.counts[type] += 1;
  }

  snapshot(extra = {}) {
    return {
      counts: { ...this.counts },
      lastEvents: this.events.slice(-25),
      ...extra
    };
  }
}
