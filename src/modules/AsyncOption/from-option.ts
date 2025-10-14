import { FromOption as FromOption_ } from '../../typeclasses/FromOption'
import { Option } from '../Option'
import { AsyncOption, AsyncOptionHkt } from './async-option'
import { _AsyncOption } from './internal'

export const FromOption: FromOption_<AsyncOptionHkt> = _AsyncOption.FromOption

export const fromOption: {
  <A>(ma: Option<A>): AsyncOption<A>
} = FromOption.fromOption
