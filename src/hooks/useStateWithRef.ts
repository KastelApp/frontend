import { useState, useRef, useCallback } from "react";

const useStateWithRef = <T>(
	initialValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>, React.MutableRefObject<T>] => {
	const [state, setState] = useState(initialValue);
	const stateRef = useRef(state);

	const setStateAndRef = useCallback((value: T | ((prev: T) => T)) => {
		const newValue = value instanceof Function ? value(stateRef.current) : value;
		stateRef.current = newValue;
		setState(newValue);
	}, []);

	return [state, setStateAndRef, stateRef];
};

export { useStateWithRef };

export default useStateWithRef;
