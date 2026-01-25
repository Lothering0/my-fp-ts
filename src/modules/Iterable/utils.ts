import * as Option from '../Option'
import * as Iterable from './iterable'
import { NonEmpty as ArrayNonEmpty } from '../ReadonlyArray'
import { Equivalence } from '../../typeclasses/Equivalence'
import { Predicate, PredicateWithIndex } from '../Predicate'
import { Refinement, RefinementWithIndex } from '../Refinement'
import { pipe } from '../../utils/flow'
import { maybeNonEmpty } from './_internal'

/**
 * | Case      | Time complexity |
 * | --------- | --------------- |
 * | Array     | O(1)            |
 * | Non-array | O(n)            |
 */
export const toReadonlyArray: {
  <A>(iterable: Iterable.NonEmpty<A>): ArrayNonEmpty<A>
  <A>(iterable: Iterable<A>): ReadonlyArray<A>
} = <A>(iterable: Iterable.NonEmpty<A>): ArrayNonEmpty<A> =>
  (Array.isArray(iterable)
    ? iterable
    : [...iterable]) as unknown as ArrayNonEmpty<A>

export const toEntries = <F extends Iterable<any>>(
  iterable: F,
): Iterable.With<F, readonly [number, Iterable.Infer<F>]> =>
  maybeNonEmpty({
    *[Symbol.iterator]() {
      let i = -1
      for (const a of iterable) {
        i++
        yield [i, a]
      }
    },
  })

export const zero: {
  <A>(): Iterable<A>
} = () => ({
  *[Symbol.iterator]() {},
})

/**
 * | Case      | Time complexity |
 * | --------- | --------------- |
 * | Array     | O(1)            |
 * | Non-array | O(n)            |
 */
export const length: {
  (iterable: Iterable<unknown>): number
} = iterable => {
  if (Array.isArray(iterable)) {
    return iterable.length
  }
  let i = 0
  for (const _ of iterable) {
    i++
  }
  return i
}

/**
 * | Case      | Time complexity |
 * | --------- | --------------- |
 * | Array     | O(1)            |
 * | Non-array | O(n)            |
 */
export const lastIndex: {
  (self: Iterable<unknown>): number
} = self => length(self) - 1

/** Time complexity: O(n) */
export const has: {
  (i: number): <A>(iterable: Iterable<A>) => boolean
} = i => iterable => {
  if (i < 0) {
    return false
  }
  let index = 0
  for (const _ of iterable) {
    if (i === index) {
      return true
    }
    index++
  }
  return false
}

/** Time complexity: O(n) */
export const isOutOfBounds: {
  (i: number): <A>(iterable: Iterable<A>) => boolean
} = i => iterable => !has(i)(iterable)

/** Time complexity: O(1) */
export const prepend: {
  <A>(a: A): (iterable: Iterable<A>) => Iterable.NonEmpty<A>
} = a => iterable =>
  maybeNonEmpty({
    *[Symbol.iterator]() {
      yield a
      yield* iterable
    },
  })

/** Time complexity: O(1) */
export const append: {
  <A>(a: A): (iterable: Iterable<A>) => Iterable.NonEmpty<A>
} = a => iterable =>
  maybeNonEmpty({
    *[Symbol.iterator]() {
      yield* iterable
      yield a
    },
  })

/** Time complexity: O(1) */
export const concat =
  <F extends Iterable<any>>(end: F) =>
  <G extends Iterable<any>>(start: G): Iterable.OrNonEmpty<F, G> =>
    maybeNonEmpty({
      *[Symbol.iterator]() {
        yield* start
        yield* end
      },
    })

/** Time complexity: O(1) */
export const head: {
  <A>(self: Iterable<A>): Option.Option<A>
} = self => {
  for (const a of self) {
    return Option.some(a)
  }
  return Option.none()
}

/** Time complexity: O(1) */
export const headNonEmpty = <A>(iterable: Iterable.NonEmpty<A>): A =>
  iterable[Symbol.iterator]().next().value

