import * as T from "../Task"
import * as E from "../Either"
import { URIS2 } from "../../types/Kind"
import { identity } from "../Identity"
import { flow } from "../../utils/flow"
import { overload2 } from "../../utils/overloads"

declare module "../../types/Kind" {
  interface URIToKind2<E, A> {
    readonly TaskEither: TaskEither<E, A>
  }
}

export interface TaskEither<E, A> extends T.Task<E.Either<E, A>> {}

export const _URI = "TaskEither" satisfies URIS2

type LeftConstructor = <E>(e: E) => TaskEither<E, never>
export const left: LeftConstructor = flow (E.left, T.of)

type RightConstructor = <A>(a: A) => TaskEither<never, A>
export const right: RightConstructor = flow (E.right, T.of)

type ToTaskEither = <E, A>(ma: T.Task<A>) => TaskEither<E, A>
export const toTaskEither: ToTaskEither = ma => () => ma ().then (E.right, E.left)

type FromTaskEither = <E, A>(ma: TaskEither<E, A>) => Promise<E.Either<E, A>>
export const fromTaskEither: FromTaskEither = mma =>
  mma ().then (identity, E.left)

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
