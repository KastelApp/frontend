class Events {
  #_events: Map<string, ((...data: unknown[]) => void)[]> = new Map();

  public on(event: string, listener: (...data: unknown[]) => void) {
    const listeners = this.#_events.get(event) ?? [];

    listeners.push(listener);

    this.#_events.set(event, listeners);
  }

  public emit(event: string, ...data: unknown[]) {
    const listeners = this.#_events.get(event) ?? [];

    for (const listener of listeners) {
      listener(...data);
    }
  }

  public off(event: string, listener: (...data: never) => void) {
    const listeners = this.#_events.get(event) ?? [];

    this.#_events.set(
      event,
      listeners.filter((l) => l !== listener),
    );
  }

  public once(event: string, listener: (...data: unknown[]) => void) {
    const onceListener = (...data: unknown[]) => {
      listener(...data);
      this.off(event, onceListener);
    };

    this.on(event, onceListener);
  }
}

export default Events;
