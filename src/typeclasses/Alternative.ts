import { Alt } from "./Alt"
import { Hkt, Kind } from "./Hkt"

export interface Alternative<F extends Hkt> extends Alt<F> {
  readonly zero: <In, Collectable, Fixed>() => Kind<F, In, Collectable, Fixed>
}
