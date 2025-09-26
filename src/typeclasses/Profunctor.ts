import { Functor } from './Functor'
import { Hkt, Kind } from './Hkt'

export interface Profunctor<F extends Hkt> extends Functor<F> {
  readonly promap: <Collectable1, Collectable2, In, Out, Fixed>(
    de: (d: Collectable2) => Collectable1,
    ab: (a: In) => Out,
  ) => (
    self: Kind<F, In, Collectable1, Fixed>,
  ) => Kind<F, Out, Collectable2, Fixed>
}
