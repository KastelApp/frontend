/**
 * Throttle function to limit the number of times a function can be called in a given time frame.
 * @example
 * // You will need to do something like this:
 * const throttledFunction = throttle(() => { console.log("Hello World") }, 1000);
 * // You cannot do
 * functionThatCallsALot(throttle(() => { console.log("Hello World") }, 1000)
 * // since on each call it will create a new throttle function. which looses the waiting context.
 */
const throttle = (callback: () => void, limit: number) => {
	let waiting = false;
	return () => {
		if (!waiting) {
			callback();
			waiting = true;
			setTimeout(() => {
				waiting = false;
			}, limit);
		}
	};
};

export default throttle;
