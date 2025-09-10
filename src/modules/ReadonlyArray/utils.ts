import * as nonEmptyReadonlyArray from "../NonEmptyReadonlyArray"
import * as option from "../Option"
import * as result from "../Result"
import * as boolean from "../Boolean"
import * as number from "../Number"
import * as eq from "../../typeclasses/Eq"
import * as ord from "../../typeclasses/Ord"
import * as identity from "../Identity"
import { Refinement, RefinementWithIndex } from "../Refinement"
import { Predicate, PredicateWithIndex } from "../Predicate"
import { flatMap } from "./monad"
import { filterMap } from "./filterable"
import { constant, constEmptyArray } from "../../utils/constant"
import { flow, pipe } from "../../utils/flow"
import { match, matchLeft, matchRight } from "./matchers"
import { isEmpty, isNonEmpty } from "./refinements"
import { of } from "./applicative"
import { map } from "./functor"
import { Endomorphism } from "../../typeclasses/Endomorphism"

export const fromNonEmpty: {
  <A>(as: nonEmptyReadonlyArray.NonEmptyReadonlyArray<A>): ReadonlyArray<A>
} = identity.identity

export const toArray = <A>(self: ReadonlyArray<A>): A[] => self as A[]

export const length: {
  <A>(self: ReadonlyArray<A>): number
} = self => self.length

export const copy: {
  <A>(self: ReadonlyArray<A>): ReadonlyArray<A>
} = self => [...self]

export const head: {
  <A>(self: ReadonlyArray<A>): option.Option<A>
} = match ({
  onEmpty: option.zero,
  onNonEmpty: flow (nonEmptyReadonlyArray.head, option.some),
})

export const init: {
  <A>(self: ReadonlyArray<A>): option.Option<ReadonlyArray<A>>
} = match ({
  onEmpty: option.zero,
  onNonEmpty: flow (nonEmptyReadonlyArray.init, option.some),
})

export const last: {
  <A>(self: ReadonlyArray<A>): option.Option<A>
} = match ({
  onEmpty: option.zero,
  onNonEmpty: flow (nonEmptyReadonlyArray.last, option.some),
})

export const tail: {
  <A>(self: ReadonlyArray<A>): option.Option<ReadonlyArray<A>>
} = match ({
  onEmpty: option.zero,
  onNonEmpty: flow (nonEmptyReadonlyArray.tail, option.some),
})

export const has: {
  <A>(i: number): Predicate<ReadonlyArray<A>>
} = i => self => Object.hasOwn (self, Number (i))

export const isOutOfBounds: {
  <A>(i: number): Predicate<ReadonlyArray<A>>
} = i => flow (has (i), boolean.not)

export const lookup: {
  <A>(i: number): (self: ReadonlyArray<A>) => option.Option<A>
} = i => self =>
  pipe (self, has (i)) ? pipe (self.at (i)!, option.some) : option.none

/** Like `lookup` but accepts also negative integers where -1 is index of the last element, -2 of the pre-last and so on. */
export const at: {
  <A>(i: number): (self: ReadonlyArray<A>) => option.Option<A>
} = i => self =>
  i < length (self) && i >= -length (self)
    ? pipe (self.at (i)!, option.some)
    : option.none

export const lastIndex: {
  <A>(self: ReadonlyArray<A>): number
} = self => length (self) - 1

export const findMap: {
  <A, B>(
    iamb: (a: A, i: number) => option.Option<B>,
  ): (self: ReadonlyArray<A>) => option.Option<B>
} = iamb => {
  const f: {
    (index: number): typeof findMap
  } = i => iamb =>
    matchLeft ({
      onEmpty: option.zero,
      onNonEmpty: (head, tail) =>
        pipe (
          head,
          a => iamb (a, i),
          option.match ({
            onNone: () => f (i + 1) (iamb) (tail),
            onSome: option.some,
          }),
        ),
    })

  return f (0) (iamb)
}

export const find: {
  <A, B extends A>(
    p: RefinementWithIndex<A, B, number>,
  ): (self: ReadonlyArray<A>) => option.Option<B>
  <A>(
    p: PredicateWithIndex<A, number>,
  ): (self: ReadonlyArray<A>) => option.Option<A>
} = <A>(p: PredicateWithIndex<A, number>) =>
  findMap<A, A> ((a, i) =>
    pipe (
      p (a, i),
      boolean.match ({
        onFalse: option.zero,
        onTrue: () => option.some (a),
      }),
    ),
  )

