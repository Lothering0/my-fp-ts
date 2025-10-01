import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'
import { Option, OptionHkt, some } from './option'

export const FromIdentity: FromIdentity_<OptionHkt> = {
  of: some,
}

export const of: {
  <A>(a: A): Option<A>
} = FromIdentity.of
