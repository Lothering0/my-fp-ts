import * as Array from '../ReadonlyArray'
import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'
import {
  NonEmptyReadonlyArray,
  NonEmptyReadonlyArrayHkt,
} from './non-empty-readonly-array'

export const FromIdentity: FromIdentity_<NonEmptyReadonlyArrayHkt> = {
  ...Array.FromIdentity,
} as FromIdentity_<NonEmptyReadonlyArrayHkt>

export const of: {
  <A>(a: A): NonEmptyReadonlyArray<A>
} = FromIdentity.of
