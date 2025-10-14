import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'
import { _SyncOption } from './internal'
import { SyncOption, SyncOptionHkt } from './sync-option'

export const FromIdentity: FromIdentity_<SyncOptionHkt> =
  _SyncOption.FromIdentity

export const of: {
  <A>(success: A): SyncOption<A>
} = FromIdentity.of
