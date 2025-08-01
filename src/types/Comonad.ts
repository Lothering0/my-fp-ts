import { Extendable } from "./Extendable"
import { HKT, Kind } from "./HKT"

export interface Comonad<F extends HKT> extends Extendable<F> {
  readonly extract: <S, _, A>(self: Kind<F, S, _, A>) => A
}
