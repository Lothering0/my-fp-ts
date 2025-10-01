import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'
import { succeed, SyncResult, SyncResultHkt } from './sync-result'

export const FromIdentity: FromIdentity_<SyncResultHkt> = {
  of: succeed,
}

export const of: {
  <A>(success: A): SyncResult<A>
} = FromIdentity.of
