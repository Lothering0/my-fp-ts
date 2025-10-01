import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'
import { Async, async, AsyncHkt } from './async'

export const FromIdentity: FromIdentity_<AsyncHkt> = {
  of: async,
}

export const of: {
  <A>(a: A): Async<A>
} = FromIdentity.of
