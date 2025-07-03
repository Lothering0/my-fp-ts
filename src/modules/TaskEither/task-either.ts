import * as T from "../Task"
import * as E from "../Either"
import { identity } from "../Identity"
import { flow } from "../../utils/flow"
import { HKT } from "../../types/HKT"

export interface TaskEitherHKT extends HKT {
  readonly type: TaskEither<this["_E"], this["_A"]>
}

export declare const _F: TaskEitherHKT

export interface TaskEither<E, A> extends T.Task<E.Either<E, A>> {}

export const left: {
  <E>(e: E): TaskEither<E, never>
} = flow (E.left, T.of)

export const right: {
  <A>(a: A): TaskEither<never, A>
} = flow (E.right, T.of)

export const toTaskEither: {
  <E, A>(ma: T.Task<A>): TaskEither<E, A>
} = ma => () => ma ().then (E.right, E.left)

export const fromTaskEither: {
  <E, A>(ma: TaskEither<E, A>): Promise<E.Either<E, A>>
} = mma => mma ().then (identity, E.left)
