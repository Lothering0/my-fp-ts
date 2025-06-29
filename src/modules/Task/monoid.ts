import { Monoid } from "../../types/Monoid"
import { getRaceSemigroup } from "./semigroup"
import { Task } from "./task"
import { _ } from "../../utils/underscore"

export const getRaceMonoid: {
  <A>(): Monoid<Task<A>>
} = () => ({
  ...getRaceSemigroup (),
  empty: () => new Promise (() => _),
})
