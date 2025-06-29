/* eslint-disable @typescript-eslint/no-explicit-any */

interface Overloaded0 {
  <Point, R>(point: Point): R
  <Point, R>(): (point: Point) => R
}

interface Overloaded1 {
  <Point, A, R>(point: Point, a: A): R
  <Point, A, R>(a: A): (point: Point) => R
}

interface Overloaded2 {
  <Point, A, B, R>(point: Point, a: A, b: B): R
  <Point, A, B, R>(a: A, b: B): (point: Point) => R
}

interface Overloaded3 {
  <Point, A, B, C, R>(point: Point, a: A, b: B, c: C): R
  <Point, A, B, C, R>(a: A, b: B, c: C): (point: Point) => R
}

interface OverloadedN {
  <Point, A extends readonly any[], R>(point: Point, ...as: A): R
  <Point, A extends readonly any[], R>(...as: A): (point: Point) => R
}

/**
 * Overloads `point => r` with `() => point => r`
 */
export function overload<A extends Overloaded0>(
  n: 0,
  pointed: (arg: Parameters<A>[0]) => ReturnType<A>,
): A
/**
 * Overloads `point => r` with `() => point => r`
 */
export function overload<A extends Overloaded0>(
  n: 0,
): (pointed: (arg: Parameters<A>[0]) => ReturnType<A>) => A
/**
 * Overloads `(point, a) => r` with `a => point => r`
 */
export function overload<A extends Overloaded1>(
  n: 1,
  pointed: (...args: [Parameters<A>[0], Parameters<A>[1]]) => ReturnType<A>,
): A
/**
 * Overloads `(point, a) => r` with `a => point => r`
 */
export function overload<A extends Overloaded1>(
  n: 1,
): (
  pointed: (...args: [Parameters<A>[0], Parameters<A>[1]]) => ReturnType<A>,
) => A
/**
 * Overloads `(point, a, b) => r` with `(a, b) => point => r`
 */
export function overload<A extends Overloaded2>(
  n: 2,
  pointed: (
    ...args: [Parameters<A>[0], Parameters<A>[1], Parameters<A>[2]]
  ) => ReturnType<A>,
): A
/**
 * Overloads `(point, a, b) => r` with `(a, b) => point => r`
 */
export function overload<A extends Overloaded2>(
  n: 2,
): (
  pointed: (
    ...args: [Parameters<A>[0], Parameters<A>[1], Parameters<A>[2]]
  ) => ReturnType<A>,
) => A
/**
 * Overloads `(point, a, b, c) => r` with `(a, b, c) => point => r`
 */
export function overload<A extends Overloaded3>(
  n: 3,
  pointed: (
    ...args: [
      Parameters<A>[0],
      Parameters<A>[1],
      Parameters<A>[2],
      Parameters<A>[3],
    ]
  ) => ReturnType<A>,
): A
/**
 * Overloads `(point, a, b, c) => r` with `(a, b, c) => point => r`
 */
export function overload<A extends Overloaded3>(
  n: 3,
): (
  pointed: (
    ...args: [
      Parameters<A>[0],
      Parameters<A>[1],
      Parameters<A>[2],
      Parameters<A>[3],
    ]
  ) => ReturnType<A>,
) => A
/**
 * Overloads `(point, ...nargs) => r` with `(...nargs) => point => r`
 */
export function overload<A extends OverloadedN>(
  n: number,
  pointed: (...args: Parameters<A>) => ReturnType<A>,
): A
/**
 * Overloads `(point, ...nargs) => r` with `(...nargs) => point => r`
 */
export function overload<A extends OverloadedN>(
  n: number,
): (pointed: (...args: Parameters<A>) => ReturnType<A>) => A
export function overload<A extends OverloadedN>(
  n: number,
  pointed?: (...args: Parameters<A>) => ReturnType<A>,
): A {
  const overload_ =
    (pointed: (...args: any[]) => any) =>
    (...args: any[]): any =>
      args.length < n + 1
        ? (point: any) => pointed (point, ...args)
        : pointed (...args)

  return (
    typeof pointed === "undefined"
      ? (pointed: (...args: any[]) => any) => overload_ (pointed)
      : overload_ (pointed)
  ) as any
}
