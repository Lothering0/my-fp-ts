export function typeOf(x: number): "number"
export function typeOf(x: string): "string"
export function typeOf(x: boolean): "boolean"
export function typeOf(x: (...xs: unknown[]) => unknown): "function"
export function typeOf(x: object): "object"
export function typeOf(x: null): "object"
export function typeOf(x: undefined): "undefined"
export function typeOf(x: symbol): "symbol"
export function typeOf(x: bigint): "bigint"
export function typeOf(
  x: unknown,
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
  x: unknown,
):
  | "number"
  | "string"
  | "boolean"
  | "object"
  | "function"
  | "undefined"
  | "symbol"
  | "bigint" {
  return typeof x
}

export const isNumber = (x: unknown): x is number => typeOf (x) === "number"

export const isString = (x: unknown): x is string => typeOf (x) === "string"

export const isBoolean = (x: unknown): x is boolean => typeOf (x) === "boolean"

export const isNullableObject = (x: unknown): x is object | null =>
  typeOf (x) === "object"

export const isFunction = (x: unknown): x is (...xs: unknown[]) => unknown =>
  typeOf (x) === "function"

export const isUndefined = (x: unknown): x is undefined =>
  typeOf (x) === "undefined"

export const isSymbol = (x: unknown): x is symbol => typeOf (x) === "symbol"

export const isBigint = (x: unknown): x is bigint => typeOf (x) === "bigint"

export const isNull = (x: unknown): x is null => x === null

export const isNullable = (x: unknown): x is null | undefined | void =>
  x == null

export const isDefined = (x: unknown): boolean => x != null

export const isObject = (x: unknown): x is object =>
  typeOf (x) === "object" && isDefined (x)
