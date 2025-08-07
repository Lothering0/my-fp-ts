import { Semigroup } from "../../types/Semigroup"
import { Async, toPromise } from "./async"

export const getRaceSemigroup: {
  <A>(): Semigroup<Async<A>>
} = () => ({
  combine: y => x => () => Promise.race ([toPromise (x), toPromise (y)]),
})
