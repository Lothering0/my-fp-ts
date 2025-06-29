import { Semigroup } from "../../types/Semigroup"
import { Task, fromTask } from "./task"

export const getRaceSemigroup: {
  <A>(): Semigroup<Task<A>>
} = () => ({
  concat: (x, y) => () => Promise.race ([fromTask (x), fromTask (y)]),
})
