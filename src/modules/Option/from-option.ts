import { FromOption as FromOption_ } from '../../typeclasses/FromOption'
import { identity } from '../Identity'
import { Option, OptionHkt } from './option'

export const FromOption: FromOption_<OptionHkt> = {
  fromOption: identity,
}

export const fromOption: {
  <A>(option: Option<A>): Option<A>
} = FromOption.fromOption
