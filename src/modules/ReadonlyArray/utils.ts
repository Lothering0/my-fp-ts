import * as Array from './readonly-array'
import * as Option from '../Option'
import * as Result from '../Result'
import * as Boolean from '../Boolean'
import * as Number from '../Number'
import * as Equivalence from '../../typeclasses/Equivalence'
import * as Order from '../../typeclasses/Order'
import { Refinement, RefinementWithIndex } from '../Refinement'
import { Predicate, PredicateWithIndex } from '../Predicate'
import { flatMap } from './monad'
import { filterMap } from './filterable'
import { constant, constEmptyArray } from '../../utils/constant'
import { flow, pipe } from '../../utils/flow'
import { match } from './matchers'
import { isEmpty, isNonEmpty } from './refinements'
import { of } from './from-identity'
import { Endomorphism } from '../../typeclasses/Endomorphism'
import { NonEmptyIterable } from '../_internal'

export const toArray = <A>(array: ReadonlyArray<A>): A[] => array as A[]

export const fromIterable = <F extends Iterable<any>>(
  iterable: F,
): F extends NonEmptyIterable<infer A>
  ? Array.NonEmpty<A>
  : F extends Iterable<infer A>
    ? ReadonlyArray<A>
    : never => [...iterable] as any

export const make: {
  <A>(...as: Array.NonEmpty<A>): Array.NonEmpty<A>
  <A>(...as: ReadonlyArray<A>): ReadonlyArray<A>
} = (...as) => fromIterable(as) as any

/** Time complexity: O(1) */
export const length: {
  (array: ReadonlyArray<unknown>): number
} = array => array.length

export const copy: {
  <A>(array: ReadonlyArray<A>): ReadonlyArray<A>
} = array => [...array]

/** Time complexity: O(1) */
export const headNonEmpty: {
  <A>(as: Array.NonEmpty<A>): A
} = as => as[0]

/** Time complexity: O(1) */
export const head: {
  <A>(array: ReadonlyArray<A>): Option.Option<A>
} = match({
  onEmpty: Option.none,
  onNonEmpty: flow(headNonEmpty, Option.some),
})

/** Time complexity: O(n) */
export const initNonEmpty: {
  <A>(array: Array.NonEmpty<A>): ReadonlyArray<A>
} = array => array.slice(0, -1)

/** Time complexity: O(n) */
export const init: {
  <A>(array: ReadonlyArray<A>): Option.Option<ReadonlyArray<A>>
} = match({
  onEmpty: Option.none,
  onNonEmpty: flow(initNonEmpty, Option.some),
})

/** Time complexity: O(1) */
export const lastNonEmpty: {
  <A>(array: Array.NonEmpty<A>): A
} = array => array.at(-1)!

/** Time complexity: O(1) */
export const last: {
  <A>(array: ReadonlyArray<A>): Option.Option<A>
} = match({
  onEmpty: Option.none,
  onNonEmpty: flow(lastNonEmpty, Option.some),
})

/** Time complexity: O(n) */
export const tailNonEmpty: {
  <A>(array: Array.NonEmpty<A>): ReadonlyArray<A>
} = array => array.slice(1)

/** Time complexity: O(n) */
export const tail: {
  <A>(array: ReadonlyArray<A>): Option.Option<ReadonlyArray<A>>
} = match({
  onEmpty: Option.none,
  onNonEmpty: flow(tailNonEmpty, Option.some),
})

/** Time complexity: O(1) */
export const has: {
  (i: number): <A>(array: ReadonlyArray<A>) => boolean
} = i => array => Object.hasOwn(array, Number.Number(i))

/** Time complexity: O(1) */
export const isOutOfBounds: {
  (i: number): <A>(array: ReadonlyArray<A>) => boolean
} = i => flow(has(i), Boolean.not)

/** Time complexity: O(1) */
export const lookup: {
  (i: number): <A>(array: ReadonlyArray<A>) => Option.Option<A>
} = i => array =>
  pipe(array, has(i)) ? pipe(array.at(i)!, Option.some) : Option.none()

/**
 * Time complexity: O(1).
 *
 * Like `lookup` but accepts also negative integers where -1 is index of the last element, -2 of the pre-last and so on.
 */
export const at: {
  (i: number): <A>(array: ReadonlyArray<A>) => Option.Option<A>
} = i => array =>
  i < length(array) && i >= -length(array)
    ? pipe(array.at(i)!, Option.some)
    : Option.none()

/** Time complexity: O(1) */
export const lastIndex: {
  (array: ReadonlyArray<unknown>): number
} = array => length(array) - 1

