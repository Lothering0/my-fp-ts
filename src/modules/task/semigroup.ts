import { Semigroup } from "../../types/Semigroup"
import { Task, fromTask } from "./task"

type GetRaceSemigroup = <A>() => Semigroup<Task<A>>
export const getRaceSemigroup: GetRaceSemigroup = () => ({
  concat: (x, y) => () => Promise.race ([fromTask (x), fromTask (y)]),
})
