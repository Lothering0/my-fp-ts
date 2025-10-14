import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'
import { _SyncResult } from './internal'
import { SyncResult, SyncResultHkt } from './sync-result'

export const FromIdentity: FromIdentity_<SyncResultHkt> =
  _SyncResult.FromIdentity

export const of: {
  <A>(success: A): SyncResult<A>
} = FromIdentity.of
