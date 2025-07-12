import { Semigroup } from "../../types/Semigroup"
import { Async, fromAsync } from "./async"
import { overload } from "../../utils/overloads"

export const getRaceSemigroup: {
  <A>(): Semigroup<Async<A>>
} = () => ({
  concat: overload (
    1,
    (x, y) => () => Promise.race ([fromAsync (x), fromAsync (y)]),
  ),
})
