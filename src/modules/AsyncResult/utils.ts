import * as result from '../Result'
import { Async } from '../Async'
import { toPromise, AsyncResult } from './async-result'

export const toUnion: {
  <Failure, Success>(
    self: AsyncResult<Failure, Success>,
  ): Async<Failure | Success>
} = self => () => toPromise(self).then(result.toUnion)
