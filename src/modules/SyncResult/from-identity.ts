import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'
import { _SyncResult } from './_internal'
import { SyncResult, Hkt } from './sync-result'

export const FromIdentity: FromIdentity_<Hkt> = _SyncResult.FromIdentity

export const of: {
  <A>(success: A): SyncResult<A>
} = FromIdentity.of
