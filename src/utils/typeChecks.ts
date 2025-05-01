export function typeOf(a: number): "number"
export function typeOf(a: string): "string"
export function typeOf(a: boolean): "boolean"
export function typeOf(a: (...xs: unknown[]) => unknown): "function"
export function typeOf(a: object): "object"
export function typeOf(a: null): "object"
export function typeOf(a: undefined): "undefined"
export function typeOf(a: symbol): "symbol"
export function typeOf(a: bigint): "bigint"
export function typeOf(
  a: unknown,
):
  | "number"
  | "string"
  | "boolean"
  | "object"
  | "function"
  | "undefined"
  | "symbol"
  | "bigint"
export function typeOf(
  a: unknown,
):
  | "number"
  | "string"
  | "boolean"
  | "object"
  | "function"
  | "undefined"
  | "symbol"
  | "bigint" {
  return typeof a
}

export const isFunction = (a: unknown): a is (...xs: unknown[]) => unknown =>
  typeOf (a) === "function"
