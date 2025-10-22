import { FromIdentityLeft as FromIdentityLeft_ } from '../../typeclasses/FromIdentityLeft'
import { ResultHkt, Result, fail } from './result'

export const FromIdentityLeft: FromIdentityLeft_<ResultHkt> = {
  ofLeft: fail,
}

export const ofLeft: {
  <E>(a: E): Result<never, E>
} = FromIdentityLeft.ofLeft
