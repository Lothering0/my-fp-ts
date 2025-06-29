import * as T from "../Task"
import * as TE from "../TaskEither"
import * as E from "../Either"
import * as O from "../Option"
import { HKT } from "../../types/HKT"
import { identity } from "../Identity"
import { constant } from "../../utils/constant"
import { flow } from "../../utils/flow"

export interface TaskOptionHKT extends HKT {
  readonly type: TaskOption<this["_A"]>
}

export interface TaskOption<A> extends T.Task<O.Option<A>> {}

export const none: TaskOption<never> = T.of (O.none)

export const some: {
  <A>(a: A): TaskOption<A>
} = flow (O.some, T.of)

export const toTaskOptionFromTask: {
  <A>(ma: T.Task<A>): TaskOption<A>
} = ma => () => ma ().then (O.some, () => O.none)

export const toTaskOptionFromTaskEither: {
  <E, A>(ma: TE.TaskEither<E, A>): TaskOption<A>
} = ma => () => ma ().then (E.match (constant (O.none), O.some), constant (O.none))

export const fromTaskOption: {
  <A>(ma: TaskOption<A>): Promise<O.Option<A>>
} = mma => mma ().then (identity, constant (O.none))
