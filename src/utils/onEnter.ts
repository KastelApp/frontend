const onEnter = (callback: (...args: never) => void, passEvent?: boolean) => {
	return (event: React.KeyboardEvent) => {
		if (event.key === "Enter" && !event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
			if (passEvent) {
				// @ts-expect-error -- I forgot how to do this correctly
				callback(event);
			} else {
				event.preventDefault();

				// @ts-expect-error -- I forgot how to do this correctly
				callback();
			}
		}
	};
};

export default onEnter;
