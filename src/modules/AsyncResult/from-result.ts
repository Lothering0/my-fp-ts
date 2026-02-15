import { FromResult as FromResult_ } from '../../typeclasses/FromResult'
import { Result } from '../Result'
import { AsyncResult, Hkt } from './async-result'
import { _AsyncResult } from './_internal'

export const FromResult: FromResult_<Hkt> = _AsyncResult.FromResult

export const fromResult: {
  <A, E>(result: Result<A, E>): AsyncResult<A, E>
} = FromResult.fromResult
