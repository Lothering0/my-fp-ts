import { Alt } from "./Alt"
import { HKT, Kind } from "./HKT"

export interface Alternative<F extends HKT> extends Alt<F> {
  readonly zero: <S, E, A>() => Kind<F, S, E, A>
}
