import * as Zippable_ from '../../typeclasses/Zippable'
import * as Iterable from './iterable'
import { maybeNonEmpty } from './_internal'

export const zipWith: {
  <F extends Iterable<any>, G extends Iterable<any>, C>(
    bs: G,
    abic: (a: Iterable.Infer<F>, b: Iterable.Infer<G>, i: number) => C,
  ): (iterable: F) => Iterable.AndNonEmpty<F, G, C>
} = (bs, abic) => iterable =>
  maybeNonEmpty({
    *[Symbol.iterator]() {
      const firstIterator = iterable[Symbol.iterator]()
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
  <F extends Iterable<any>>(
    bs: F,
  ): <G extends Iterable<any>>(
    iterable: G,
  ) => Iterable.AndNonEmpty<
    F,
    G,
    readonly [Iterable.Infer<G>, Iterable.Infer<F>]
  >
} = bs => zipWith(bs, (a, b) => [a, b]) as any

export const unzip: {
  <F extends Iterable<readonly [any, any]>>(
    zipped: F,
  ): readonly [
    Iterable.With<F, Iterable.Infer<F>[0]>,
    Iterable.With<F, Iterable.Infer<F>[1]>,
  ]
} = zipped => {
  const as = maybeNonEmpty({
    *[Symbol.iterator]() {
      for (const [a] of zipped) {
        yield a
      }
    },
  })
  const bs = maybeNonEmpty({
    *[Symbol.iterator]() {
      for (const [, b] of zipped) {
        yield b
      }
    },
  })

  return [as, bs]
}

export const Zippable: Zippable_.Zippable<Iterable.Hkt> = {
  zipWith,
  zip,
  unzip,
}

export const NonEmptyZippable: Zippable_.Zippable<Iterable.NonEmptyHkt> = {
  zipWith,
  zip,
  unzip,
}
