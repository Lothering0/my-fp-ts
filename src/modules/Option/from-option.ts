import { FromOption as FromOption_ } from '../../typeclasses/FromOption'
import { identity } from '../Identity'
import { Option, Hkt } from './option'

export const FromOption: FromOption_<Hkt> = {
  fromOption: identity,
}

export const fromOption: {
  <A>(option: Option<A>): Option<A>
} = FromOption.fromOption