export const findIndex: {
  <A>(
    p: PredicateWithIndex<A, number>,
  ): (self: ReadonlyArray<A>) => option.Option<number>
} = p => self =>
  pipe (
    self.findIndex ((a, i) => p (a, i)),
    i => i > -1 ? option.some (i) : option.none,
  )

export const findLastMap: {
  <A, B>(
    iamb: (a: A, i: number) => option.Option<B>,
  ): (self: ReadonlyArray<A>) => option.Option<B>
} = iamb => self => {
  const f: {
    (index: number): typeof findLastMap
  } = i => iamb =>
    matchRight ({
      onEmpty: option.zero,
      onNonEmpty: (init, last) =>
        pipe (
          last,
          a => iamb (a, i),
          option.match ({
            onNone: () => f (i - 1) (iamb) (init),
            onSome: option.some,
          }),
        ),
    })

  return f (lastIndex (self)) (iamb) (self)
}

export const findLast: {
  <A, B extends A>(
    p: RefinementWithIndex<A, B, number>,
  ): (self: ReadonlyArray<A>) => option.Option<B>
  <A>(
    p: PredicateWithIndex<A, number>,
  ): (self: ReadonlyArray<A>) => option.Option<A>
} = <A>(p: PredicateWithIndex<A, number>) =>
  findLastMap<A, A> ((a, i) =>
    pipe (
      p (a, i),
      boolean.match ({
        onFalse: option.zero,
        onTrue: () => option.some (a),
      }),
    ),
  )

export const findLastIndex: {
  <A>(
    p: PredicateWithIndex<A, number>,
  ): (self: ReadonlyArray<A>) => option.Option<number>
} = p => self =>
  pipe (
    self.findLastIndex ((a, i) => p (a, i)),
    number.matchNegative ({
      onNegative: option.zero,
      onNonNegative: option.some,
    }),
  )

/** Is `a` element of an array by `Eq` instance */
export const elem =
  <A>(
    Eq: eq.Eq<A>,
  ): {
    (a: A): (self: ReadonlyArray<A>) => boolean
  } =>
  a =>
    flow (find (Eq.equals (a)), option.isSome)

export const every: {
  <A, B extends A>(
    p: RefinementWithIndex<A, B, number>,
  ): Refinement<ReadonlyArray<A>, ReadonlyArray<B>>
  <A>(p: PredicateWithIndex<A, number>): Predicate<ReadonlyArray<A>>
} =
  <A, B extends A>(p: RefinementWithIndex<A, B, number>) =>
  (self: ReadonlyArray<A>) =>
    self.every ((a, i) => p (a, i))

export const exists =
  <A>(p: PredicateWithIndex<A, number>) =>
  (
    self: ReadonlyArray<A>,
  ): self is nonEmptyReadonlyArray.NonEmptyReadonlyArray<A> =>
    self.some ((a, i) => p (a, i))

/** Alias for `exists` */
export const some = exists

export const includes: {
  <A>(a: A): (self: ReadonlyArray<A>) => boolean
} = a => self => self.includes (a)

export const failures: {
  <E, A>(self: ReadonlyArray<result.Result<E, A>>): ReadonlyArray<E>
} = flatMap (result.match ({ onFailure: of, onSuccess: constEmptyArray }))

export const successes: {
  <E, A>(self: ReadonlyArray<result.Result<E, A>>): ReadonlyArray<A>
} = flatMap (result.match ({ onFailure: constEmptyArray, onSuccess: of }))

export const concat: {
  <A>(end: ReadonlyArray<A>): (start: ReadonlyArray<A>) => ReadonlyArray<A>
} = nonEmptyReadonlyArray.concat

export const prepend: {
  <A>(
    a: A,
  ): (self: ReadonlyArray<A>) => nonEmptyReadonlyArray.NonEmptyReadonlyArray<A>
} = a => self => nonEmptyReadonlyArray.concat (self) ([a])

export const prependAllWith: {
  <A>(f: (a: A, i: number) => A): (self: ReadonlyArray<A>) => ReadonlyArray<A>
} = f => flatMap ((a, i) => [f (a, i), a])

export const prependAll: {
  <A>(a: A): (self: ReadonlyArray<A>) => ReadonlyArray<A>
} = flow (constant, prependAllWith)

export const append: {
  <A>(
    a: A,
  ): (self: ReadonlyArray<A>) => nonEmptyReadonlyArray.NonEmptyReadonlyArray<A>
} = a => nonEmptyReadonlyArray.concat ([a])

