import { Hkt, Kind } from './Hkt'
import { TypeClass } from './TypeClass'

export interface Invariant<F extends Hkt> extends TypeClass<F> {
  readonly imap: <In, Out>(
    ab: (a: In) => Out,
    ba: (b: Out) => In,
  ) => <Collectable, Fixed>(
    self: Kind<F, In, Collectable, Fixed>,
  ) => Kind<F, Out, Collectable, Fixed>
}
