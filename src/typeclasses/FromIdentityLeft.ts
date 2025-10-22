import { Hkt, Kind } from './Hkt'

export interface FromIdentityLeft<F extends Hkt> {
  readonly ofLeft: <Collectable>(e: Collectable) => Kind<F, never, Collectable>
}
