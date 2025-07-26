import { AsyncOption, toPromise } from "./async-option"
import { Semigroup } from "../../types/Semigroup"

export const getRaceSemigroup: {
  <A>(): Semigroup<AsyncOption<A>>
} = () => ({
  concat: y => x => () => Promise.race ([toPromise (x), toPromise (y)]),
})
