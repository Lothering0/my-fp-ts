import { Alt } from "./Alt"
import { Hkt, Kind } from "./Hkt"

export interface Alternative<F extends Hkt> extends Alt<F> {
  readonly zero: <Out, Collectable, Fixed>() => Kind<F, Out, Collectable, Fixed>
}
