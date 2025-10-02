import * as Async from '../Async'
import { FromResult as FromResult_ } from '../../typeclasses/FromResult'
import { Result } from '../Result'
import { AsyncResult, AsyncResultHkt } from './async-result'

export const FromResult: FromResult_<AsyncResultHkt> = {
  fromResult: Async.of,
}

export const fromResult: {
  <A, E>(ma: Result<A, E>): AsyncResult<A, E>
} = FromResult.fromResult
