import * as Stream from './stream'
import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'
import { succeed } from './utils'

export const FromIdentity: FromIdentity_<Stream.Hkt> = {
  of: succeed,
}

export const of: {
  <A>(a: A): Stream.Stream<A>
} = FromIdentity.of
