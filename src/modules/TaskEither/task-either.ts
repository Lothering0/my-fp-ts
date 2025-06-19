import * as T from "../Task"
import * as E from "../Either"
import { URIS2 } from "../../types/Kind"
import { identity } from "../Identity"
import { flow } from "../../utils/flow"

declare module "../../types/Kind" {
  interface URIToKind2<E, A> {
    readonly TaskEither: TaskEither<E, A>
  }
}

export interface TaskEither<E, A> extends T.Task<E.Either<E, A>> {}

export const URI = "TaskEither" satisfies URIS2
export type URI = typeof URI

type LeftConstructor = <E>(e: E) => TaskEither<E, never>
export const left: LeftConstructor = flow (E.left, T.of)

type RightConstructor = <A>(a: A) => TaskEither<never, A>
export const right: RightConstructor = flow (E.right, T.of)

type ToTaskEither = <E, A>(ma: T.Task<A>) => TaskEither<E, A>
export const toTaskEither: ToTaskEither = ma => () => ma ().then (E.right, E.left)

type FromTaskEither = <E, A>(ma: TaskEither<E, A>) => Promise<E.Either<E, A>>
export const fromTaskEither: FromTaskEither = mma =>
  mma ().then (identity, E.left)
