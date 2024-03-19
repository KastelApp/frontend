import type Client from "$/Client/Client.ts";
import type { ApiSettings, DefaultHeaders } from "$/types/api.ts";

export interface APIOptions<RequestBody = Record<string, unknown>> {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: RequestBody;
  noVersion?: boolean;
  noAuth?: boolean;
}

class API {
  public url: string = "http://localhost:62250";

  public version: number;

  public defaultHeaders: DefaultHeaders;

  public cdnUrl: string;

  public mediaUrl: string;

  public client?: Client;

  public constructor(options: Partial<ApiSettings>, client?: Client) {
    this.url = options.url ?? "http://localhost:62250";

    this.version = this.parseVersion(options.version ?? "v1") ?? 1;

    this.defaultHeaders = options.defaultHeaders ?? {
      "X-Special-Properties": "",
    };

    this.cdnUrl = options.cdnUrl ?? "http://localhost:62240";

    this.mediaUrl = options.mediaUrl ?? "http://localhost:62260";

    this.client = client;
  }

  public parseVersion(version: string): number | null {
    const parsed = parseInt(version.slice(1, 2));

    return parsed > 20 || parsed < 1 ? null : parsed;
  }

  /*
   * If we make a request to the API, we assume that you are not using a complete url (i.e doing /users/@me instead of https://api.example.com/v1/users/@me)
   * If you are using a complete url, we do not provide any default headers, this includes not providing the authorization header
   * The CDN & Media urls while they do get access to the headers, they should be used in their respected functions (i.e requestCdn, requestMedia)
   */
  public async request<
    ResponseBody = Record<string, unknown>,
    RequestBody = Record<string, unknown>,
  >(
    opts: APIOptions<RequestBody>,
  ): Promise<{
    status: number;
    ok: boolean; // false if its 5xx
    headers: Headers;
    json: () => Promise<ResponseBody>;
    text: () => Promise<string>;
    error?: Error;
  }> {
    try {
      const { method, url, body, headers, noAuth, noVersion } = opts;

      const urlRegex = new RegExp(/^(http|https):\/\/[^ "]+$/);
      const completeUrl = urlRegex.test(url);
      const finalHeaders = completeUrl
        ? {}
        : {
            ...this.defaultHeaders,
            ...(this.client?.token && !noAuth
              ? { Authorization: this.client.token }
              : {}),
            ...(typeof body === "object"
              ? { "Content-Type": "application/json" }
              : {}),
          };
      const finalBody = body
        ? typeof body === "string"
          ? body
          : JSON.stringify(body)
        : undefined;

      const response = await fetch(
        completeUrl
          ? url
          : `${this.url}${noVersion ? "" : `/v${this.version}`}${url}`,
        {
          method,
          headers: {
            ...finalHeaders,
            ...headers,
          },
          body: finalBody,
        },
      );

      return {
        status: response.status,
        ok: response.status < 500,
        headers: response.headers,
        json: () => response.json(),
        text: () => response.text(),
      };
    } catch (error) {
      return {
        status: 500,
        ok: false,
        headers: new Headers(),
        json: async () => ({}) as ResponseBody,
        text: async () => "",
        error: error instanceof Error ? error : new Error("Unknown error"),
      };
    }
  }

  public async requestCdn(opts: {
    url: string;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    headers?: Record<string, string>;
    body?: Record<string, unknown>;
  }): Promise<{
    status: number;
    ok: boolean; // false if its 5xx
    headers: Headers;
    json: () => Promise<Record<string, unknown>>;
    text: () => Promise<string>;
  }> {
    const { method, url, body, headers } = opts;

    const finalBody = body ? JSON.stringify(body) : undefined;

    const response = await fetch(`${this.cdnUrl}${url}`, {
      method,
      headers,
      body: finalBody,
    });

    return {
      status: response.status,
      ok: response.status < 500,
      headers: response.headers,
      json: () => response.json(),
      text: () => response.text(),
    };
  }

  public async requestMedia(opts: {
    url: string;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    headers?: Record<string, string>;
    body?: Record<string, unknown>;
  }): Promise<{
    status: number;
    ok: boolean; // false if its 5xx
    headers: Headers;
    json: () => Promise<Record<string, unknown>>;
    text: () => Promise<string>;
  }> {
    const { method, url, body, headers } = opts;

    const finalBody = body ? JSON.stringify(body) : undefined;

    const response = await fetch(`${this.mediaUrl}${url}`, {
      method,
      headers,
      body: finalBody,
    });

    return {
      status: response.status,
      ok: response.status < 500,
      headers: response.headers,
      json: () => response.json(),
      text: () => response.text(),
    };
  }

  public async get<ResponseBody = Record<string, unknown>>(
    url: string,
    opts?: {
      headers?: Record<string, string>;
      noVersion?: boolean;
      noAuth?: boolean;
    },
  ) {
    return this.request<ResponseBody>({
      url,
      method: "GET",
      ...opts,
    });
  }

  public async post<
    ResponseBody = Record<string, unknown>,
    RequestBody = Record<string, unknown>,
  >(
    url: string,
    body?: RequestBody,
    opts?: {
      headers?: Record<string, string>;
      noVersion?: boolean;
      noAuth?: boolean;
    },
  ) {
    return this.request<ResponseBody, RequestBody>({
      url,
      method: "POST",
      body,
      ...opts,
    });
  }

  public async put<
    ResponseBody = Record<string, unknown>,
    RequestBody = Record<string, unknown>,
  >(
    url: string,
    body?: RequestBody,
    opts?: {
      headers?: Record<string, string>;
      noVersion?: boolean;
      noAuth?: boolean;
    },
  ) {
    return this.request<ResponseBody, RequestBody>({
      url,
      method: "PUT",
      body,
      ...opts,
    });
  }

  public async patch<
    ResponseBody = Record<string, unknown>,
    RequestBody = Record<string, unknown>,
  >(
    url: string,
    body?: RequestBody,
    opts?: {
      headers?: Record<string, string>;
      noVersion?: boolean;
      noAuth?: boolean;
    },
  ) {
    return this.request<ResponseBody, RequestBody>({
      url,
      method: "PATCH",
      body,
      ...opts,
    });
  }

  public async delete<
    ResponseBody = Record<string, unknown>,
    RequestBody = Record<string, unknown>,
  >(
    url: string,
    body?: RequestBody,
    opts?: {
      headers?: Record<string, string>;
      noVersion?: boolean;
      noAuth?: boolean;
    },
  ) {
    return this.request<ResponseBody, RequestBody>({
      url,
      method: "DELETE",
      body,
      ...opts,
    });
  }
}

export default API;
