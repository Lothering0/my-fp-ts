import * as result from "../Result"
import { Async } from "../Async"
import { toPromise, AsyncResult } from "./async-result"

export interface Matchers<E, A, B, C = B> {
  readonly onFailure: (e: E) => B
  readonly onSuccess: (a: A) => C
}

export const match: {
  <E, A, B, C = B>(
    matchers: Matchers<E, A, B, C>,
  ): (self: AsyncResult<E, A>) => Async<B | C>
} = matchers => self => () => toPromise (self).then (result.match (matchers))
