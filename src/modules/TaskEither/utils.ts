import * as T from "../Task"
import * as E from "../Either"
import { overload2 } from "../../utils/overloads"
import { fromTaskEither, TaskEither } from "./task-either"

type ToUnion = <E, A>(ma: TaskEither<E, A>) => T.Task<E | A>
export const toUnion: ToUnion = mma => () => fromTaskEither (mma).then (E.toUnion)

interface MatchPointed {
  <E, A, B>(
    mma: TaskEither<E, A>,
    whenLeft: (e: E) => B,
    whenRight: (a: A) => B,
  ): T.Task<B>
}

interface Match extends MatchPointed {
  <E, A, B>(
    whenLeft: (e: E) => B,
    whenRight: (a: A) => B,
  ): (mma: TaskEither<E, A>) => T.Task<B>
}

const matchPointed: MatchPointed = (mma, f, g) => () =>
  fromTaskEither (mma).then (E.match (f, g))

export const match: Match = overload2 (matchPointed)
