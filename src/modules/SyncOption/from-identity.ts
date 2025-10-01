import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'
import { some, SyncOption, SyncOptionHkt } from './sync-option'

export const FromIdentity: FromIdentity_<SyncOptionHkt> = {
  of: some,
}

export const of: {
  <A>(success: A): SyncOption<A>
} = FromIdentity.of
