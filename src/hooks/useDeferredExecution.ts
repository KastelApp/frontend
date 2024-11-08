const useDeferredExecution = <T = boolean>(booleanRef: React.MutableRefObject<T>, customChecker: (value: T) => boolean, maxTimeout = 10000) => {
    const waitUntilFetchingComplete = (ref: React.MutableRefObject<T>) => {
        const started = Date.now();

        const customConditionChecker = customChecker || ((value: T) => !value);

        return new Promise<void>((resolve, reject) => {
            const checkCondition = () => {
                if (Date.now() - started > maxTimeout) {
                    reject(new Error("Fetching took too long"));

                    return;
                }

                if (customConditionChecker(ref.current)) resolve();
                else setTimeout(checkCondition, 50);
            };
            checkCondition();
        });
    };

    const executeAfterWait = async (task: () => void) => {
        await waitUntilFetchingComplete(booleanRef);
        task();
    };

    return { executeAfterWait };
};

export { useDeferredExecution };

export default useDeferredExecution;