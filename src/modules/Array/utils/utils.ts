import * as NEA from "../../NonEmptyArray"
import * as O from "../../Option"
import * as R from "../../Result"
import * as B from "../../Boolean"
import * as E from "../../../types/Eq"
import { Refinement } from "../../../types/utils"
import { Predicate } from "../../../modules/Predicate"
import { flatMap } from "../monad"
import { filterMap } from "../filterable"
import { overload, overloadLast } from "../../../utils/overloads"
import { constant, constEmptyArray } from "../../../utils/constant"
import { flow, pipe } from "../../../utils/flow"
import { match, matchLeft, matchRight } from "./matchers"
import { isNonEmpty } from "../refinements"
import { of } from "../applicative"

export const zero: {
  <A>(): A[]
} = () => []

export const length: {
  <A>(self: A[]): number
} = self => self.length

export const copy: {
  <A>(self: A[]): A[]
} = self => [...self]

export const head: {
  <A>(self: A[]): O.Option<A>
} = match (O.zero, flow (NEA.head, O.some))

export const init: {
  <A>(self: A[]): O.Option<A[]>
} = match (O.zero, flow (NEA.init, O.some))

export const last: {
  <A>(self: A[]): O.Option<A>
} = match (O.zero, flow (NEA.last, O.some))

export const tail: {
  <A>(self: A[]): O.Option<A[]>
} = match (O.zero, flow (NEA.tail, O.some))

export const lookup: {
  <A>(i: number): (self: A[]) => O.Option<A>
  <A>(i: number, self: A[]): O.Option<A>
} = overloadLast (1, (i, self) =>
  i >= 0 && i < length (self) ? pipe (self.at (i)!, O.some) : O.none,
)

/** Like `lookup` but accepts also negative integers where -1 is index of the last element, -2 of the pre-last and so on. */
export const at: {
  <A>(i: number): (self: A[]) => O.Option<A>
  <A>(i: number, self: A[]): O.Option<A>
} = overloadLast (1, (i, self) =>
  i < length (self) && i >= -length (self) ? pipe (self.at (i)!, O.some) : O.none,
)

export const isOutOfBounds: {
  <A>(i: number): (self: A[]) => boolean
  <A>(self: A[], i: number): boolean
} = overload (1, (self, i) => !Object.hasOwn (self, Number (i)))

export const findMap: {
  <A, B>(amb: (a: A) => O.Option<B>): (self: A[]) => O.Option<B>
  <A, B>(self: A[], amb: (a: A) => O.Option<B>): O.Option<B>
} = overload (
  1,
  <A, B>(self: A[], amb: (a: A) => O.Option<B>): O.Option<B> =>
    matchLeft (
      self,
      () => O.none,
      (head, tail) => O.match (amb (head), () => findMap (tail, amb), O.some),
    ),
)

export const find: {
  <A, B extends A>(p: Refinement<A, B>): (self: A[]) => O.Option<B>
  <A, B extends A>(self: A[], p: Refinement<A, B>): O.Option<B>
  <A>(p: Predicate<A>): (self: A[]) => O.Option<A>
  <A>(self: A[], p: Predicate<A>): O.Option<A>
} = overload (
  1,
  <A>(self: A[], p: Predicate<A>): O.Option<A> =>
    findMap (self, a => pipe (a, p, B.match (O.zero, flow (constant (a), O.some)))),
)

export const findLastMap: {
  <A, B>(amb: (a: A) => O.Option<B>): (self: A[]) => O.Option<B>
  <A, B>(self: A[], amb: (a: A) => O.Option<B>): O.Option<B>
} = overload (
  1,
  <A, B>(self: A[], amb: (a: A) => O.Option<B>): O.Option<B> =>
    matchRight (
      self,
      () => O.none,
      (init, last) => O.match (amb (last), () => findLastMap (init, amb), O.some),
    ),
)

export const findIndex: {
  <A>(p: Predicate<A>): (self: A[]) => O.Option<number>
  <A>(self: A[], p: Predicate<A>): O.Option<number>
} = overload (1, (self, p) =>
  pipe (
    self.findIndex (a => p (a)),
    i => i > -1 ? O.some (i) : O.none,
  ),
)

export const findLast: {
  <A, B extends A>(p: Refinement<A, B>): (self: A[]) => O.Option<B>
  <A, B extends A>(self: A[], p: Refinement<A, B>): O.Option<B>
  <A>(p: Predicate<A>): (self: A[]) => O.Option<A>
  <A>(self: A[], p: Predicate<A>): O.Option<A>
} = overload (
  1,
  <A>(self: A[], p: Predicate<A>): O.Option<A> =>
    findLastMap (self, a =>
      pipe (a, p, B.match (O.zero, flow (constant (a), O.some))),
    ),
)

export const findLastIndex: {
  <A>(p: Predicate<A>): (self: A[]) => O.Option<number>
  <A>(self: A[], p: Predicate<A>): O.Option<number>
} = overload (1, (self, p) =>
  pipe (
    self.findLastIndex (a => p (a)),
    i => i > -1 ? O.some (i) : O.none,
  ),
)

