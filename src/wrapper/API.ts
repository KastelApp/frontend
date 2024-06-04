import Logger from "@/utils/Logger.ts";
import safePromise from "@/utils/safePromise.ts";

type RequestData = object | FormData | string;
type ResponseData = unknown;

type MethodOptions<ForcedPayload = RequestData> = string | {
    /**
     * Note: If the url includes anything like "https?", or "../" we will not add any of the default headers
     */
    url: string;
    /**
     * This can be an object, form data, or a string
     */
    data?: ForcedPayload;
    headers?: Record<string, string | number>;
    /**
     * Some stuff may not require authorization, so we may not want to send it in the headers This disables it
     */
    noAuth?: boolean;
    /**
     * No Version will not add the version to the url
     */
    noVersion?: boolean;
};

interface Response<ForcedResponseOpt = ResponseData> {
    status: number;
    body: ForcedResponseOpt;
    text: string | null;
    headers: Record<string, string | number>;
    blob: Blob | null;
    /**
     * Okay just means that it wasn't a 500 error and that the wrapper itself didn't throw an error
     */
    ok: boolean;
}

interface MixedOptions {
    apiUrl?: string;
    apiVersion?: string;
    urlCheckRegex?: RegExp;
}

class API {

    public API_URL: string = process.env.API_URL || "http://localhost:62250";

    public VERSION: string = process.env.API_VERSION || "1";

    private URL_CHECK_REGEX: RegExp = /^(https?:|\/{2}|\.+\/)/;

    #token: string | null = null;

    private defaultHeaders: Record<string, string> = {};

    public constructor(token: string | null, defaultHeaders: Record<string, string> = {}, options: MixedOptions = {}) {
        this.#token = token;
        this.defaultHeaders = defaultHeaders;

        if (options.apiUrl) this.API_URL = options.apiUrl;
        if (options.apiVersion) this.VERSION = options.apiVersion;
        if (options.urlCheckRegex) {
            this.URL_CHECK_REGEX = options.urlCheckRegex;

            Logger.warn("A custom URL check regex was provided, be wary of what you're doing!", "API Class");
        };

        if (!this.API_URL) throw new Error("API_URL is required");
        if (!this.VERSION) throw new Error("API_VERSION is required");
    }

    public set token(token: string | null) {
        this.#token = token;
    }

    /**
     * Determine the content type of the data
     * @param data The data to determine the content type of
     * @returns The content type of the data (or null if something went wrong / there's no data to compare to)
     */
    private determineContentType(data: unknown): string | null {
        if (data === null || data === undefined) return null;

        if (data instanceof FormData) {
            return "multipart/form-data";
        }

        return "application/json";
    }

    /**
     * Make a HTTP request
     * @param method The method to use
     * @param options The options for the request (string or object)
     * @returns The response object
     */
    async #makeRequest<Request = RequestData, ResponseOpt = ResponseData>(method: string, options: MethodOptions<Request>): Promise<Response<ResponseOpt>> {
        if (!("window" in globalThis) || !("fetch" in globalThis)) return null as unknown as Response<ResponseOpt>;

        const fixedOptions = {
            url: typeof options === "string" ? options : options.url,
            data: typeof options === "string" ? undefined : options.data,
            headers: typeof options === "string" ? {} : options.headers,
            noAuth: typeof options === "string" ? false : options.noAuth,
            noVersion: typeof options === "string" ? false : options.noVersion,
        };

        const fullUrl = this.URL_CHECK_REGEX.test(fixedOptions.url)
            ? fixedOptions.url
            : `${this.API_URL}${!fixedOptions.noVersion ? `/v${this.VERSION}` : ""}/${fixedOptions.url}`;

        const determinedType = this.determineContentType(fixedOptions.data);

        const endingHeaders = this.URL_CHECK_REGEX.test(fixedOptions.url) ? {}
            : {
                ...(determinedType ? { "Content-Type": determinedType } : {}),
                ...((fixedOptions.noAuth || !this.#token) ? {} : {
                    "Authorization": this.#token
                }),
                ...this.defaultHeaders,
                ...fixedOptions.headers,
            };

        const fixedBody = determinedType === "application/json" ? JSON.stringify(fixedOptions.data) : fixedOptions.data;

        const fetched = await fetch(fullUrl.replace(/\/+$/, "/"), {
            method,
            headers: endingHeaders,
            // note: we are assuming the person making the request handles the body correctly if not boo hoo if it error's out, handle it better
            body: fixedBody as string,
        });

        const [text] = await safePromise(fetched.clone().text());
        const [body] = await safePromise(fetched.clone().json());
        const [blob] = await safePromise(fetched.clone().blob());

        return {
            status: fetched.status,
            body,
            text,
            headers: Object.fromEntries(fetched.headers.entries()),
            blob,
            ok: fetched.ok,
        };
    }

    /**
     * Get a request
     * @param options The options for the request
     * @returns The response object
     */
    public async get<Request = RequestData, ResponseOpt = ResponseData>(options: MethodOptions<Request>): Promise<Response<ResponseOpt>> {
        return this.#makeRequest("GET", options);
    }

    /**
     * Delete a request
     * @param options The options for the request
     * @returns The response object
     */
    public async del<Request = RequestData, ResponseOpt = ResponseData>(options: MethodOptions<Request>): Promise<Response<ResponseOpt>> {
        return this.#makeRequest("DELETE", options);
    }

    /**
     * Get a request
     * @param options The options for the request
     * @returns The response object
     */
    public async patch<Request = RequestData, ResponseOpt = ResponseData>(options: MethodOptions<Request>): Promise<Response<ResponseOpt>> {
        return this.#makeRequest("PATCH", options);
    }

    /**
     * Post a request
     * @param options The options for the request
     * @returns The response object
     */
    public async post<Request = RequestData, ResponseOpt = ResponseData>(options: MethodOptions<Request>): Promise<Response<ResponseOpt>> {
        return this.#makeRequest("POST", options);
    }

    /**
     * Put a request
     * @param options The options for the request
     * @returns The response object
     */
    public async put<Request = RequestData, ResponseOpt = ResponseData>(options: MethodOptions<Request>): Promise<Response<ResponseOpt>> {
        return this.#makeRequest("PUT", options);
    }
}

export default API;