export const appendAllWith: {
  <A>(f: (a: A, i: number) => A): (self: ReadonlyArray<A>) => ReadonlyArray<A>
} = f => flatMap ((a, i) => [a, f (a, i)])

export const appendAll: {
  <A>(a: A): (self: ReadonlyArray<A>) => ReadonlyArray<A>
} = flow (constant, appendAllWith)

export const range: {
  (
    to: number,
  ): (from: number) => nonEmptyReadonlyArray.NonEmptyReadonlyArray<number>
} = to => from =>
  from === to
    ? [from]
    : from < to
      ? pipe (from + 1, range (to), prepend (from))
      : pipe (from - 1, range (to), prepend (from))

export const reverse: {
  <A>(self: ReadonlyArray<A>): ReadonlyArray<A>
} = nonEmptyReadonlyArray.reverse

export const sort: {
  <B>(
    Ord: ord.Ord<B>,
  ): <A extends B>(self: ReadonlyArray<A>) => ReadonlyArray<A>
} = nonEmptyReadonlyArray.sort

export const sortBy: {
  <B>(
    ords: ReadonlyArray<ord.Ord<B>>,
  ): <A extends B>(self: ReadonlyArray<A>) => ReadonlyArray<A>
} = nonEmptyReadonlyArray.sortBy

export const join: {
  (separator: string): (self: ReadonlyArray<string>) => string
} = separator => self => self.join (separator)

export const slice: {
  (start: number, end?: number): <A>(self: ReadonlyArray<A>) => ReadonlyArray<A>
} = (start, end) => self => self.slice (start, end)