/** Is `a` element of an array by `Eq` instance */
export const elem = <A>(
  E: E.Eq<A>,
): {
  (a: A): (self: A[]) => boolean
  (self: A[], a: A): boolean
} => overload (1, (self, a) => pipe (self, find (E.equals (a)), O.isSome))

export const every: {
  <A, B extends A>(p: Refinement<A, B>): Refinement<A[], B[]>
  <A, B extends A>(self: A[], p: Refinement<A, B>): self is B[]
  <A>(p: Predicate<A>): Predicate<A[]>
  <A>(self: A[], p: Predicate<A>): boolean
} = overload (1, (self, p) => self.every (a => p (a)))

export const exists: {
  <A>(p: Predicate<A>): (self: A[]) => self is NEA.NonEmptyArray<A>
  <A>(self: A[], p: Predicate<A>): self is NEA.NonEmptyArray<A>
} = overload (1, (self, p) => self.some (a => p (a)))

/** Alias for exists */
export const some = exists

export const failures: {
  <E, A>(self: R.Result<E, A>[]): E[]
} = flatMap (R.match (of, constEmptyArray))

export const successes: {
  <E, A>(self: R.Result<E, A>[]): A[]
} = flatMap (R.match (constEmptyArray, of))

export const prepend: {
  <A>(a: A): (self: A[]) => NEA.NonEmptyArray<A>
  <A>(a: A, self: A[]): NEA.NonEmptyArray<A>
} = overloadLast (1, (a, self) => [a, ...self])

export const prependAllWith: {
  <A>(f: (a: A) => A): (self: A[]) => A[]
  <A>(f: (a: A) => A, self: A[]): A[]
} = overloadLast (1, (f, self) => flatMap (self, x => [f (x), x]))

export const prependAll: {
  <A>(a: A): (self: A[]) => A[]
  <A>(a: A, self: A[]): A[]
} = overloadLast (1, <A>(a: A, self: A[]) => prependAllWith (constant (a), self))

export const append: {
  <A>(a: A): (self: A[]) => NEA.NonEmptyArray<A>
  <A>(self: A[], a: A): NEA.NonEmptyArray<A>
} = overload (
  1,
  <A>(self: A[], a: A) => [...self, a] as unknown as NEA.NonEmptyArray<A>,
)

export const appendAllWith: {
  <A>(f: (a: A) => A): (self: A[]) => A[]
  <A>(self: A[], f: (a: A) => A): A[]
} = overload (1, (self, f) => flatMap (self, x => [x, f (x)]))

export const appendAll: {
  <A>(a: A): (self: A[]) => A[]
  <A>(self: A[], a: A): A[]
} = overload (1, (self, a) => appendAllWith (self, constant (a)))

export const range: {
  (from: number): (to: number) => NEA.NonEmptyArray<number>
} = from => to =>
  from === to
    ? [from]
    : from < to
      ? [from, ...range (from + 1) (to)]
      : [from, ...range (from - 1) (to)]

export const reverse: {
  <A>(self: A[]): A[]
} = self => self.toReversed ()

export const concat: {
  <A>(end: A[]): (start: A[]) => A[]
  <A>(start: A[], end: A[]): A[]
} = NEA.concat

export const join: {
  <A>(separator: string): (self: A[]) => string
  <A>(self: A[], separator: string): string
} = overload (1, <A>(self: A[], separator: string) => self.join (separator))

/** [f (a, b, ...) | a <- as, b <- bs, ..., p (a, b, ...)] */
export function comprehension<A, R>(
  input: [A[]],
  f: (a: A) => R,
  p?: (a: A) => boolean,
): R[]
export function comprehension<A, B, R>(
  input: [A[], B[]],
  f: (a: A, b: B) => R,
  p?: (a: A, b: B) => boolean,
): R[]
export function comprehension<A, B, C, R>(
  input: [A[], B[], C[]],
  f: (a: A, b: B, c: C) => R,
  p?: (a: A, b: B, c: C) => boolean,
): R[]
export function comprehension<A, B, C, D, R>(
  input: [A[], B[], C[], D[]],
  f: (a: A, b: B, c: C, d: D) => R,
  p?: (a: A, b: B, c: C, d: D) => boolean,
): R[]
export function comprehension(
  input: unknown[][],
  f: (a: unknown, b?: unknown, c?: unknown, d?: unknown) => unknown,
  p: (a: unknown, b?: unknown, c?: unknown, d?: unknown) => boolean = constant (
    true,
  ),
): unknown[] {
  const getArgs: {
    (args: unknown[]): (input: unknown[][]) => unknown[]
  } = args => input =>
    isNonEmpty (input)
      ? pipe (
          input,
          NEA.head,
          flatMap (x => pipe (input, NEA.tail, getArgs (append (x) (args)))),
        )
      : [args]

  return pipe (
    input,
    getArgs ([]),
    filterMap ((args: [unknown]) =>
      isNonEmpty (args)
        ? p (...args)
          ? pipe (f (...args), O.some)
          : O.none
        : // If some of input arrays is empty, then whole result should be an empty array
          O.none,
    ),
  )
}
