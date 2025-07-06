import { Monoid } from "../../types/Monoid"
import { getRaceSemigroup } from "./semigroup"
import { Async } from "./async"
import { _ } from "../../utils/underscore"

export const getRaceMonoid: {
  <A>(): Monoid<Async<A>>
} = () => ({
  ...getRaceSemigroup (),
  empty: () => new Promise (() => _),
})
