import { Monoid } from "../../types/Monoid"
import { getRaceSemigroup } from "./semigroup"
import { Task } from "./task"
import { _ } from "../../utils/underscore"

type GetRaceMonoid = <A>() => Monoid<Task<A>>
export const getRaceMonoid: GetRaceMonoid = () => ({
  ...getRaceSemigroup (),
  empty: () => new Promise (() => _),
})
