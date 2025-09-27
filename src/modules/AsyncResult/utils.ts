import * as Result from '../Result'
import { Async } from '../Async'
import { toPromise, AsyncResult } from './async-result'

export const toUnion: {
  <Failure, Success>(
    self: AsyncResult<Failure, Success>,
  ): Async<Failure | Success>
} = self => () => toPromise(self).then(Result.toUnion)