export const findMap: {
  <A, B>(
    aimb: (a: A, i: number) => Option.Option<B>,
  ): (array: ReadonlyArray<A>) => Option.Option<B>
} = aimb => array => {
  for (let i = 0; i < array.length; i++) {
    const a = array[i]!
    const mb = aimb(a, i)

    if (Option.isSome(mb)) {
      return mb
    }
  }

  return Option.none()
}

export const find: {
  <A, B extends A>(
    p: RefinementWithIndex<A, B, number>,
  ): (array: ReadonlyArray<A>) => Option.Option<B>
  <A>(
    p: PredicateWithIndex<A, number>,
  ): (array: ReadonlyArray<A>) => Option.Option<A>
} = <A>(p: PredicateWithIndex<A, number>) =>
  findMap<A, A>((a, i) =>
    pipe(
      p(a, i),
      Boolean.match({
        onFalse: Option.none,
        onTrue: () => Option.some(a),
      }),
    ),
  )

export const findIndex: {
  <A>(
    p: PredicateWithIndex<A, number>,
  ): (array: ReadonlyArray<A>) => Option.Option<number>
} = p => array =>
  pipe(
    array.findIndex((a, i) => p(a, i)),
    i => (i > -1 ? Option.some(i) : Option.none()),
  )

export const findLastMap: {
  <A, B>(
    aimb: (a: A, i: number) => Option.Option<B>,
  ): (array: ReadonlyArray<A>) => Option.Option<B>
} = aimb => array => {
  for (let i = lastIndex(array); i > 0; i--) {
    const a = array[i]!
    const mb = aimb(a, i)

    if (Option.isSome(mb)) {
      return mb
    }
  }

  return Option.none()
}

export const findLast: {
  <A, B extends A>(
    p: RefinementWithIndex<A, B, number>,
  ): (array: ReadonlyArray<A>) => Option.Option<B>
  <A>(
    p: PredicateWithIndex<A, number>,
  ): (array: ReadonlyArray<A>) => Option.Option<A>
} = <A>(p: PredicateWithIndex<A, number>) =>
  findLastMap<A, A>((a, i) =>
    pipe(
      p(a, i),
      Boolean.match({
        onFalse: Option.none,
        onTrue: () => Option.some(a),
      }),
    ),
  )

export const findLastIndex: {
  <A>(
    p: PredicateWithIndex<A, number>,
  ): (array: ReadonlyArray<A>) => Option.Option<number>
} = p => array =>
  pipe(
    array.findLastIndex((a, i) => p(a, i)),
    Number.matchNegative({
      onNegative: Option.none,
      onNonNegative: Option.some,
    }),
  )

/** Is `a` an element of array by `Equivalence` instance */
export const elem =
  <A>(Equivalence: Equivalence.Equivalence<A>) =>
  (a: A) =>
  (array: ReadonlyArray<A>): boolean =>
    pipe(array, find(Equivalence.equals(a)), Option.isSome)

export const every: {
  <A, B extends A>(
    p: RefinementWithIndex<A, B, number>,
  ): Refinement<ReadonlyArray<A>, ReadonlyArray<B>>
  <A>(p: PredicateWithIndex<A, number>): Predicate<ReadonlyArray<A>>
} =
  <A, B extends A>(p: RefinementWithIndex<A, B, number>) =>
  (array: ReadonlyArray<A>) =>
    array.every((a, i) => p(a, i))

export const exists =
  <A>(p: PredicateWithIndex<A, number>) =>
  (array: ReadonlyArray<A>): array is Array.NonEmpty<A> =>
    array.some((a, i) => p(a, i))

/** Alias for `exists` */
export const some = exists

export const includes: {
  <A>(a: A): (array: ReadonlyArray<A>) => boolean
} = a => array => array.includes(a)

export const failures: {
  <A, E>(array: ReadonlyArray<Result.Result<A, E>>): ReadonlyArray<E>
} = flatMap(Result.match({ onFailure: of, onSuccess: constEmptyArray }))

export const successes: {
  <A, E>(array: ReadonlyArray<Result.Result<A, E>>): ReadonlyArray<A>
} = flatMap(Result.match({ onFailure: constEmptyArray, onSuccess: of }))

/** Time complexity: O(n) */
export const concat =
  <F extends ReadonlyArray<any>>(end: F) =>
  <G extends ReadonlyArray<any>>(start: G): Array.OrNonEmpty<F, G> =>
    start.concat(end) as any

