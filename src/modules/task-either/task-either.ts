import * as T from "../task"
import * as E from "../either"
import { identity } from "../identity"
import { pipe } from "../../utils/pipe"
import { overloadWithPointFree2 } from "../../utils/points"

declare module "../../types/Kind" {
  interface Kind2<E, A> {
    readonly TaskEither: TaskEither<E, A>
  }
}

export interface TaskEither<E, A> extends T.Task<E.Either<E, A>> {
  (): Promise<E.Either<E, A>>
}

type LeftConstructor = <E>(e: E) => TaskEither<E, never>
export const left: LeftConstructor = a => pipe (a, E.left, T.of)

type RightConstructor = <A>(a: A) => TaskEither<never, A>
export const right: RightConstructor = a => pipe (a, E.right, T.of)

type ToTaskEither = <E, A>(ma: T.Task<A>) => TaskEither<E, A>
export const toTaskEither: ToTaskEither = ma => () => ma ().then (E.right, E.left)

type FromTaskEither = <E, A>(ma: TaskEither<E, A>) => Promise<E.Either<E, A>>
export const fromTaskEither: FromTaskEither = mma =>
  mma ().then (identity, E.left)

type ToUnion = <E, A>(ma: TaskEither<E, A>) => T.Task<E | A>
export const toUnion: ToUnion = mma => () => fromTaskEither (mma).then (E.toUnion)

interface TaskEitherEliminatorPointed {
  <E, A, B>(
    mma: TaskEither<E, A>,
    whenLeft: (e: E) => B,
    whenRight: (a: A) => B,
  ): T.Task<B>
}

interface TaskEitherEliminator extends TaskEitherEliminatorPointed {
  <E, A, B>(
    whenLeft: (e: E) => B,
    whenRight: (a: A) => B,
  ): (mma: TaskEither<E, A>) => T.Task<B>
}

const taskEitherPointed: TaskEitherEliminatorPointed = (mma, f, g) => () =>
  fromTaskEither (mma).then (E.either (f, g))

export const taskEither: TaskEitherEliminator =
  overloadWithPointFree2 (taskEitherPointed)
