import { Semigroup } from "../../types/Semigroup"
import { AsyncResult, fromAsyncResult } from "./async-result"

export const getRaceSemigroup: {
  <E, A>(): Semigroup<AsyncResult<E, A>>
} = () => ({
  concat: (x, y) => () =>
    Promise.race ([fromAsyncResult (x), fromAsyncResult (y)]),
})
