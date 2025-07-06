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
  <A>(as: A[]): number
} = as => as.length

export const isEmpty = <A>(as: A[]): as is [] => length (as) === 0

export const isNonEmpty = <A>(as: A[]): as is NEA.NonEmptyArray<A> =>
  !isEmpty (as)

export const copy: {
  <A>(as: A[]): A[]
} = as => [...as]

export const head: {
  <A>(as: A[]): O.Option<A>
} = as => isNonEmpty (as) ? pipe (as, NEA.head, O.some) : O.none

export const init: {
  <A>(as: A[]): O.Option<A[]>
} = as => isNonEmpty (as) ? pipe (as, NEA.init, O.some) : O.none

export const last: {
  <A>(as: A[]): O.Option<A>
} = as => isNonEmpty (as) ? pipe (as, NEA.last, O.some) : O.none

export const tail: {
  <A>(as: A[]): O.Option<A[]>
} = as => isNonEmpty (as) ? pipe (as, NEA.tail, O.some) : O.none

export const lookup: {
  <A>(i: number): (as: A[]) => O.Option<A>
  <A>(i: number, as: A[]): O.Option<A>
} = overloadLast (1, (i, as) =>
  i >= 0 && i < length (as) ? pipe (as.at (i)!, O.some) : O.none,
)

/** Like `lookup` but accepts also negative integers where -1 is index of the last element, -2 of the pre-last and so on. */
export const at: {
  <A>(i: number): (as: A[]) => O.Option<A>
  <A>(i: number, as: A[]): O.Option<A>
} = overloadLast (1, (i, as) =>
  i < length (as) && i >= -length (as) ? pipe (as.at (i)!, O.some) : O.none,
)

export const prepend: {
  <A>(a: A): (as: A[]) => NEA.NonEmptyArray<A>
  <A>(a: A, as: A[]): NEA.NonEmptyArray<A>
} = overloadLast (1, (a, as) => [a, ...as])

export const prependAllWith: {
  <A>(f: (a: A) => A): (as: A[]) => A[]
  <A>(f: (a: A) => A, as: A[]): A[]
} = overloadLast (1, (f, as) => flatMap (as, x => [f (x), x]))

export const prependAll: {
  <A>(a: A): (as: A[]) => A[]
  <A>(a: A, as: A[]): A[]
} = overloadLast (1, <A>(a: A, as: A[]) => prependAllWith (constant (a), as))

export const append: {
  <A>(a: A): (as: A[]) => NEA.NonEmptyArray<A>
  <A>(as: A[], a: A): NEA.NonEmptyArray<A>
} = overload (
  1,
  <A>(as: A[], a: A) => [...as, a] as unknown as NEA.NonEmptyArray<A>,
)

export const appendAllWith: {
  <A>(f: (a: A) => A): (as: A[]) => A[]
  <A>(as: A[], f: (a: A) => A): A[]
} = overload (1, (as, f) => flatMap (as, x => [x, f (x)]))

export const appendAll: {
  <A>(a: A): (as: A[]) => A[]
  <A>(as: A[], a: A): A[]
} = overload (1, (as, a) => appendAllWith (as, constant (a)))

export const range: {
  (from: number): (to: number) => NEA.NonEmptyArray<number>
} = from => to =>
  from === to
    ? [from]
    : from < to
      ? [from, ...range (from + 1) (to)]
      : [from, ...range (from - 1) (to)]

export const reverse: {
  <A>(a: A[]): A[]
} = as => as.toReversed ()

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
