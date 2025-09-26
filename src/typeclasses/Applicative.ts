import { Hkt, Kind } from './Hkt'
import { Functor } from './Functor'
import { flip } from '../utils/flip'

export interface Applicative<F extends Hkt> extends Functor<F> {
  readonly of: <Out>(a: Out) => Kind<F, Out>
  readonly ap: <In, Collectable1, Fixed>(
    fa: Kind<F, In, Collectable1, Fixed>,
  ) => <Out, Collectable2>(
    self: Kind<F, (a: In) => Out, Collectable2, Fixed>,
  ) => Kind<F, Out, Collectable1 | Collectable2, Fixed>
  /** Alias for `ap` */
  readonly apply: Applicative<F>['ap']
  readonly flap: <In, Out, Collectable1, Fixed>(
    fab: Kind<F, (a: In) => Out, Collectable1, Fixed>,
  ) => <Collectable2>(
    self: Kind<F, In, Collectable2, Fixed>,
  ) => Kind<F, Out, Collectable1 | Collectable2, Fixed>
  /** Alias for `flap` */
  readonly flipApply: Applicative<F>['flap']
}

export const create = <F extends Hkt>(
  Functor: Functor<F>,
  Applicative: Pick<Applicative<F>, 'of' | 'ap'>,
): Applicative<F> => {
  const flap: Applicative<F>['flap'] = flip(Applicative.ap) as typeof flap

  return {
    ...Functor,
    ...Applicative,
    apply: Applicative.ap,
    flap,
    flipApply: flap,
  }
}
