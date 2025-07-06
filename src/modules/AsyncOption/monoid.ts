import { AsyncOption } from "./async-option"
import { some } from "../Option"
import { Monoid } from "../../types/Monoid"
import { _ } from "../../utils/underscore"
import { getRaceSemigroup } from "./semigroup"

export const getRaceMonoid: {
  <A>(): Monoid<AsyncOption<A>>
} = () => ({
  ...getRaceSemigroup (),
  empty: () => new Promise (() => some (_)),
})
