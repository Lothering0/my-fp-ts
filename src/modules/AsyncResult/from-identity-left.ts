import { FromIdentityLeft as FromIdentityLeft_ } from '../../typeclasses/FromIdentityLeft'
import { _AsyncResult } from './_internal'
import { AsyncResult, AsyncResultHkt } from './async-result'

export const FromIdentityLeft: FromIdentityLeft_<AsyncResultHkt> =
  _AsyncResult.FromIdentityLeft

export const ofLeft: {
  <E>(a: E): AsyncResult<never, E>
} = FromIdentityLeft.ofLeft
