import fastDeepEqual from "fast-deep-equal";
import { useState } from "react";

interface StateFormProps<T> {
	/**
	 * The current state
	 */
	state: T;
	/**
	 * Set a new state
	 * @param newState The new state
	 */
	set: (newState: T) => void;
	/**
	 * Reset to the initial state
	 */
	reset: () => void;
	/**
	 * Save the current state as the initial state
	 */
	save: () => void;
	/**
	 * Check if the current state is different from the initial state
	 */
	isDirty: boolean;
}

const useStateForm = <T = unknown>(initialState: T): StateFormProps<T> => {
	const [state, setState] = useState<T>(initialState);
	const [intState, setInitialState] = useState<T>(initialState);

	const set = (newState: T) => {
		setState(newState);
	};

	const reset = () => {
		setState(intState);
	};

	const save = () => {
		setInitialState(state);
	};

	const isDirty = !fastDeepEqual(state, intState);

	return { state, set, reset, save, isDirty };
};

interface MultiFormState {
	isDirty: boolean;
	save: () => void;
	reset: () => void;
}

interface FormState<T> {
	state: T;
	set: (newState: T) => void;
}

const useMultiFormState = <InputBaseType extends Record<string, unknown>>(
	inputData: InputBaseType,
): {
	[key in keyof InputBaseType]: FormState<InputBaseType[key]>;
} & MultiFormState => {
	const keys = Object.keys(inputData) as (keyof InputBaseType)[];

	const state = keys.reduce(
		(acc, key) => {
			// eslint-disable-next-line react-hooks/rules-of-hooks
			acc[key] = useStateForm(inputData[key]);
			return acc;
		},
		{} as {
			[key in keyof InputBaseType]: StateFormProps<InputBaseType[key]>;
		},
	);

	const isDirty = keys.some((key) => state[key].isDirty);

	const save = () => {
		for (const key of keys) {
			state[key].save();
		}
	};

	const reset = () => {
		for (const key of keys) {
			state[key].reset();
		}
	};

	return { ...state, isDirty, save, reset };
};

export default useStateForm;

export { useMultiFormState };
