import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'
import { Sync, sync, SyncHkt } from './sync'

export const FromIdentity: FromIdentity_<SyncHkt> = {
  of: sync,
}

export const of: {
  <A>(success: A): Sync<A>
} = FromIdentity.of
