import * as NonEmptyArray from '../NonEmptyReadonlyArray'
import * as Option from '../Option'
import * as Result from '../Result'
import * as Boolean from '../Boolean'
import * as Number from '../Number'
import * as Equivalence from '../../typeclasses/Equivalence'
import * as Order from '../../typeclasses/Order'
import { identity } from '../Identity'
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

export const fromNonEmpty: {
  <A>(as: NonEmptyArray.NonEmptyReadonlyArray<A>): ReadonlyArray<A>
} = identity

export const toArray = <A>(self: ReadonlyArray<A>): A[] => self as A[]

export const fromIterable: {
  <A>(as: Iterable<A>): ReadonlyArray<A>
} = as => [...as]

export const length: {
  (self: ReadonlyArray<unknown>): number
} = self => self.length

export const copy: {
  <A>(self: ReadonlyArray<A>): ReadonlyArray<A>
} = fromIterable

export const head: {
  <A>(self: ReadonlyArray<A>): Option.Option<A>
} = match({
  onEmpty: Option.none,
  onNonEmpty: flow(NonEmptyArray.head, Option.some),
})

export const init: {
  <A>(self: ReadonlyArray<A>): Option.Option<ReadonlyArray<A>>
} = match({
  onEmpty: Option.none,
  onNonEmpty: flow(NonEmptyArray.init, Option.some),
})

export const last: {
  <A>(self: ReadonlyArray<A>): Option.Option<A>
} = match({
  onEmpty: Option.none,
  onNonEmpty: flow(NonEmptyArray.last, Option.some),
})

export const tail: {
  <A>(self: ReadonlyArray<A>): Option.Option<ReadonlyArray<A>>
} = match({
  onEmpty: Option.none,
  onNonEmpty: flow(NonEmptyArray.tail, Option.some),
})

export const has: {
  <A>(i: number): Predicate<ReadonlyArray<A>>
} = i => self => Object.hasOwn(self, Number.Number(i))

export const isOutOfBounds: {
  <A>(i: number): Predicate<ReadonlyArray<A>>
} = i => flow(has(i), Boolean.not)

export const lookup: {
  <A>(i: number): (self: ReadonlyArray<A>) => Option.Option<A>
} = i => self =>
  pipe(self, has(i)) ? pipe(self.at(i)!, Option.some) : Option.none()

/** Like `lookup` but accepts also negative integers where -1 is index of the last element, -2 of the pre-last and so on. */
export const at: {
  <A>(i: number): (self: ReadonlyArray<A>) => Option.Option<A>
} = i => self =>
  i < length(self) && i >= -length(self)
    ? pipe(self.at(i)!, Option.some)
    : Option.none()

export const lastIndex: {
  (self: ReadonlyArray<unknown>): number
} = self => length(self) - 1

export const findMap: {
  <A, B>(
    aimb: (a: A, i: number) => Option.Option<B>,
  ): (self: ReadonlyArray<A>) => Option.Option<B>
} = aimb => self => {
  for (let i = 0; i < self.length; i++) {
    const a = self[i]!
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
  ): (self: ReadonlyArray<A>) => Option.Option<B>
  <A>(
    p: PredicateWithIndex<A, number>,
  ): (self: ReadonlyArray<A>) => Option.Option<A>
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
  ): (self: ReadonlyArray<A>) => Option.Option<number>
} = p => self =>
  pipe(
    self.findIndex((a, i) => p(a, i)),
    i => (i > -1 ? Option.some(i) : Option.none()),
  )

export const findLastMap: {
  <A, B>(
    aimb: (a: A, i: number) => Option.Option<B>,
  ): (self: ReadonlyArray<A>) => Option.Option<B>
} = aimb => self => {
  for (let i = lastIndex(self); i > 0; i--) {
    const a = self[i]!
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
  ): (self: ReadonlyArray<A>) => Option.Option<B>
  <A>(
    p: PredicateWithIndex<A, number>,
  ): (self: ReadonlyArray<A>) => Option.Option<A>
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
  ): (self: ReadonlyArray<A>) => Option.Option<number>
} = p => self =>
  pipe(
    self.findLastIndex((a, i) => p(a, i)),
    Number.matchNegative({
      onNegative: Option.none,
      onNonNegative: Option.some,
    }),
  )

/** Is `a` an element of array by `Equivalence` instance */
export const elem =
  <A>(Equivalence: Equivalence.Equivalence<A>) =>
  (a: A) =>
  (self: ReadonlyArray<A>): boolean =>
    pipe(self, find(Equivalence.equals(a)), Option.isSome)

