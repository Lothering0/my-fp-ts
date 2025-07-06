import * as NEA from "../../NonEmptyArray"
import * as O from "../../Option"
import { flatMap } from "../monad"
import { filterMap } from "../filterable"
import { overload, overloadLast } from "../../../utils/overloads"
import { constant } from "../../../utils/constant"
import { pipe } from "../../../utils/flow"

export const zero: {
  <A>(): A[]
} = () => []

export const length: {
  <A>(self: A[]): number
} = self => self.length

export const isEmpty = <A>(self: A[]): self is [] => length (self) === 0

export const isNonEmpty = <A>(self: A[]): self is NEA.NonEmptyArray<A> =>
  !isEmpty (self)

export const copy: {
  <A>(self: A[]): A[]
} = self => [...self]

export const head: {
  <A>(self: A[]): O.Option<A>
} = self => isNonEmpty (self) ? pipe (self, NEA.head, O.some) : O.none

export const init: {
  <A>(self: A[]): O.Option<A[]>
} = self => isNonEmpty (self) ? pipe (self, NEA.init, O.some) : O.none

export const last: {
  <A>(self: A[]): O.Option<A>
} = self => isNonEmpty (self) ? pipe (self, NEA.last, O.some) : O.none

export const tail: {
  <A>(self: A[]): O.Option<A[]>
} = self => isNonEmpty (self) ? pipe (self, NEA.tail, O.some) : O.none

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
  type GetArgs = (args: unknown[]) => (input: unknown[][]) => unknown[]
  const getArgs: GetArgs = args => input =>
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

export * from "./matchers"
