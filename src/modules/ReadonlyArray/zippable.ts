import * as Array from './readonly-array'
import * as Zippable_ from '../../typeclasses/Zippable'

export const zipWith =
  <F extends ReadonlyArray<any>, G extends ReadonlyArray<any>, C>(
    array: G,
    abic: (a: Array.Infer<F>, b: Array.Infer<G>, i: number) => C,
  ) =>
  (selfArray: F): Array.AndNonEmpty<F, G, C> => {
    const minLength = Math.min(selfArray.length, array.length)
    const out = []

    for (let i = 0; i < minLength; i++) {
      const a = selfArray[i]!
      const b = array[i]!
      out.push(abic(a, b, i))
    }

    return out as any
  }

export const zip: {
  <F extends ReadonlyArray<any>>(
    array: F,
  ): <G extends ReadonlyArray<any>>(
    selfArray: G,
  ) => Array.AndNonEmpty<F, G, readonly [Array.Infer<G>, Array.Infer<F>]>
} = bs => zipWith(bs, (a, b) => [a, b]) as any

export const unzip: {
  <F extends ReadonlyArray<readonly [any, any]>>(
    zipped: F,
  ): readonly [
    Array.With<F, Array.Infer<F>[0]>,
    Array.With<F, Array.Infer<F>[1]>,
  ]
} = zipped => {
  const as = []
  const bs = []

  for (const [a, b] of zipped) {
    as.push(a)
    bs.push(b)
  }

  return [as, bs] as any
}

export const Zippable: Zippable_.Zippable<Array.Hkt> = {
  zipWith,
  zip,
  unzip,
}

export const NonEmptyZippable: Zippable_.Zippable<Array.NonEmptyHkt> = {
  zipWith,
  zip,
  unzip,
}
