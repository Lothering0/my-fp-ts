import * as Zippable_ from '../../typeclasses/Zippable'
import { ReadonlyArrayHkt } from './readonly-array'

export const zipWith: {
  <A, B, C>(
    bs: ReadonlyArray<B>,
    abic: (a: A, b: B, i: number) => C,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<C>
} = (bs, abic) => self => {
  const minLength = Math.min(self.length, bs.length)
  const out = []

  for (let i = 0; i < minLength; i++) {
    const a = self[i]!
    const b = bs[i]!
    out.push(abic(a, b, i))
  }

  return out
}

export const zip: {
  <B>(
    bs: ReadonlyArray<B>,
  ): <A>(self: ReadonlyArray<A>) => ReadonlyArray<readonly [A, B]>
} = bs => zipWith(bs, (a, b) => [a, b])

export const unzip: {
  <A, B>(
    zipped: ReadonlyArray<readonly [A, B]>,
  ): readonly [ReadonlyArray<A>, ReadonlyArray<B>]
} = zipped => {
  const as = []
  const bs = []

  for (const [a, b] of zipped) {
    as.push(a)
    bs.push(b)
  }

  return [as, bs]
}

export const Zippable: Zippable_.Zippable<ReadonlyArrayHkt> = {
  zipWith,
  zip,
  unzip,
}
