import { TaskOption } from "./task-option"
import { some } from "../Option"
import { Monoid } from "../../types/Monoid"
import { _ } from "../../utils/underscore"
import { getRaceSemigroup } from "./semigroup"

export const getRaceMonoid: {
  <A>(): Monoid<TaskOption<A>>
} = () => ({
  ...getRaceSemigroup (),
  empty: () => new Promise (() => some (_)),
})
