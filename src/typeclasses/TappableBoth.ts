import { Sync } from '../modules/Sync'
import { Hkt, Kind } from './Hkt'
import { Tappable } from './Tappable'

export interface TappableBoth<F extends Hkt> extends Tappable<F> {
  readonly tapLeft: <Collectable1, Collectable2, Fixed>(
    f: (e: Collectable1) => Kind<F, unknown, Collectable2, Fixed>,
  ) => <In>(
    self: Kind<F, In, Collectable1, Fixed>,
  ) => Kind<F, In, Collectable1 | Collectable2, Fixed>

  readonly tapLeftSync: <Collectable>(
    f: (e: Collectable) => Sync<unknown>,
  ) => <In, Fixed>(
    self: Kind<F, In, Collectable, Fixed>,
  ) => Kind<F, In, Collectable, Fixed>
}
