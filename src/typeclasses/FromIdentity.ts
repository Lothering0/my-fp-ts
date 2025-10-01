import { Hkt, Kind } from './Hkt'

export interface FromIdentity<F extends Hkt> {
  readonly of: <Out>(a: Out) => Kind<F, Out>
}
