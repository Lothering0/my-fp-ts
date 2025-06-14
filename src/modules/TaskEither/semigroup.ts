import { Semigroup } from "../../types/Semigroup"
import { TaskEither, fromTaskEither } from "./task-either"

type GetRaceSemigroup = <E, A>() => Semigroup<TaskEither<E, A>>
export const getRaceSemigroup: GetRaceSemigroup = () => ({
  concat: (x, y) => () => Promise.race ([fromTaskEither (x), fromTaskEither (y)]),
})
