import * as Result from '../Result'
import { Async } from '../Async'
import { toPromise, AsyncResult } from './async-result'

export const toUnion: {
  <A, E>(self: AsyncResult<A, E>): Async<A | E>
} = self => () => toPromise(self).then(Result.toUnion)
