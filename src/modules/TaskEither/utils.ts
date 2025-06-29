import * as T from "../Task"
import * as E from "../Either"
import { overload } from "../../utils/overloads"
import { fromTaskEither, TaskEither } from "./task-either"

export const toUnion: {
  <E, A>(ma: TaskEither<E, A>): T.Task<E | A>
} = mma => () => fromTaskEither (mma).then (E.toUnion)

export const match: {
  <E, A, B>(
    whenLeft: (e: E) => B,
    whenRight: (a: A) => B,
  ): (self: TaskEither<E, A>) => T.Task<B>
  <E, A, B>(
    self: TaskEither<E, A>,
    whenLeft: (e: E) => B,
    whenRight: (a: A) => B,
  ): T.Task<B>
} = overload (
  2,
  (self, whenLeft, whenRight) => () =>
    fromTaskEither (self).then (E.match (whenLeft, whenRight)),
)
