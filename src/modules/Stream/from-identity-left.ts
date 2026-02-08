import * as Stream from './stream'
import { FromIdentityLeft as FromIdentityLeft_ } from '../../typeclasses/FromIdentityLeft'
import { fail } from './utils'

export const FromIdentityLeft: FromIdentityLeft_<Stream.Hkt> = {
  ofLeft: fail,
}

export const ofLeft: {
  <E>(e: E): Stream.Stream<never, E>
} = FromIdentityLeft.ofLeft
