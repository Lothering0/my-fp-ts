import { Option } from '../modules/Option'
import { Hkt, Kind } from './Hkt'

export interface FromOption<F extends Hkt> {
  readonly fromOption: <Out>(ma: Option<Out>) => Kind<F, Out>
}
