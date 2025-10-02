import { Result } from '../modules/Result'
import { Hkt, Kind } from './Hkt'

export interface FromResult<F extends Hkt> {
  readonly fromResult: <Out, Collectable>(
    ma: Result<Out, Collectable>,
  ) => Kind<F, Out, Collectable>
}