export const every: {
  <A, B extends A>(
    p: RefinementWithIndex<A, B, number>,
  ): Refinement<ReadonlyArray<A>, ReadonlyArray<B>>
  <A>(p: PredicateWithIndex<A, number>): Predicate<ReadonlyArray<A>>
} =
  <A, B extends A>(p: RefinementWithIndex<A, B, number>) =>
  (self: ReadonlyArray<A>) =>
    self.every((a, i) => p(a, i))

export const exists =
  <A>(p: PredicateWithIndex<A, number>) =>
  (self: ReadonlyArray<A>): self is NonEmptyArray.NonEmptyReadonlyArray<A> =>
    self.some((a, i) => p(a, i))

/** Alias for `exists` */
export const some = exists

export const includes: {
  <A>(a: A): (self: ReadonlyArray<A>) => boolean
} = a => self => self.includes(a)

export const failures: {
  <A, E>(self: ReadonlyArray<Result.Result<A, E>>): ReadonlyArray<E>
} = flatMap(Result.match({ onFailure: of, onSuccess: constEmptyArray }))

export const successes: {
  <A, E>(self: ReadonlyArray<Result.Result<A, E>>): ReadonlyArray<A>
} = flatMap(Result.match({ onFailure: constEmptyArray, onSuccess: of }))

export const concat: {
  <A>(end: ReadonlyArray<A>): (start: ReadonlyArray<A>) => ReadonlyArray<A>
} = NonEmptyArray.concat

export const prepend: {
  <A>(a: A): (self: ReadonlyArray<A>) => NonEmptyArray.NonEmptyReadonlyArray<A>
} = a => self => NonEmptyArray.concat(self)([a])

export const prependAllWith: {
  <A>(f: (a: A, i: number) => A): (self: ReadonlyArray<A>) => ReadonlyArray<A>
} = f => flatMap((a, i) => [f(a, i), a])

export const prependAll: {
  <A>(a: A): (self: ReadonlyArray<A>) => ReadonlyArray<A>
} = flow(constant, prependAllWith)

export const append: {
  <A>(a: A): (self: ReadonlyArray<A>) => NonEmptyArray.NonEmptyReadonlyArray<A>
} = a => NonEmptyArray.concat([a])

export const appendAllWith: {
  <A>(f: (a: A, i: number) => A): (self: ReadonlyArray<A>) => ReadonlyArray<A>
} = f => flatMap((a, i) => [a, f(a, i)])

export const appendAll: {
  <A>(a: A): (self: ReadonlyArray<A>) => ReadonlyArray<A>
} = flow(constant, appendAllWith)

