import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'
import { Identity, identity, Hkt } from './identity'

export const FromIdentity: FromIdentity_<Hkt> = {
  of: identity,
}

export const of: {
  <A>(a: A): Identity<A>
} = FromIdentity.of
