import { FromIdentityLeft as FromIdentityLeft_ } from '../../typeclasses/FromIdentityLeft'
import { _SyncResult } from './_internal'
import { SyncResult, Hkt } from './sync-result'

export const FromIdentityLeft: FromIdentityLeft_<Hkt> =
  _SyncResult.FromIdentityLeft

export const ofLeft: {
  <E>(e: E): SyncResult<never, E>
} = FromIdentityLeft.ofLeft