export const range: {
  (to: number): (from: number) => NonEmptyArray.NonEmptyReadonlyArray<number>
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

export const reverse: {
  <A>(self: ReadonlyArray<A>): ReadonlyArray<A>
} = NonEmptyArray.reverse

export const sort: {
  <B>(
    Order: Order.Order<B>,
  ): <A extends B>(self: ReadonlyArray<A>) => ReadonlyArray<A>
} = NonEmptyArray.sort

export const sortBy: {
  <B>(
    orders: Iterable<Order.Order<B>>,
  ): <A extends B>(self: ReadonlyArray<A>) => ReadonlyArray<A>
} = NonEmptyArray.sortBy

export const join: {
  (separator: string): (self: ReadonlyArray<string>) => string
} = separator => self => self.join(separator)

export const slice: {
  (start: number, end?: number): <A>(self: ReadonlyArray<A>) => ReadonlyArray<A>
} = (start, end) => self => self.slice(start, end)

export const takeLeftWhile: {
  <A>(
    p: PredicateWithIndex<A, number>,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<A>
} = p => self =>
  pipe(
    self,
    findIndex(flow(p, Boolean.not)),
    Option.match({
      onNone: constant(self),
      onSome: i => slice(0, i)(self),
    }),
  )

export const takeLeft: {
  (n: number): <A>(self: ReadonlyArray<A>) => ReadonlyArray<A>
} = n => slice(0, Number.toNonNegative(n))

export const takeRightWhile: {
  <A>(
    p: PredicateWithIndex<A, number>,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<A>
} = p => self =>
  pipe(
    self,
    findLastIndex(flow(p, Boolean.not)),
    Option.match({
      onNone: constant(self),
      onSome: i => slice(i - length(self) + 1)(self),
    }),
  )

export const takeRight: {
  (n: number): <A>(self: ReadonlyArray<A>) => ReadonlyArray<A>
} = Number.matchNonPositive({
  onNonPositive: () => constant([]),
  onPositive: n => slice(-n),
})

export const dropLeftWhile: {
  <A>(
    p: PredicateWithIndex<A, number>,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<A>
} = p => self =>
  pipe(
    self,
    findIndex(flow(p, Boolean.not)),
    Option.match({
      onNone: constant([]),
      onSome: i => slice(i)(self),
    }),
  )

export const dropLeft: {
  (n: number): <A>(self: ReadonlyArray<A>) => ReadonlyArray<A>
} = n => self =>
  Number.matchNonPositive({
    onNonPositive: constant(self),
    onPositive: n => slice(n)(self),
  })(n)

export const dropRightWhile: {
  <A>(
    p: PredicateWithIndex<A, number>,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<A>
} = p => self =>
  pipe(
    self,
    findLastIndex(flow(p, Boolean.not)),
    Option.match({
      onNone: constant([]),
      onSome: i => slice(0, i + 1)(self),
    }),
  )

export const dropRight: {
  (n: number): <A>(self: ReadonlyArray<A>) => ReadonlyArray<A>
} = n => self =>
  Number.matchNonPositive({
    onNonPositive: constant(self),
    onPositive: n => slice(0, -n)(self),
  })(n)

export const dropBothWhile: {
  <A>(
    p: PredicateWithIndex<A, number>,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<A>
} = p => self =>
  slice(
    pipe(
      self,
      findIndex(flow(p, Boolean.not)),
      Option.getOrElse(constant(length(self))),
    ),
    pipe(
      self,
      findLastIndex(flow(p, Boolean.not)),
      Option.match({
        onNone: constant(0),
        onSome: Number.add(1),
      }),
    ),
  )(self)

export const dropBoth: {
  (n: number): <A>(self: ReadonlyArray<A>) => ReadonlyArray<A>
} = n => self =>
  Number.matchNonPositive({
    onNonPositive: constant(self),
    onPositive: n => slice(0, -n)(self),
  })(n)

export const chunksOf =
  (n: number) =>
  <A>(
    self: ReadonlyArray<A>,
  ): ReadonlyArray<NonEmptyArray.NonEmptyReadonlyArray<A>> => {
    if (n <= 0 || isEmpty(self)) {
      return []
    }

    if (self.length <= n) {
      return [self] as [NonEmptyArray.NonEmptyReadonlyArray<A>]
    }

    const out: [A[], ...A[][]] = [[]]

    for (const a of self) {
      let lastChunk = NonEmptyArray.last(out)

      if (lastChunk.length === n) {
        lastChunk = []
        out.push(lastChunk)
      }

      lastChunk.push(a)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return out as any
  }

export const insertAt: {
  <A>(
    i: number,
    a: A,
  ): (
    self: ReadonlyArray<A>,
  ) => Option.Option<NonEmptyArray.NonEmptyReadonlyArray<A>>
} = (i, a) => self =>
  pipe(
    Option.Do,
    Option.tap(() =>
      pipe(
        self,
        lookup(i),
        Option.orElse(pipe(i === length(self), Option.some)),
      ),
    ),
    Option.bind('start', pipe(self, slice(0, i), Option.some)),
    Option.bind('end', pipe(self, slice(i), Option.some)),
    Option.map(({ start, end }) =>
      pipe(start, append(a), NonEmptyArray.concat(end)),
    ),
  )

export const modifyAt: {
  <A>(
    i: number,
    f: Endomorphism<A>,
  ): (self: ReadonlyArray<A>) => Option.Option<ReadonlyArray<A>>
} = (i, f) => self =>
  pipe(
    self,
    lookup(i),
    Option.map(x => {
      const clone = pipe(self, copy, toArray)
      clone[i] = f(x)
      return clone
    }),
  )

export const updateAt: {
  <A>(
    i: number,
    a: A,
  ): (self: ReadonlyArray<A>) => Option.Option<ReadonlyArray<A>>
} = (i, a) => modifyAt(i, constant(a))

export const removeAt: {
  <A>(i: number): (self: ReadonlyArray<A>) => Option.Option<ReadonlyArray<A>>
} = i => self =>
  pipe(
    Option.Do,
    Option.tap(() => pipe(self, lookup(i))),
    Option.bind('start', pipe(self, slice(0, i), Option.some)),
    Option.bind('end', pipe(self, slice(i + 2), Option.some)),
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
          NonEmptyArray.head,
          flatMap(x =>
            pipe(input, NonEmptyArray.tail, getArgs(append(x)(args))),
          ),
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
