import { Effect } from '../modules/Effect'
import { Hkt, Kind } from './Hkt'

export interface FromEffect<F extends Hkt> {
  readonly fromEffect: <Out, Collectable, Fixed>(
    ma: Effect<Out, Collectable, Fixed>,
  ) => Kind<F, Out, Collectable, Fixed>
}