/** Time complexity: O(n) */
export const prepend: {
  <A>(a: A): (array: ReadonlyArray<A>) => Array.NonEmpty<A>
} = a => array => concat(array)([a] as const)

/** Time complexity: O(n) */
export const prependAllWith: {
  <A>(f: (a: A, i: number) => A): (array: ReadonlyArray<A>) => ReadonlyArray<A>
} = f => flatMap((a, i) => [f(a, i), a])

/** Time complexity: O(n) */
export const prependAll: {
  <A>(a: A): (array: ReadonlyArray<A>) => ReadonlyArray<A>
} = flow(constant, prependAllWith)

/** Time complexity: O(n) */
export const append: {
  <A>(a: A): (array: ReadonlyArray<A>) => Array.NonEmpty<A>
} = a => concat([a] as const)

/** Time complexity: O(n) */
export const appendAllWith: {
  <A>(f: (a: A, i: number) => A): (array: ReadonlyArray<A>) => ReadonlyArray<A>
} = f => flatMap((a, i) => [a, f(a, i)])

/** Time complexity: O(n) */
export const appendAll: {
  <A>(a: A): (array: ReadonlyArray<A>) => ReadonlyArray<A>
} = flow(constant, appendAllWith)

/** Time complexity: O(n) */
export const range: {
  (to: number): (from: number) => Array.NonEmpty<number>
} = to => from => {
  const out: [number, ...number[]] = [from]

  if (from < to) {
    for (let i = from + 1; i <= to; i++) {
      out.push(i)
    }
  }

  if (from > to) {
    for (let i = from - 1; i >= to; i--) {
      out.push(i)
    }
  }

  return out
}

/** Time complexity: O(n) */
export const reverse = <F extends ReadonlyArray<any>>(
  array: F,
): Array.With<F> => array.toReversed() as any

/** Time complexity: O(n log n) */
export const sort: {
  <B>(
    Order: Order.Order<B>,
  ): <A extends B, F extends ReadonlyArray<A>>(array: F) => Array.With<F, A>
} = Order => array => array.toSorted((x, y) => Order.compare(y)(x)) as any

/** Time complexity: O(n log n) */
export const sortBy: {
  <B>(
    orders: Iterable<Order.Order<B>>,
  ): <A extends B, F extends ReadonlyArray<A>>(array: F) => Array.With<F, A>
} = orders => array =>
  [...orders].reduce((out, Ord) => sort(Ord)(out) as any, array)

export const join: {
  (separator: string): (array: ReadonlyArray<string>) => string
} = separator => array => array.join(separator)

/** Time complexity: O(n) */
export const slice: {
  (
    start: number,
    end?: number,
  ): <A>(array: ReadonlyArray<A>) => ReadonlyArray<A>
} = (start, end) => array => array.slice(start, end)

export const takeLeftWhile: {
  <A>(
    p: PredicateWithIndex<A, number>,
  ): (array: ReadonlyArray<A>) => ReadonlyArray<A>
} = p => array =>
  pipe(
    array,
    findIndex(flow(p, Boolean.not)),
    Option.match({
      onNone: constant(array),
      onSome: i => slice(0, i)(array),
    }),
  )

export const takeLeft: {
  (n: number): <A>(array: ReadonlyArray<A>) => ReadonlyArray<A>
} = n => slice(0, Number.toNonNegative(n))

export const takeRightWhile: {
  <A>(
    p: PredicateWithIndex<A, number>,
  ): (array: ReadonlyArray<A>) => ReadonlyArray<A>
} = p => array =>
  pipe(
    array,
    findLastIndex(flow(p, Boolean.not)),
    Option.match({
      onNone: constant(array),
      onSome: i => slice(i - length(array) + 1)(array),
    }),
  )

export const takeRight: {
  (n: number): <A>(array: ReadonlyArray<A>) => ReadonlyArray<A>
} = Number.matchNonPositive({
  onNonPositive: () => constant([]),
  onPositive: n => slice(-n),
})

export const dropLeftWhile: {
  <A>(
    p: PredicateWithIndex<A, number>,
  ): (array: ReadonlyArray<A>) => ReadonlyArray<A>
} = p => array =>
  pipe(
    array,
    findIndex(flow(p, Boolean.not)),
    Option.match({
      onNone: constant([]),
      onSome: i => slice(i)(array),
    }),
  )

export const dropLeft: {
  (n: number): <A>(array: ReadonlyArray<A>) => ReadonlyArray<A>
} = n => array =>
  Number.matchNonPositive({
    onNonPositive: constant(array),
    onPositive: n => slice(n)(array),
  })(n)

