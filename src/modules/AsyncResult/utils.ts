import * as result from "../Result"
import { Async } from "../Async"
import { toPromise, AsyncResult } from "./async-result"

export const toUnion: {
  <E, A>(self: AsyncResult<E, A>): Async<E | A>
} = self => () => toPromise (self).then (result.toUnion)
