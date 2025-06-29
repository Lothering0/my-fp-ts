import { Monoid } from "../../types/Monoid"
import { getRaceSemigroup } from "./semigroup"
import { TaskEither } from "./task-either"
import { right } from "../Either"
import { _ } from "../../utils/underscore"

export const getRaceMonoid: {
  <E, A>(): Monoid<TaskEither<E, A>>
} = () => ({
  ...getRaceSemigroup (),
  empty: () => new Promise (() => right (_)),
})
