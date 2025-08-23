import { Hkt, Kind } from "./Hkt"
import { TypeClass } from "./TypeClass"

export interface Contravariant<F extends Hkt> extends TypeClass<F> {
  readonly contramap: <In, Out>(
    ba: (b: Out) => In,
  ) => <Collectable, Fixed>(
    self: Kind<F, In, Collectable, Fixed>,
  ) => Kind<F, Out, Collectable, Fixed>
}
