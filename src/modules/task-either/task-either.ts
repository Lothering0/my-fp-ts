import * as T from "../task"
import * as E from "../either"
import { identity } from "../identity"
import { overloadWithPointFree2 } from "../../utils/points"

declare module "../../types/Kind" {
  interface Kind2<E, A> {
    readonly TaskEither: TaskEither<E, A>
  }
}

export interface TaskEither<E, A> extends T.Task<E.Either<E, A>> {
  (): Promise<E.Either<E, A>>
}

type TaskLeftConstructor = <E>(e: E) => TaskEither<E, never>
export const taskLeft: TaskLeftConstructor = a => () =>
  Promise.resolve (E.left (a))

type TaskRightConstructor = <A>(a: A) => TaskEither<never, A>
export const taskRight: TaskRightConstructor = a => () =>
  Promise.resolve (E.right (a))

type ToTaskEither = <E, A>(ma: T.Task<A>) => TaskEither<E, A>
export const toTaskEither: ToTaskEither = ma => () =>
  ma ().then (
    a => E.right (a),
    e => E.left (e),
  )

type FromTaskEither = <E, A>(ma: TaskEither<E, A>) => Promise<E.Either<E, A>>
export const fromTaskEither: FromTaskEither = mma =>
  mma ().then (identity, e => E.left (e))

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