export const dropRightWhile: {
  <A>(
    p: PredicateWithIndex<A, number>,
  ): (array: ReadonlyArray<A>) => ReadonlyArray<A>
} = p => array =>
  pipe(
    array,
    findLastIndex(flow(p, Boolean.not)),
    Option.match({
      onNone: constant([]),
      onSome: i => slice(0, i + 1)(array),
    }),
  )

export const dropRight: {
  (n: number): <A>(array: ReadonlyArray<A>) => ReadonlyArray<A>
} = n => array =>
  Number.matchNonPositive({
    onNonPositive: constant(array),
    onPositive: n => slice(0, -n)(array),
  })(n)

export const dropBothWhile: {
  <A>(
    p: PredicateWithIndex<A, number>,
  ): (array: ReadonlyArray<A>) => ReadonlyArray<A>
} = p => array =>
  slice(
    pipe(
      array,
      findIndex(flow(p, Boolean.not)),
      Option.getOrElse(constant(length(array))),
    ),
    pipe(
      array,
      findLastIndex(flow(p, Boolean.not)),
      Option.match({
        onNone: constant(0),
        onSome: Number.add(1),
      }),
    ),
  )(array)

export const dropBoth: {
  (n: number): <A>(array: ReadonlyArray<A>) => ReadonlyArray<A>
} = n => array =>
  Number.matchNonPositive({
    onNonPositive: constant(array),
    onPositive: n => slice(0, -n)(array),
  })(n)

export const chunksOf =
  (n: number) =>
  <A>(array: ReadonlyArray<A>): ReadonlyArray<Array.NonEmpty<A>> => {
    if (n <= 0 || isEmpty(array)) {
      return []
    }

    if (array.length <= n) {
      return [array] as [Array.NonEmpty<A>]
    }

    const out: [A[], ...A[][]] = [[]]

    for (const a of array) {
      let lastChunk = lastNonEmpty(out)

      if (lastChunk.length === n) {
        lastChunk = []
        out.push(lastChunk)
      }

      lastChunk.push(a)
    }

    return out as any
  }

export const insertAt: {
  <A>(
    i: number,
    a: A,
  ): (array: ReadonlyArray<A>) => Option.Option<Array.NonEmpty<A>>
} = (i, a) => array =>
  pipe(
    Option.Do,
    Option.tap(() =>
      pipe(
        array,
        lookup(i),
        Option.orElse(pipe(i === length(array), Option.some)),
      ),
    ),
    Option.bind('start', pipe(array, slice(0, i), Option.some)),
    Option.bind('end', pipe(array, slice(i), Option.some)),
    Option.map(({ start, end }) => pipe(start, append(a), concat(end))),
  )

export const modifyAt: {
  <A>(
    i: number,
    f: Endomorphism<A>,
  ): (array: ReadonlyArray<A>) => Option.Option<ReadonlyArray<A>>
} = (i, f) => array =>
  pipe(
    array,
    lookup(i),
    Option.map(x => {
      const clone = pipe(array, copy, toArray)
      clone[i] = f(x)
      return clone
    }),
  )

export const updateAt: {
  <A>(
    i: number,
    a: A,
  ): (array: ReadonlyArray<A>) => Option.Option<ReadonlyArray<A>>
} = (i, a) => modifyAt(i, constant(a))

export const removeAt: {
  <A>(i: number): (array: ReadonlyArray<A>) => Option.Option<ReadonlyArray<A>>
} = i => array =>
  pipe(
    Option.Do,
    Option.tap(() => pipe(array, lookup(i))),
    Option.bind('start', pipe(array, slice(0, i), Option.some)),
    Option.bind('end', pipe(array, slice(i + 2), Option.some)),
    Option.map(({ start, end }) => pipe(start, concat(end))),
  )

