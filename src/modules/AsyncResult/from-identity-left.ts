import { FromIdentityLeft as FromIdentityLeft_ } from '../../typeclasses/FromIdentityLeft'
import { _AsyncResult } from './_internal'
import { AsyncResult, Hkt } from './async-result'

export const FromIdentityLeft: FromIdentityLeft_<Hkt> =
  _AsyncResult.FromIdentityLeft

export const ofLeft: {
  <E>(e: E): AsyncResult<never, E>
} = FromIdentityLeft.ofLeft
