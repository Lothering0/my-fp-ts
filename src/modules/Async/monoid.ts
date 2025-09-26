import { Monoid } from "../../typeclasses/Monoid"
import { getRaceSemigroup } from "./semigroup"
import { Async } from "./async"
import { _ } from "../../utils/underscore"

export const empty: Async<never> = () => new Promise (() => _)

export const getRaceMonoid: {
  <Fixed>(): Monoid<Async<Fixed>>
} = () => ({
  ...getRaceSemigroup (),
  empty,
})
