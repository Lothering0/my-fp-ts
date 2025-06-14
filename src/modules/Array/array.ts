import * as NEA from "../NonEmptyArray"
import * as O from "../Option"
import { flatMap } from "./monad"
import { getSemigroup } from "./semigroup"
import { filterMap } from "./filterable"
import { URIS } from "../../types/Kind"
import { overload2 } from "../../utils/overloads"
import { constant } from "../../utils/constant"
import { pipe } from "../../utils/flow"

declare module "../../types/Kind" {
  interface URIToKind<A> {
    readonly Array: Array<A>
  }
}

export const _URI = "Array" satisfies URIS

type Length = <A>(as: A[]) => number
export const length: Length = as => as.length

export const isEmpty = <A>(as: A[]): as is [] => length (as) === 0

export const isNonEmpty = <A>(as: A[]): as is NEA.NonEmptyArray<A> =>
  !isEmpty (as)

type Copy = <A>(as: A[]) => A[]
export const copy: Copy = as => [...as]

interface ArrayEliminatorPointed {
  <A, B>(
    as: A[],
    whenEmpty: () => B,
    whenNonEmpty: (as: NEA.NonEmptyArray<A>) => B,
  ): B
}

interface ArrayEliminator extends ArrayEliminatorPointed {
  <A, B>(
    whenEmpty: () => B,
    whenNonEmpty: (as: NEA.NonEmptyArray<A>) => B,
  ): (as: A[]) => B
}

const arrayPointed: ArrayEliminatorPointed = (as, whenEmpty, whenNonEmpty) =>
  isNonEmpty (as) ? whenNonEmpty (as) : whenEmpty ()

export const array: ArrayEliminator = overload2 (arrayPointed)

type Head = <A>(as: A[]) => O.Option<A>
export const head: Head = as =>
  isNonEmpty (as) ? pipe (as, NEA.head, O.some) : O.none

type Init = <A>(as: A[]) => O.Option<A[]>
export const init: Init = as =>
  isNonEmpty (as) ? pipe (as, NEA.init, O.some) : O.none

type Last = <A>(as: A[]) => O.Option<A>
export const last: Last = as =>
  isNonEmpty (as) ? pipe (as, NEA.last, O.some) : O.none

type Tail = <A>(as: A[]) => O.Option<A[]>
export const tail: Tail = as =>
  isNonEmpty (as) ? pipe (as, NEA.tail, O.some) : O.none

type Prepend = <A>(a: A) => (as: A[]) => NEA.NonEmptyArray<A>
export const prepend: Prepend = a => as => [a, ...as]

type PrependAllWith = <A>(f: (a: A) => A) => (as: A[]) => A[]
export const prependAllWith: PrependAllWith = f => as =>
  flatMap (as, x => [f (x), x])

type PrependAll = <A>(a: A) => (as: A[]) => A[]
export const prependAll: PrependAll = <A>(a: A) =>
  pipe (a, constant, prependAllWith<A>)

type Append = <A>(a: A) => (as: A[]) => NEA.NonEmptyArray<A>
export const append: Append =
  <A>(a: A) =>
  as =>
    [...as, a] as unknown as NEA.NonEmptyArray<A>

type AppendAllWith = <A>(f: (a: A) => A) => (as: A[]) => A[]
export const appendAllWith: AppendAllWith = f => as =>
  flatMap (as, x => [x, f (x)])

type AppendAll = <A>(a: A) => (as: A[]) => A[]
export const appendAll: AppendAll = <A>(a: A) =>
  pipe (a, constant, appendAllWith<A>)

type Range = (from: number) => (to: number) => NEA.NonEmptyArray<number>
export const range: Range = from => to =>
  from === to
    ? [from]
    : from < to
      ? [from, ...range (from + 1) (to)]
      : [from, ...range (from - 1) (to)]

type Reverse = <A>(a: A[]) => A[]
export const reverse: Reverse = as => as.toReversed ()

type Concat = <A>(first: A[]) => (second: A[]) => A[]
export const concat: Concat =
  <A>(first: A[]) =>
  (second: A[]) =>
    getSemigroup<A> ().concat (first, second)

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
