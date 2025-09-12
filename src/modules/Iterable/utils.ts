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
