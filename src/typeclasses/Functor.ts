import { Hkt, Kind } from './Hkt'
import { TypeClass } from './TypeClass'

export interface Functor<F extends Hkt> extends TypeClass<F> {
  readonly map: <In, Out>(
    ab: (a: In) => Out,
  ) => <Collectable, Fixed>(
    self: Kind<F, In, Collectable, Fixed>,
  ) => Kind<F, Out, Collectable, Fixed>
}
