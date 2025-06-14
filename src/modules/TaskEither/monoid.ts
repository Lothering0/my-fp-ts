import { Monoid } from "../../types/Monoid"
import { getRaceSemigroup } from "./semigroup"
import { TaskEither } from "./task-either"
import { right } from "../Either"
import { _ } from "../../utils/underscore"

type GetRaceMonoid = <E, A>() => Monoid<TaskEither<E, A>>
export const getRaceMonoid: GetRaceMonoid = () => ({
  ...getRaceSemigroup (),
  empty: () => new Promise (() => right (_)),
})
