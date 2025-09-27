import * as Result from '../Result'
import { Async } from '../Async'
import { toPromise, AsyncResult } from './async-result'

export const match: {
  <A, B, E, C = B>(
    matchers: Result.Matchers<A, B, E, C>,
  ): (self: AsyncResult<A, E>) => Async<B | C>
} = matchers => self => () => toPromise(self).then(Result.match(matchers))
