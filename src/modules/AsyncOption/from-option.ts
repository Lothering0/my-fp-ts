import { FromOption as FromOption_ } from '../../typeclasses/FromOption'
import { Option } from '../Option'
import { AsyncOption, Hkt } from './async-option'
import { _AsyncOption } from './_internal'

export const FromOption: FromOption_<Hkt> = _AsyncOption.FromOption

export const fromOption: {
  <A>(option: Option<A>): AsyncOption<A>
} = FromOption.fromOption
