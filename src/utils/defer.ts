const defer = (cb: () => void) => setTimeout(cb, 0);
const chainedDefer = (cb: () => void) => defer(() => defer(cb));

export { defer, chainedDefer };