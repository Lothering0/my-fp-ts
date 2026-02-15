import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'
import { Async, async, Hkt } from './async'

export const FromIdentity: FromIdentity_<Hkt> = {
  of: async,
}

export const of: {
  <A>(a: A): Async<A>
} = FromIdentity.of
