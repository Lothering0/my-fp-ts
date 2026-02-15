import { FromIdentityLeft as FromIdentityLeft_ } from '../../typeclasses/FromIdentityLeft'
import { Hkt, Result, fail } from './result'

export const FromIdentityLeft: FromIdentityLeft_<Hkt> = {
  ofLeft: fail,
}

export const ofLeft: {
  <E>(e: E): Result<never, E>
} = FromIdentityLeft.ofLeft
