import { Hkt, Kind } from "./Hkt"
import { TypeClass } from "./TypeClass"

export interface Alt<F extends Hkt> extends TypeClass<F> {
  readonly orElse: <In, Collectable1, Fixed>(
    that: Kind<F, In, Collectable1, Fixed>,
  ) => <Out, Collectable2>(
    self: Kind<F, Out, Collectable1, Fixed>,
  ) => Kind<F, In | Out, Collectable1 | Collectable2, Fixed>
}
