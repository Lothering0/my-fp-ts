import { Hkt, Kind } from './Hkt'
import { Applicative } from './Applicative'
import { flow, pipe } from '../utils/flow'

export interface Zippable<F extends Hkt> {
  readonly zipWith: <In1, In2, Out, Collectable2, Fixed>(
    that: Kind<F, In2, Collectable2, Fixed>,
    f: (a: In1, b: In2) => Out,
  ) => <Collectable1>(
    self: Kind<F, In1, Collectable1, Fixed>,
  ) => Kind<F, Out, Collectable1 | Collectable2, Fixed>

  readonly zip: <In2, Collectable2, Fixed>(
    that: Kind<F, In2, Collectable2, Fixed>,
  ) => <In1, Collectable1>(
    self: Kind<F, In1, Collectable1, Fixed>,
  ) => Kind<F, readonly [In1, In2], Collectable1 | Collectable2, Fixed>

  readonly unzip: <In1, In2, Collectable1, Collectable2, Fixed>(
    zipped: Kind<F, readonly [In1, In2], Collectable1 | Collectable2, Fixed>,
  ) => readonly [
    Kind<F, In1, Collectable1 | Collectable2, Fixed>,
    Kind<F, In2, Collectable1 | Collectable2, Fixed>,
  ]
}

export const create = <F extends Hkt>(
  Applicative: Applicative<F>,
): Zippable<F> => {
  const zipWith: Zippable<F>['zipWith'] =
    <A, B, C>(that: Kind<F, B>, f: (a: A, b: B) => C) =>
    (self: Kind<F, A>) =>
      pipe(
        self,
        Applicative.map(a => (b: B) => f(a, b)),
        Applicative.apply(that),
      )

  return {
    zipWith,
    zip: that => flow(zipWith(that, (a, b) => [a, b])),
    unzip: zipped => [
      pipe(
        zipped,
        Applicative.map(([a]) => a),
      ),
      pipe(
        zipped,
        Applicative.map(([_, b]) => b),
      ),
    ],
  }
}
