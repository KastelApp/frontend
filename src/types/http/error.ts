export interface BaseError {
	[key: string]: unknown;
	code: number | string;
	message: string;
}

export interface ErrorResponse<Errors extends Record<string, BaseError> = Record<string, BaseError>> {
	code: string | number;
	errors: Errors;
}

export const isErrorResponse = <PossibleErrors extends Record<string, BaseError>>(
	obj: unknown,
): obj is ErrorResponse<PossibleErrors> => {
	if (typeof obj !== "object" || obj === null) return false;

	if (Array.isArray(obj)) return false;

	if (!("code" in obj)) return false;
	if (!("errors" in obj)) return false;

	if (typeof obj.code !== "string" && typeof obj.code !== "number") return false;

	if (typeof obj.errors !== "object" || obj.errors === null) return false;

	if (Array.isArray(obj.errors)) return false;

	return true;
};
