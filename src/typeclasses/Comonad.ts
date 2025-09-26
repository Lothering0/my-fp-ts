import { Extendable } from './Extendable'
import { Hkt, Kind } from './Hkt'

export interface Comonad<F extends Hkt> extends Extendable<F> {
  readonly extract: <In, Collectable, Fixed>(
    self: Kind<F, In, Collectable, Fixed>,
  ) => In
}
