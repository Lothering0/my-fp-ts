import { FromResult as FromResult_ } from '../../typeclasses/FromResult'
import { Result } from '../Result'
import { AsyncResult, AsyncResultHkt } from './async-result'
import { _AsyncResult } from './_internal'

export const FromResult: FromResult_<AsyncResultHkt> = _AsyncResult.FromResult

export const fromResult: {
  <A, E>(ma: Result<A, E>): AsyncResult<A, E>
} = FromResult.fromResult
