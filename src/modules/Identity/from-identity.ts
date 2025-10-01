import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'
import { Identity, identity, IdentityHkt } from './identity'

export const FromIdentity: FromIdentity_<IdentityHkt> = {
  of: identity,
}

export const of: {
  <A>(a: A): Identity<A>
} = FromIdentity.of