/** [f (a, b, ...) | a <- as, b <- bs, ..., p (a, b, ...)] */
export function comprehension<A, R>(
  input: readonly [ReadonlyArray<A>],
  f: (a: A) => R,
  p?: (a: A) => boolean,
): ReadonlyArray<R>
export function comprehension<A, B, R>(
  input: readonly [ReadonlyArray<A>, ReadonlyArray<B>],
  f: (a: A, b: B) => R,
  p?: (a: A, b: B) => boolean,
): ReadonlyArray<R>
export function comprehension<A, B, C, R>(
  input: readonly [ReadonlyArray<A>, ReadonlyArray<B>, ReadonlyArray<C>],
  f: (a: A, b: B, c: C) => R,
  p?: (a: A, b: B, c: C) => boolean,
): ReadonlyArray<R>
export function comprehension<A, B, C, D, R>(
  input: readonly [
    ReadonlyArray<A>,
    ReadonlyArray<B>,
    ReadonlyArray<C>,
    ReadonlyArray<D>,
  ],
  f: (a: A, b: B, c: C, d: D) => R,
  p?: (a: A, b: B, c: C, d: D) => boolean,
): ReadonlyArray<R>
export function comprehension(
  input: ReadonlyArray<ReadonlyArray<unknown>>,
  f: (a: unknown, b?: unknown, c?: unknown, d?: unknown) => unknown,
  p: (a: unknown, b?: unknown, c?: unknown, d?: unknown) => boolean = constant(
    true,
  ),
): ReadonlyArray<unknown> {
  const getArgs: {
    (
      args: ReadonlyArray<unknown>,
    ): (input: ReadonlyArray<ReadonlyArray<unknown>>) => ReadonlyArray<unknown>
  } = args => input =>
    isNonEmpty(input)
      ? pipe(
          input,
          headNonEmpty,
          flatMap(x => pipe(input, tailNonEmpty, getArgs(append(x)(args)))),
        )
      : [args]

  return pipe(
    input,
    getArgs([]),
    filterMap((args: readonly [unknown]) =>
      isNonEmpty(args)
        ? p(...args)
          ? pipe(f(...args), Option.some)
          : Option.none()
        : // If some of input arrays is empty, then whole result should be an empty array
          Option.none(),
    ),
  )
}

/** Time complexity: O(n) */
export const flatDeep: {
  (depth: 0): <A>(array: ReadonlyArray<A>) => ReadonlyArray<A>
  (depth: 1): <A>(array: ReadonlyArray<ReadonlyArray<A>>) => ReadonlyArray<A>
  (
    depth: 2,
  ): <A>(
    array: ReadonlyArray<ReadonlyArray<ReadonlyArray<A>>>,
  ) => ReadonlyArray<A>
  (
    depth: 3,
  ): <A>(
    array: ReadonlyArray<ReadonlyArray<ReadonlyArray<ReadonlyArray<A>>>>,
  ) => ReadonlyArray<A>
  (
    depth: 4,
  ): <A>(
    array: ReadonlyArray<
      ReadonlyArray<ReadonlyArray<ReadonlyArray<ReadonlyArray<A>>>>
    >,
  ) => ReadonlyArray<A>
  (
    depth: 5,
  ): <A>(
    array: ReadonlyArray<
      ReadonlyArray<
        ReadonlyArray<ReadonlyArray<ReadonlyArray<ReadonlyArray<A>>>>
      >
    >,
  ) => ReadonlyArray<A>
  (
    depth: 6,
  ): <A>(
    array: ReadonlyArray<
      ReadonlyArray<
        ReadonlyArray<
          ReadonlyArray<ReadonlyArray<ReadonlyArray<ReadonlyArray<A>>>>
        >
      >
    >,
  ) => ReadonlyArray<A>
  (
    depth: 7,
  ): <A>(
    array: ReadonlyArray<
      ReadonlyArray<
        ReadonlyArray<
          ReadonlyArray<
            ReadonlyArray<ReadonlyArray<ReadonlyArray<ReadonlyArray<A>>>>
          >
        >
      >
    >,
  ) => ReadonlyArray<A>
  (
    depth: 8,
  ): <A>(
    array: ReadonlyArray<
      ReadonlyArray<
        ReadonlyArray<
          ReadonlyArray<
            ReadonlyArray<
              ReadonlyArray<ReadonlyArray<ReadonlyArray<ReadonlyArray<A>>>>
            >
          >
        >
      >
    >,
  ) => ReadonlyArray<A>
  (
    depth: 9,
  ): <A>(
    array: ReadonlyArray<
      ReadonlyArray<
        ReadonlyArray<
          ReadonlyArray<
            ReadonlyArray<
              ReadonlyArray<
                ReadonlyArray<ReadonlyArray<ReadonlyArray<ReadonlyArray<A>>>>
              >
            >
          >
        >
      >
    >,
  ) => ReadonlyArray<A>
  (
    depth: number,
  ): <A>(array: ReadonlyArray<ReadonlyArray<unknown>>) => ReadonlyArray<A>
} =
  (depth: number) =>
  <A>(array: ReadonlyArray<unknown>) =>
    array.flat(depth) as unknown as ReadonlyArray<A>
