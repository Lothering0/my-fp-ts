import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'
import { Option, Hkt, some } from './option'

export const FromIdentity: FromIdentity_<Hkt> = {
  of: some,
}

export const of: {
  <A>(a: A): Option<A>
} = FromIdentity.of
