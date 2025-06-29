import { Semigroup } from "../../types/Semigroup"
import { TaskEither, fromTaskEither } from "./task-either"

export const getRaceSemigroup: {
  <E, A>(): Semigroup<TaskEither<E, A>>
} = () => ({
  concat: (x, y) => () => Promise.race ([fromTaskEither (x), fromTaskEither (y)]),
})
