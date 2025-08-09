import { Alt } from "./Alt"
import { Hkt, Kind } from "./Hkt"

export interface Alternative<F extends Hkt> extends Alt<F> {
  readonly zero: <S, E, A>() => Kind<F, S, E, A>
}
