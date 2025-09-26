import { Hkt, Kind } from './Hkt'

export interface NaturalTransformation<F extends Hkt, G extends Hkt> {
  <In, Collectable, Fixed>(
    fa: Kind<F, In, Collectable, Fixed>,
  ): Kind<G, In, Collectable, Fixed>
}
