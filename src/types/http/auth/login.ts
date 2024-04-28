import { ErrorResponse } from "../error.ts";

export type LoginResponse = {
  token: string;
} & ErrorResponse;

export interface ApiLoginOptions {
  email: string;
  password: string;
  twoFactor?: string;
}