export const zipWith: {
  <A, B, C>(
    bs: ReadonlyArray<B>,
    abic: (a: A, b: B, i: number) => C,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<C>
} = (bs, abc) => self =>
  pipe (
    length (bs) > length (self),
    boolean.match ({
      onFalse: () =>
        pipe (
          bs,
          map ((b, i) => abc (self.at (i)!, b, i)),
        ),
      onTrue: () =>
        pipe (
          self,
          map ((a, i) => abc (a, bs.at (i)!, i)),
        ),
    }),
  )

export const zip: {
  <B>(
    as: ReadonlyArray<B>,
  ): <A>(self: ReadonlyArray<A>) => ReadonlyArray<readonly [A, B]>
} = as => zipWith (as, (b, a) => [b, a])

export const takeLeftWhile: {
  <A>(
    p: PredicateWithIndex<A, number>,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<A>
} = p => self =>
  pipe (
    self,
    findIndex (flow (p, boolean.not)),
    option.match ({
      onNone: constant (self),
      onSome: i => slice (0, i) (self),
    }),
  )

export const takeLeft: {
  (n: number): <A>(self: ReadonlyArray<A>) => ReadonlyArray<A>
} = n => slice (0, number.toNonNegative (n))

export const takeRightWhile: {
  <A>(
    p: PredicateWithIndex<A, number>,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<A>
} = p => self =>
  pipe (
    self,
    findLastIndex (flow (p, boolean.not)),
    option.match ({
      onNone: constant (self),
      onSome: i => slice (i - length (self) + 1) (self),
    }),
  )

export const takeRight: {
  (n: number): <A>(self: ReadonlyArray<A>) => ReadonlyArray<A>
} = number.matchNonPositive ({
  onNonPositive: () => constant ([]),
  onPositive: n => slice (-n),
})

export const dropLeftWhile: {
  <A>(
    p: PredicateWithIndex<A, number>,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<A>
} = p => self =>
  pipe (
    self,
    findIndex (flow (p, boolean.not)),
    option.match ({
      onNone: constant ([]),
      onSome: i => slice (i) (self),
    }),
  )

export const dropLeft: {
  (n: number): <A>(self: ReadonlyArray<A>) => ReadonlyArray<A>
} = n => self =>
  number.matchNonPositive ({
    onNonPositive: constant (self),
    onPositive: n => slice (n) (self),
  }) (n)

export const dropRightWhile: {
  <A>(
    p: PredicateWithIndex<A, number>,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<A>
} = p => self =>
  pipe (
    self,
    findLastIndex (flow (p, boolean.not)),
    option.match ({
      onNone: constant ([]),
      onSome: i => slice (0, i + 1) (self),
    }),
  )

export const dropRight: {
  (n: number): <A>(self: ReadonlyArray<A>) => ReadonlyArray<A>
} = n => self =>
  number.matchNonPositive ({
    onNonPositive: constant (self),
    onPositive: n => slice (0, -n) (self),
  }) (n)

export const dropBothWhile: {
  <A>(
    p: PredicateWithIndex<A, number>,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<A>
} = p => self =>
  slice (
    pipe (
      self,
      findIndex (flow (p, boolean.not)),
      option.getOrElse (constant (length (self))),
    ),
    pipe (
      self,
      findLastIndex (flow (p, boolean.not)),
      option.match ({
        onNone: constant (0),
        onSome: number.add (1),
      }),
    ),
  ) (self)

export const dropBoth: {
  (n: number): <A>(self: ReadonlyArray<A>) => ReadonlyArray<A>
} = n => self =>
  number.matchNonPositive ({
    onNonPositive: constant (self),
    onPositive: n => slice (0, -n) (self),
  }) (n)

export const chunksOf: {
  (
    n: number,
  ): <A>(
    self: ReadonlyArray<A>,
  ) => ReadonlyArray<nonEmptyReadonlyArray.NonEmptyReadonlyArray<A>>
} = n => self =>
  pipe (
    n,
    number.lessThanOrEquals (0),
    boolean.or (isEmpty (self)),
    boolean.match ({
      onFalse: () =>
        pipe (
          self,
          length,
          number.moreThan (n),
          boolean.match ({
            onFalse: constant ([self]),
            onTrue: () => [slice (0, n) (self), ...chunksOf (n) (slice (n) (self))],
          }),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) as ReadonlyArray<any>,
      onTrue: constant ([]),
    }),
  )

export const insertAt: {
  <A>(
    i: number,
    a: A,
  ): (
    self: ReadonlyArray<A>,
  ) => option.Option<nonEmptyReadonlyArray.NonEmptyReadonlyArray<A>>
} = (i, a) => self =>
  pipe (
    option.Do,
    option.tap (() =>
      pipe (
        self,
        lookup (i),
        option.orElse (pipe (i === length (self), option.some)),
      ),
    ),
    option.apS ("start", pipe (self, slice (0, i), option.some)),
    option.apS ("end", pipe (self, slice (i), option.some)),
    option.map (({ start, end }) =>
      pipe (start, append (a), nonEmptyReadonlyArray.concat (end)),
    ),
  )

export const modifyAt: {
  <A>(
    i: number,
    f: Endomorphism<A>,
  ): (self: ReadonlyArray<A>) => option.Option<ReadonlyArray<A>>
} = (i, f) => self =>
  pipe (
    option.Do,
    option.apS ("a", pipe (self, lookup (i))),
    option.apS ("start", pipe (self, slice (0, i), option.some)),
    option.apS ("end", pipe (self, slice (i + 1), option.some)),
    option.map (({ start, a, end }) => pipe (start, append (f (a)), concat (end))),
  )

export const updateAt: {
  <A>(
    i: number,
    a: A,
  ): (self: ReadonlyArray<A>) => option.Option<ReadonlyArray<A>>
} = (i, a) => modifyAt (i, constant (a))

export const removeAt: {
  <A>(i: number): (self: ReadonlyArray<A>) => option.Option<ReadonlyArray<A>>
} = i => self =>
  pipe (
    option.Do,
    option.tap (() => pipe (self, lookup (i))),
    option.apS ("start", pipe (self, slice (0, i), option.some)),
    option.apS ("end", pipe (self, slice (i + 2), option.some)),
    option.map (({ start, end }) => pipe (start, concat (end))),
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
  p: (a: unknown, b?: unknown, c?: unknown, d?: unknown) => boolean = constant (
    true,
  ),
): ReadonlyArray<unknown> {
  const getArgs: {
    (
      args: ReadonlyArray<unknown>,
    ): (input: ReadonlyArray<ReadonlyArray<unknown>>) => ReadonlyArray<unknown>
  } = args => input =>
    isNonEmpty (input)
      ? pipe (
          input,
          nonEmptyReadonlyArray.head,
          flatMap (x =>
            pipe (input, nonEmptyReadonlyArray.tail, getArgs (append (x) (args))),
          ),
        )
      : [args]

  return pipe (
    input,
    getArgs ([]),
    filterMap ((args: readonly [unknown]) =>
      isNonEmpty (args)
        ? p (...args)
          ? pipe (f (...args), option.some)
          : option.none
        : // If some of input arrays is empty, then whole result should be an empty array
          option.none,
    ),
  )
}
