import * as Result from '../Result'
import { Async } from '../Async'
import { AsyncResult } from './async-result'
import { _AsyncResult } from './_internal'

export const match: {
  <A, B, E, C = B>(
    matchers: Result.Matchers<A, B, E, C>,
  ): (self: AsyncResult<A, E>) => Async<B | C>
} = _AsyncResult.match
