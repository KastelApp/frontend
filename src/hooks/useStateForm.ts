import fastDeepEqual from "fast-deep-equal";
import { useCallback, useState } from "react";

interface StateFormProps<T> {
	/**
	 * The current state
	 */
	state: T;
	/**
	 * Set a new state
	 * @param newState The new state
	 */
	set: (newState: React.SetStateAction<T>) => void;
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

	/**
	 * If there's an error
	 */
	error: string | null;

	/**
	 * Set the error
	 */
	setError: (newError: string | null) => void;

	/**
	 * Clear's the error
	 */
	clearError: () => void;
}

const useStateForm = <T = unknown>(initialState: T): StateFormProps<T> => {
	const [state, setState] = useState<T>(initialState);
	const [intState, setInitialState] = useState<T>(initialState);
	const [error, setError] = useState<string | null>(null);

	const set = (newState: React.SetStateAction<T>) => {
		setState(newState);
	};

	const reset = () => {
		setState(intState);
	};

	const save = () => {
		setInitialState(state);
	};

	const clearError = () => {
		setError(null);
	};

	const isDirty = !fastDeepEqual(state, intState);

	return { state, set, reset, save, isDirty, error, setError, clearError };
};

interface MultiFormState {
	isDirty: boolean;
	hasError: boolean;
	isSaving: boolean;
	save: () => Promise<void>;
	reset: () => void;
	clearAllErrors: () => void;
}

interface FormState<T> {
	state: T;
	set: (newState: T) => void;
	error: string | null;
	setError: (newError: string | null) => void;
	clearError: () => void;
}

interface AlwaysOptionsNonStateable<Options extends Record<string, unknown>> {
	save?: (options: Options) => void | Promise<void>;
}

const useMultiFormState = <InputBaseType extends Record<string, unknown>>(
	inputData: InputBaseType & AlwaysOptionsNonStateable<InputBaseType>,
): {
	[key in keyof InputBaseType]: FormState<InputBaseType[key]>;
} & MultiFormState => {
	const keys = (Object.keys(inputData) as (keyof InputBaseType)[]).filter((key) => key !== "save");
	const saveFunction = inputData.save;

	const state = keys.reduce(
		(acc, key) => {
			if (key === "save") {
				return acc;
			}

			// eslint-disable-next-line react-compiler/react-compiler, react-hooks/rules-of-hooks
			acc[key] = useStateForm(inputData[key]);

			return acc;
		},
		{} as {
			[key in keyof InputBaseType]: StateFormProps<InputBaseType[key]>;
		},
	);

	const isDirty = keys.some((key) => state[key].isDirty);
	const hasError = keys.some((key) => state[key].error !== null);
	const [isSaving, setIsSaving] = useState(false);

	const save = useCallback(async () => {
		if (isSaving) { // ! darkerink: It's up to the developer to handle if there's an error or not imo, easier that way
			return;
		}

		setIsSaving(true);
		await saveFunction?.(Object.fromEntries(keys.map((key) => [key, state[key].state])) as InputBaseType);
		setIsSaving(false);

		for (const key of keys) {
			state[key].save();
		}
	}, [state, keys, isSaving]);

	const reset = useCallback(() => {
		for (const key of keys) {
			state[key].reset();
		}
	}, [state, keys]);

	const clearAllErrors = useCallback(() => {
		for (const key of keys) {
			state[key].clearError();
		}
	}, [state, keys]);


	return { ...state, isDirty, save, reset, hasError, isSaving, clearAllErrors };
};

export default useStateForm;

export { useMultiFormState };
