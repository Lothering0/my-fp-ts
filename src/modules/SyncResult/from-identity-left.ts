import { FromIdentityLeft as FromIdentityLeft_ } from '../../typeclasses/FromIdentityLeft'
import { _SyncResult } from './internal'
import { SyncResult, SyncResultHkt } from './sync-result'

export const FromIdentityLeft: FromIdentityLeft_<SyncResultHkt> =
  _SyncResult.FromIdentityLeft

export const ofLeft: {
  <E>(a: E): SyncResult<never, E>
} = FromIdentityLeft.ofLeft
