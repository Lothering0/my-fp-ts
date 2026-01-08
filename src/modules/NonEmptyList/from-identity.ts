import * as List from '../List'
import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'
import { NonEmptyList, NonEmptyListHkt } from './non-empty-list'

export const FromIdentity: FromIdentity_<NonEmptyListHkt> = {
  ...List.FromIdentity,
} as FromIdentity_<NonEmptyListHkt>

export const of: {
  <A>(a: A): NonEmptyList<A>
} = FromIdentity.of
