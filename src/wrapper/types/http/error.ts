export interface BaseError {
    [key: string]: unknown;
    code: number | string;
    message: string;
}

export interface Error {
    code: string | number;
    errors: {
        [key: string]: BaseError;
    };
}