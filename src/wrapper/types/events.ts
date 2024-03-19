export interface RawIdentify {
  token: string;
  meta: {
    client?: string;
    os: string;
    device: "browser" | "desktop" | "mobile";
  };
}

export interface Event {
  op: number;
  data: unknown;
}

export interface Identify extends Event {
  op: 1;
  data: RawIdentify;
}
