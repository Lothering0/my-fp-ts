import { Async } from '../Async'
import { AsyncResult } from './async-result'
import { _AsyncResult } from './_internal'

export const toUnion: {
  <A, E>(self: AsyncResult<A, E>): Async<A | E>
} = _AsyncResult.toUnion
