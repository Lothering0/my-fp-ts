import { Semigroup } from "../../types/Semigroup"
import { AsyncResult, toPromise } from "./async-result"

export const getRaceSemigroup: {
  <E, A>(): Semigroup<AsyncResult<E, A>>
} = () => ({
  combine: y => x => () => Promise.race ([toPromise (x), toPromise (y)]),
})
