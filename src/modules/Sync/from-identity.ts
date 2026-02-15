import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'
import { Sync, sync, Hkt } from './sync'

export const FromIdentity: FromIdentity_<Hkt> = {
  of: sync,
}

export const of: {
  <A>(success: A): Sync<A>
} = FromIdentity.of
