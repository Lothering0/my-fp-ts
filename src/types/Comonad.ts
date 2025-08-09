import { Extendable } from "./Extendable"
import { Hkt, Kind } from "./Hkt"

export interface Comonad<F extends Hkt> extends Extendable<F> {
  readonly extract: <S, E, A>(self: Kind<F, S, E, A>) => A
}
