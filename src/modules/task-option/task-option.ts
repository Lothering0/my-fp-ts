import * as T from "../task"
import * as TE from "../task-either"
import * as E from "../either"
import * as O from "../option"
import { identity } from "../identity"
import { overloadWithPointFree2 } from "../../utils/points"

declare module "../../types/Kind" {
  interface Kind<A> {
    readonly TaskOption: TaskOption<A>
  }
}

export interface TaskOption<A> extends T.Task<O.Option<A>> {
  (): Promise<O.Option<A>>
}

type TaskNoneConstructor = TaskOption<never>
export const taskNone: TaskNoneConstructor = () => Promise.resolve (O.none)

type TaskSomeConstructor = <A>(a: A) => TaskOption<A>
export const taskSome: TaskSomeConstructor = a => () =>
  Promise.resolve (O.some (a))

type ToTaskOptionFromTask = <A>(ma: T.Task<A>) => TaskOption<A>
export const toTaskOptionFromTask: ToTaskOptionFromTask = ma => () =>
  ma ().then (O.some, () => O.none)

type ToTaskOptionFromTaskEither = <E, A>(
  ma: TE.TaskEither<E, A>,
) => TaskOption<A>
export const toTaskOptionFromTaskEither: ToTaskOptionFromTaskEither =
  ma => () =>
    ma ().then (
      ma => E.either (ma, () => O.none, O.some),
      () => O.none,
    )

type FromTaskOption = <A>(ma: TaskOption<A>) => Promise<O.Option<A>>
export const fromTaskOption: FromTaskOption = mma =>
  mma ().then (identity, () => O.none)

interface TaskOptionEliminatorPointed {
  <A, B>(
    mma: TaskOption<A>,
    whenNone: () => B,
    whenSome: (a: A) => B,
  ): T.Task<B>
}

interface TaskOptionEliminator extends TaskOptionEliminatorPointed {
  <A, B>(
    whenNone: () => B,
    whenSome: (a: A) => B,
  ): (mma: TaskOption<A>) => T.Task<B>
}

const taskOptionPointed: TaskOptionEliminatorPointed = (mma, f, g) => () =>
  fromTaskOption (mma).then (O.option (f, g))

export const taskOption: TaskOptionEliminator =
  overloadWithPointFree2 (taskOptionPointed)
