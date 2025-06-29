import { TaskOption, fromTaskOption } from "./task-option"
import { Semigroup } from "../../types/Semigroup"

export const getRaceSemigroup: {
  <A>(): Semigroup<TaskOption<A>>
} = () => ({
  concat: (x, y) => () => Promise.race ([fromTaskOption (x), fromTaskOption (y)]),
})
