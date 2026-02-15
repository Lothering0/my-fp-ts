import { pipe } from '../../utils/flow'
import { equals } from './equivalence'
import { isEven, lessThan, lessThanOrEquals } from './utils'

export interface MatchersZero<A, B = A> {
  readonly onZero: (e: 0) => A
  readonly onNonZero: (a: number) => B
}

/** Match zero and positive or negative number */
export const matchZero: {
  <A, B = A>(matchers: MatchersZero<A, B>): (n: number) => A | B
} = matchers => n =>
  pipe(n, equals(0)) ? matchers.onZero(0) : matchers.onNonZero(n)

export interface MatchersNegative<A, B = A> {
  readonly onNegative: (e: number) => A
  readonly onNonNegative: (a: number) => B
}

/** Match negative and zero or positive number */
export const matchNegative: {
  <A, B = A>(matchers: MatchersNegative<A, B>): (n: number) => A | B
} = matchers => n =>
  pipe(n, lessThan(0)) ? matchers.onNegative(n) : matchers.onNonNegative(n)

export interface MatchersNonPositive<A, B = A> {
  readonly onNonPositive: (e: number) => A
  readonly onPositive: (a: number) => B
}

/** Match negative or zero and positive number */
export const matchNonPositive: {
  <A, B = A>(matchers: MatchersNonPositive<A, B>): (n: number) => A | B
} = matchers => n =>
  pipe(n, lessThanOrEquals(0))
    ? matchers.onNonPositive(n)
    : matchers.onPositive(n)

export interface MatchersFloat<A, B = A> {
  readonly onFloat: (e: number) => A
  readonly onInteger: (a: number) => B
}

/** Match float and integer */
export const matchFloat: {
  <A, B = A>(matchers: MatchersFloat<A, B>): (n: number) => A | B
} = matchers => n =>
  Number.isInteger(n) ? matchers.onInteger(n) : matchers.onFloat(n)

export interface MatchersOdd<A, B = A> {
  readonly onOdd: (e: number) => A
  readonly onEven: (a: number) => B
}

/** Match odd and even number */
export const matchOdd: {
  <A, B = A>(matchers: MatchersOdd<A, B>): (n: number) => A | B
} = matchers => n => (isEven(n) ? matchers.onEven(n) : matchers.onOdd(n))
