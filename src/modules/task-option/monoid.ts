import { TaskOption } from "./task-option"
import { some } from "../option"
import { Monoid } from "../../types/Monoid"
import { _ } from "../../utils/underscore"
import { getRaceSemigroup } from "./semigroup"

type GetRaceMonoid = <A>() => Monoid<TaskOption<A>>
export const getRaceMonoid: GetRaceMonoid = () => ({
  ...getRaceSemigroup (),
  empty: () => new Promise (() => some (_)),
})
