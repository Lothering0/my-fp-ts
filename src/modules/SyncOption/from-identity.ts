import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'
import { _SyncOption } from './_internal'
import { SyncOption, Hkt } from './sync-option'

export const FromIdentity: FromIdentity_<Hkt> = _SyncOption.FromIdentity

export const of: {
  <A>(success: A): SyncOption<A>
} = FromIdentity.of
