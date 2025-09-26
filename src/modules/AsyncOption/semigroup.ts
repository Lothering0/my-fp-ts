import { AsyncOption, toPromise } from "./async-option"
import { Semigroup } from "../../typeclasses/Semigroup"

export const getRaceSemigroup: {
  <Fixed>(): Semigroup<AsyncOption<Fixed>>
} = () => ({
  combine: y => x => () => Promise.race ([toPromise (x), toPromise (y)]),
})