/**
 * Time complexity: O(n).
 *
 * Notice: it always executes one extra iteration
 */
export const init = <A>(iterable: Iterable<A>): Option.Option<Iterable<A>> => {
  const iterator = iterable[Symbol.iterator]()
  const iteration = iterator.next()
  if (iteration.done) {
    return Option.none()
  }
  let isDone = false
  const out = {
    *[Symbol.iterator]() {
      let previousValue = iteration.value
      while (!isDone) {
        const { done, value } = iterator.next()
        if (!done) {
          yield previousValue
        }
        previousValue = value
        isDone = Boolean(done)
      }
    },
  }
  return pipe(out, maybeNonEmpty, Option.some)
}

/**
 * Time complexity: O(n).
 *
 * Notice: it always executes one extra iteration
 */
export const initNonEmpty = <A>(
  iterable: Iterable.NonEmpty<A>,
): Iterable<A> => {
  const iterator = iterable[Symbol.iterator]()
  const iteration = iterator.next()
  let isDone = false
  return maybeNonEmpty({
    *[Symbol.iterator]() {
      let previousValue = iteration.value
      while (!isDone) {
        const { done, value } = iterator.next()
        if (!done) {
          yield previousValue
        }
        previousValue = value
        isDone = Boolean(done)
      }
    },
  })
}

/**
 * Time complexity: O(n).
 *
 * Notice: it always executes the whole iterable to reach the last element
 */
export const last: {
  <A>(self: Iterable<A>): Option.Option<A>
} = self => {
  let iterationStarted = false
  let lastElement
  for (const a of self) {
    iterationStarted = true
    lastElement = a
  }
  return iterationStarted ? Option.some(lastElement!) : Option.none()
}

/**
 * Time complexity: O(n).
 *
 * Notice: it always executes the whole iterable to reach the last element
 */
export const lastNonEmpty: {
  <A>(iterable: Iterable.NonEmpty<A>): A
} = iterable => {
  let lastElement
  for (const a of iterable) {
    lastElement = a
  }
  return lastElement!
}

/**
 * Time complexity: O(n).
 *
 * Notice: it always executes one extra iteration
 */
export const tail = <A>(iterable: Iterable<A>): Option.Option<Iterable<A>> => {
  const iterator = iterable[Symbol.iterator]()
  const { done } = iterator.next()
  if (done) {
    return Option.none()
  }
  let isDone = false
  const out = {
    *[Symbol.iterator]() {
      while (!isDone) {
        const { done, value } = iterator.next()
        isDone = Boolean(done)
        if (!isDone) {
          yield value
        }
      }
    },
  }
  return pipe(out, maybeNonEmpty, Option.some)
}

/**
 * Time complexity: O(n).
 *
 * Notice: it always executes one extra iteration
 */
export const tailNonEmpty = <A>(iterable: Iterable.NonEmpty<A>): Iterable<A> =>
  maybeNonEmpty({
    *[Symbol.iterator]() {
      let isFirstSkipped = false
      for (const a of iterable) {
        if (!isFirstSkipped) {
          isFirstSkipped = true
          continue
        }
        yield a
      }
    },
  })

/**
 * | Case      | Time complexity |
 * | --------- | --------------- |
 * | Array     | O(1)            |
 * | Non-array | O(n)            |
 */
export const lookup: {
  (i: number): <A>(iterable: Iterable<A>) => Option.Option<A>
} = i => iterable => {
  if (i < 0) {
    return Option.none()
  }
  if (Array.isArray(iterable)) {
    const array = iterable
    return Object.hasOwn(array, Number(i))
      ? Option.some(array[i])
      : Option.none()
  }
  let index = -1
  for (const a of iterable) {
    index++
    if (i === index) {
      return Option.some(a)
    }
  }
  return Option.none()
}

export const findMap: {
  <A, B>(
    aimb: (a: A, i: number) => Option.Option<B>,
  ): (self: Iterable<A>) => Option.Option<B>
} = aimb => self => {
  let i = -1
  for (const a of self) {
    i++
    const option = aimb(a, i)
    if (Option.isSome(option)) {
      return option
    }
  }
  return Option.none()
}

