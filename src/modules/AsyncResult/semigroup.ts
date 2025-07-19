import { Semigroup } from "../../types/Semigroup"
import { AsyncResult, toPromise } from "./async-result"
import { overload } from "../../utils/overloads"

export const getRaceSemigroup: {
  <E, A>(): Semigroup<AsyncResult<E, A>>
} = () => ({
  concat: overload (
    1,
    (x, y) => () => Promise.race ([toPromise (x), toPromise (y)]),
  ),
})
