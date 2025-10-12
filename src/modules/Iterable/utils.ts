import * as Option from '../Option'
import { Equivalence } from '../../typeclasses/Equivalence'
import { Predicate, PredicateWithIndex } from '../Predicate'
import { Refinement, RefinementWithIndex } from '../Refinement'
import { pipe } from '../../utils/flow'

export const toReadonlyArray: {
  <A>(self: Iterable<A>): ReadonlyArray<A>
} = self => [...self]

export const toEntries: {
  <A>(self: Iterable<A>): Iterable<readonly [number, A]>
} = self => ({
  *[Symbol.iterator]() {
    let i = -1

    for (const a of self) {
      i++
      yield [i, a]
    }
  },
})

export const zero: {
  <Out>(): Iterable<Out>
} = () => ({
  *[Symbol.iterator]() {},
})

export const length: {
  (self: Iterable<unknown>): number
} = self => {
  let i = 0

  for (const _ of self) {
    i++
  }

  return i
}

export const lastIndex: {
  (self: Iterable<unknown>): number
} = self => length(self) - 1

export const has: {
  <A>(i: number): Predicate<Iterable<A>>
} = i => self => {
  if (i < 0) {
    return false
  }

  let index = 0

  for (const _ of self) {
    if (i === index) {
      return true
    }
    index++
  }

  return false
}

export const isOutOfBounds: {
  <A>(i: number): Predicate<Iterable<A>>
} = i => self => !has(i)(self)

export const prepend: {
  <A>(a: A): (self: Iterable<A>) => Iterable<A>
} = a => self => ({
  *[Symbol.iterator]() {
    yield a
    yield* self
  },
})

export const append: {
  <A>(a: A): (self: Iterable<A>) => Iterable<A>
} = a => self => ({
  *[Symbol.iterator]() {
    yield* self
    yield a
  },
})

export const concat: {
  <A>(end: Iterable<A>): (start: Iterable<A>) => Iterable<A>
} = end => start => ({
  *[Symbol.iterator]() {
    yield* start
    yield* end
  },
})

export const head: {
  <A>(self: Iterable<A>): Option.Option<A>
} = self => {
  for (const a of self) {
    return Option.some(a)
  }
  return Option.none()
}

/** Notice: it always executes one extra iteration */
export const init: {
  <A>(self: Iterable<A>): Option.Option<Iterable<A>>
} = iterable => {
  const iterator = iterable[Symbol.iterator]()
  const iteration = iterator.next()
  if (iteration.done) {
    return Option.none()
  }
  let isDone = false
  return Option.some({
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

/** Notice: it always executes the whole iterable to reach the last element */
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

/** Notice: it always executes one extra iteration */
export const tail: {
  <A>(self: Iterable<A>): Option.Option<Iterable<A>>
} = iterable => {
  const iterator = iterable[Symbol.iterator]()
  const { done } = iterator.next()
  if (done) {
    return Option.none()
  }
  let isDone = false
  return Option.some({
    *[Symbol.iterator]() {
      while (!isDone) {
        const { done, value } = iterator.next()
        isDone = Boolean(done)
        if (!isDone) {
          yield value
        }
      }
    },
  })
}

export const lookup: {
  <A>(i: number): (self: Iterable<A>) => Option.Option<A>
} = i => self => {
  if (i < 0) {
    return Option.none()
  }

  let index = -1
  for (const a of self) {
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
} = p => self => ({
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
  return {
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
  }
}

export const dropWhile: {
  <A>(p: PredicateWithIndex<A, number>): (self: Iterable<A>) => Iterable<A>
} = p => self => ({
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

    return {
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
    }
  }
