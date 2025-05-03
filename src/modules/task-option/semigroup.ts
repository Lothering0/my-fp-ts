import { TaskOption, fromTaskOption } from "./task-option"
import { Semigroup } from "../../types/Semigroup"

type GetRaceSemigroup = <A>() => Semigroup<TaskOption<A>>
export const getRaceSemigroup: GetRaceSemigroup = () => ({
  concat: (x, y) => () => Promise.race ([fromTaskOption (x), fromTaskOption (y)]),
})
