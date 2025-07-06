import { Semigroup } from "../../types/Semigroup"
import { Async, fromAsync } from "./async"

export const getRaceSemigroup: {
  <A>(): Semigroup<Async<A>>
} = () => ({
  concat: (x, y) => () => Promise.race ([fromAsync (x), fromAsync (y)]),
})
