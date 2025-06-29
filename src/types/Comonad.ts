import { Extendable } from "./Extendable"
import { HKT, Kind } from "./HKT"

export interface Comonad<F extends HKT> extends Extendable<F> {
  readonly extract: <_, A>(fa: Kind<F, _, A>) => A
}
