import { Alt } from "./Alt"
import { HKT, Kind } from "./HKT"

export interface Alternative<F extends HKT> extends Alt<F> {
  readonly zero: <R, E, A>() => Kind<F, R, E, A>
}
