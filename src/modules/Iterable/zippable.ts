import * as Zippable_ from '../../typeclasses/Zippable'
import { IterableHkt } from './iterable'

export const zipWith: {
  <A, B, C>(
    bs: Iterable<B>,
    abic: (a: A, b: B, i: number) => C,
  ): (self: Iterable<A>) => Iterable<C>
} = (bs, abic) => self => ({
  *[Symbol.iterator]() {
    const firstIterator = self[Symbol.iterator]()
    const secondIterator = bs[Symbol.iterator]()

    const first = firstIterator.next()
    const second = secondIterator.next()

    let i = -1
    while (!first.done && !second.done) {
      i++
      yield abic(first.value, second.value, i)
    }
  },
})

export const zip: {
  <B>(bs: Iterable<B>): <A>(self: Iterable<A>) => Iterable<readonly [A, B]>
} = bs => zipWith(bs, (a, b) => [a, b])

export const unzip: {
  <A, B>(zipped: Iterable<readonly [A, B]>): readonly [Iterable<A>, Iterable<B>]
} = zipped => {
  const as = {
    *[Symbol.iterator]() {
      for (const [a] of zipped) {
        yield a
      }
    },
  }
  const bs = {
    *[Symbol.iterator]() {
      for (const [, b] of zipped) {
        yield b
      }
    },
  }

  return [as, bs]
}

export const Zippable: Zippable_.Zippable<IterableHkt> = {
  zipWith,
  zip,
  unzip,
}
