import * as Array from './readonly-array'
import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'

export const of = <A>(a: A): Array.NonEmpty<A> => [a]

export const FromIdentity: FromIdentity_<Array.ReadonlyArrayHkt> = {
  of,
}
