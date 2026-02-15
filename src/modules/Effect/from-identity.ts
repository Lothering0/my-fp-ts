import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'
import { Hkt, Effect, succeed } from './effect'

export const FromIdentity: FromIdentity_<Hkt> = {
  of: succeed,
}

export const of: {
  <A>(a: A): Effect<A>
} = FromIdentity.of
