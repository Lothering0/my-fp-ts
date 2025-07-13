/* eslint-disable @typescript-eslint/no-explicit-any */

interface OverloadedLast0 {
  <Point, R>(): (point: Point) => R
  <Point, R>(point: Point): R
}

interface OverloadedLast1 {
  <A, Point, R>(a: A): (point: Point) => R
  <A, Point, R>(a: A, point: Point): R
}

interface OverloadedLast2 {
  <A, B, Point, R>(a: A, b: B): (point: Point) => R
  <A, B, Point, R>(a: A, b: B, point: Point): R
}

interface OverloadedLast3 {
  <A, B, C, Point, R>(a: A, b: B, c: C): (point: Point) => R
  <A, B, C, Point, R>(a: A, b: B, c: C, point: Point): R
}

interface OverloadedLastN {
  <Point, A extends readonly [...any, Point], R>(...as: A): (point: Point) => R
  <Point, A extends readonly [...any, Point], R>(...as: A): R
}

/**
 * Overloads `point => r` with `() => point => r`
 */
export function overloadLast<A extends OverloadedLast0>(
  n: 0,
  pointed: (arg: Parameters<A>[0]) => ReturnType<A>,
): A
/**
 * Overloads `point => r` with `() => point => r`
 */
export function overloadLast<A extends OverloadedLast0>(
  n: 0,
): (pointed: (arg: Parameters<A>[0]) => ReturnType<A>) => A
/**
 * Overloads `(a, point) => r` with `a => point => r`
 */
export function overloadLast<A extends OverloadedLast1>(
  n: 1,
  pointed: (...args: [Parameters<A>[0], Parameters<A>[1]]) => ReturnType<A>,
): A
/**
 * Overloads `(a, point) => r` with `a => point => r`
 */
export function overloadLast<A extends OverloadedLast1>(
  n: 1,
): (
  pointed: (...args: [Parameters<A>[0], Parameters<A>[1]]) => ReturnType<A>,
) => A
/**
 * Overloads `(a, b, point) => r` with `(a, b) => point => r`
 */
export function overloadLast<A extends OverloadedLast2>(
  n: 2,
  pointed: (
    ...args: [Parameters<A>[0], Parameters<A>[1], Parameters<A>[2]]
  ) => ReturnType<A>,
): A
/**
 * Overloads `(a, b, point) => r` with `(a, b) => point => r`
 */
export function overloadLast<A extends OverloadedLast2>(
  n: 2,
): (
  pointed: (
    ...args: [Parameters<A>[0], Parameters<A>[1], Parameters<A>[2]]
  ) => ReturnType<A>,
) => A
/**
 * Overloads `(a, b, c, point) => r` with `(a, b, c) => point => r`
 */
export function overloadLast<A extends OverloadedLast3>(
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
 * Overloads `(a, b, c, point) => r` with `(a, b, c) => point => r`
 */
export function overloadLast<A extends OverloadedLast3>(
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
 * Overloads `(...nargs, point) => r` with `(...nargs) => point => r`
 */
export function overloadLast<A extends OverloadedLastN>(
  n: number,
  pointed: (...args: Parameters<A>) => ReturnType<A>,
): A
/**
 * Overloads `(...nargs, point) => r` with `(...nargs) => point => r`
 */
export function overloadLast<A extends OverloadedLastN>(
  n: number,
): (pointed: (...args: Parameters<A>) => ReturnType<A>) => A
export function overloadLast<A extends OverloadedLastN>(
  n: number,
  pointed?: (...args: Parameters<A>) => ReturnType<A>,
): A {
  const overloadLast_ =
    (pointed: (...args: any[]) => any) =>
    (...args: any[]): any =>
      args.length < n + 1
        ? (point: any) => pointed (...args, point)
        : pointed (...args)

  return (
    typeof pointed === "undefined"
      ? (pointed: (...args: any[]) => any) => overloadLast_ (pointed)
      : overloadLast_ (pointed)
  ) as any
}
