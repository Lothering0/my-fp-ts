/* eslint-disable @typescript-eslint/no-explicit-any */

interface OverloadLast0 {
  <Point, R>(point: Point): R
  <Point, R>(): (point: Point) => R
}

interface OverloadLast1 {
  <A, Point, R>(a: A, point: Point): R
  <A, Point, R>(a: A): (point: Point) => R
}

interface OverloadLast2 {
  <A, B, Point, R>(a: A, b: B, point: Point): R
  <A, B, Point, R>(a: A, b: B): (point: Point) => R
}

interface OverloadLast3 {
  <A, B, C, Point, R>(a: A, b: B, c: C, point: Point): R
  <A, B, C, Point, R>(a: A, b: B, c: C): (point: Point) => R
}

interface OverloadLastN {
  <Point, A extends readonly [...any, Point], R>(...as: A): R
  <Point, A extends readonly [...any, Point], R>(...as: A): (point: Point) => R
}

/**
 * Overloads `point => r` with `() => point => r`
 */
export function overloadLast<A extends OverloadLast0>(
  n: 0,
  pointed: (arg: any) => any,
): A
/**
 * Overloads `(a, point) => r` with `a => point => r`
 */
export function overloadLast<A extends OverloadLast1>(
  n: 1,
  pointed: (...args: [any, any]) => any,
): A
/**
 * Overloads `(a, b, point) => r` with `(a, b) => point => r`
 */
export function overloadLast<A extends OverloadLast2>(
  n: 2,
  pointed: (...args: [any, any, any]) => any,
): A
/**
 * Overloads `(a, b, c, point) => r` with `(a, b, c) => point => r`
 */
export function overloadLast<A extends OverloadLast3>(
  n: 3,
  pointed: (...args: [any, any, any, any]) => any,
): A
/**
 * Overloads `(...nargs, point) => r` with `(...nargs) => point => r`
 */
export function overloadLast<A extends OverloadLastN>(
  n: number,
  pointed: (...args: any[]) => any,
): A
export function overloadLast<A extends OverloadLastN>(
  n: number,
  pointed: (...args: any[]) => any,
): A {
  return ((...args: any[]): any =>
    args.length < n + 1
      ? (x: any) => pointed (...args, x)
      : pointed (...args)) as any
}