export const find: {
  <A, B extends A>(
    p: RefinementWithIndex<A, B, number>,
  ): (self: Iterable<A>) => Option.Option<B>
  <A>(p: PredicateWithIndex<A, number>): (self: Iterable<A>) => Option.Option<A>
} = <A>(p: PredicateWithIndex<A, number>) =>
  findMap((a: A, i) => (p(a, i) ? Option.some(a) : Option.none()))

export const findIndex: {
  <A>(
    p: PredicateWithIndex<A, number>,
  ): (self: Iterable<A>) => Option.Option<number>
} = p => self => {
  let i = -1
  for (const a of self) {
    i++
    if (p(a, i)) {
      return Option.some(i)
    }
  }
  return Option.none()
}

/** Is `a` an element of iterable by `Equivalence` instance */
export const elem =
  <A>(Equivalence: Equivalence<A>) =>
  (a: A) =>
  (self: Iterable<A>): boolean =>
    pipe(self, find(Equivalence.equals(a)), Option.isSome)

export const every: {
  <A, B extends A>(
    p: RefinementWithIndex<A, B, number>,
  ): Refinement<Iterable<A>, Iterable<B>>
  <A>(p: PredicateWithIndex<A, number>): Predicate<Iterable<A>>
} =
  <A, B extends A>(p: RefinementWithIndex<A, B, number>) =>
  (self: Iterable<A>): self is Iterable<B> => {
    let i = -1
    for (const a of self) {
      i++
      if (!p(a, i)) {
        return false
      }
    }
    return true
  }

export const exists: {
  <A>(p: PredicateWithIndex<A, number>): (self: Iterable<A>) => boolean
} = p => self => {
  let i = -1
  for (const a of self) {
    i++
    if (p(a, i)) {
      return true
    }
  }
  return false
}

/** Alias for `exists` */
export const some = exists

export const includes: {
  <A>(a: A): (self: Iterable<A>) => boolean
} = a => some(x => x === a)

export const takeWhile: {
  <A>(p: PredicateWithIndex<A, number>): (self: Iterable<A>) => Iterable<A>
} = p => self =>
  maybeNonEmpty({
    *[Symbol.iterator]() {
      let i = -1
      for (const a of self) {
        i++
        if (!p(a, i)) {
          break
        }
        yield a
      }
    },
  })

export const take: {
  (n: number): <A>(self: Iterable<A>) => Iterable<A>
} = n => self => {
  if (n <= 0) {
    return zero()
  }
  return maybeNonEmpty({
    *[Symbol.iterator]() {
      let i = -1
      for (const a of self) {
        i++
        yield a
        if (i === n - 1) {
          break
        }
      }
    },
  })
}

export const dropWhile: {
  <A>(p: PredicateWithIndex<A, number>): (self: Iterable<A>) => Iterable<A>
} = p => self =>
  maybeNonEmpty({
    *[Symbol.iterator]() {
      let isDropped = false
      let i = -1
      for (const a of self) {
        i++

        if (!isDropped && p(a, i)) {
          continue
        }
        isDropped = true

        yield a
      }
    },
  })

export const drop: {
  (n: number): <A>(self: Iterable<A>) => Iterable<A>
} = n => dropWhile((_, i) => i < n)

export const chunksOf =
  (n: number) =>
  <A>(self: Iterable<A>): Iterable<Iterable<A>> => {
    if (n <= 0) {
      return zero()
    }

    return maybeNonEmpty({
      *[Symbol.iterator]() {
        const iterator = self[Symbol.iterator]()
        let iteration = iterator.next()
        let count = n

        while (!iteration.done) {
          yield {
            *[Symbol.iterator]() {
              while (count > 0) {
                count--
                yield iteration.value
                iteration = iterator.next()
              }
            },
          }
          count = n
        }
      },
    })
  }
