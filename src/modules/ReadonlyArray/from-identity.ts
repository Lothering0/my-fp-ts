import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'
import { ReadonlyArrayHkt } from './readonly-array'

export const FromIdentity: FromIdentity_<ReadonlyArrayHkt> = {
  of: a => [a],
}

export const of: {
  <A>(a: A): ReadonlyArray<A>
} = FromIdentity.of
