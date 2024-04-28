import { useRef, useState } from "react";

interface UseStateHistoryOptions {
    maxHistory?: number;
}

const useStateHistory = <T = unknown>(initialState: T, options?: UseStateHistoryOptions): [T, (newState: T) => void, T, () => void, () => void] => {
    const [state, setState] = useState<T>(initialState);
    const [prevState, setPrevState] = useState<T>(initialState);
    const history = useRef<T[]>([initialState]);
    const historyIndex = useRef(0);

    const set = (newState: T) => {
        if (newState === state) return;

        setPrevState(state);

        setState(newState);
        history.current = [...history.current.slice(0, historyIndex.current + 1), newState];

        if (history.current.length > (options?.maxHistory ?? 10)) {
            history.current.shift();
        }

        historyIndex.current = history.current.length - 1;
    };

    const undo = () => {
        if (historyIndex.current > 0) {
            historyIndex.current--;
            setState(history.current[historyIndex.current]);
        }
    };

    const redo = () => {
        if (historyIndex.current < history.current.length - 1) {
            historyIndex.current++;
            setState(history.current[historyIndex.current]);
        }
    };

    return [state, set, prevState, undo, redo];
};

export default useStateHistory;