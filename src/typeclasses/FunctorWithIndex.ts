import { Functor } from "./Functor"
import { Hkt, Kind } from "./Hkt"

export interface FunctorWithIndex<F extends Hkt, Index> extends Functor<F> {
  readonly mapWithIndex: <In, Out>(
    iab: (a: In, i: Index) => Out,
  ) => <Collectable, Fixed>(
    self: Kind<F, In, Collectable, Fixed>,
  ) => Kind<F, Out, Collectable, Fixed>
}
