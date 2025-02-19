import type { EventEmitter as EventEmitterType } from "node:events";

/**
 * I've had some issues where nextjs throws an error when using the EventEmitter from "node:events" module, so I just remade it.
 */
class EventEmitter implements EventEmitterType {
	private _listeners: Map<string | symbol, ((...args: unknown[]) => void)[]> = new Map();
	private _maxListeners = 10;

	public on(eventName: string | symbol, listener: (...args: unknown[]) => void): this {
		if (this._listeners.size >= this._maxListeners) {
			console.warn(
				"Max listeners reached, possible memory leak or whatever this warning normally says, increase via <EventEmitter>.setMaxListeners",
			);
		}

		const current = this._listeners.get(eventName) || [];

		current.push(listener);

		this._listeners.set(eventName, current);

		return this;
	}

	public addListener(eventName: string | symbol, listener: (...args: unknown[]) => void): this {
		return this.on(eventName, listener);
	}

	public emit(eventName: string | symbol, ...args: unknown[]): boolean {
		const listeners = this._listeners.get(eventName);

		if (!listeners) return false;

		listeners.forEach((listener) => listener(...args));

		return true;
	}

	public eventNames(): (string | symbol)[] {
		return Array.from(this._listeners.keys());
	}

	public getMaxListeners(): number {
		return this._maxListeners;
	}

	// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
	public listenerCount(eventName: string | symbol, listener?: Function | undefined): number {
		const listeners = this._listeners.get(eventName);

		if (!listeners) return 0;

		if (!listener) return listeners.length;

		return listeners.filter((l) => l === listener).length;
	}

	// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
	public listeners(eventName: string | symbol): Function[] {
		const listeners = this._listeners.get(eventName);

		if (!listeners) return [];

		return listeners;
	}

	public off(eventName: string | symbol, listener: (...args: unknown[]) => void): this {
		const listeners = this._listeners.get(eventName);

		if (!listeners) return this;

		this._listeners.set(
			eventName,
			listeners.filter((l) => l !== listener),
		);

		return this;
	}

	public once(eventName: string | symbol, listener: (...args: unknown[]) => void): this {
		const once = (...args: unknown[]) => {
			this.off(eventName, once);
			listener(...args);
		};

		return this.on(eventName, once);
	}

	public prependListener(eventName: string | symbol, listener: (...args: unknown[]) => void): this {
		const current = this._listeners.get(eventName) || [];

		current.unshift(listener);

		this._listeners.set(eventName, current);

		return this;
	}

	public prependOnceListener(eventName: string | symbol, listener: (...args: unknown[]) => void): this {
		const once = (...args: unknown[]) => {
			this.off(eventName, once);
			listener(...args);
		};

		return this.prependListener(eventName, once);
	}

	// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
	public rawListeners(eventName: string | symbol): Function[] {
		return this.listeners(eventName);
	}

	public removeAllListeners(eventName?: string | symbol | undefined): this {
		if (!eventName) {
			this._listeners.clear();
			return this;
		}

		this._listeners.delete(eventName);

		return this;
	}

	public removeListener(eventName: string | symbol, listener: (...args: unknown[]) => void): this {
		return this.off(eventName, listener);
	}

	public setMaxListeners(n: number): this {
		this._maxListeners = n;

		return this;
	}
}

export default EventEmitter;
