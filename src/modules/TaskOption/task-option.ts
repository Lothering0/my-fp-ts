import * as T from "../Task"
import * as TE from "../TaskEither"
import * as E from "../Either"
import * as O from "../Option"
import { URIS } from "../../types/Kind"
import { identity } from "../Identity"
import { constant } from "../../utils/constant"
import { flow } from "../../utils/flow"

declare module "../../types/Kind" {
  interface URIToKind<A> {
    readonly TaskOption: TaskOption<A>
  }
}

export interface TaskOption<A> extends T.Task<O.Option<A>> {}

export const URI = "TaskOption" satisfies URIS
export type URI = typeof URI

type NoneConstructor = TaskOption<never>
export const none: NoneConstructor = T.of (O.none)

type SomeConstructor = <A>(a: A) => TaskOption<A>
export const some: SomeConstructor = flow (O.some, T.of)

type ToTaskOptionFromTask = <A>(ma: T.Task<A>) => TaskOption<A>
export const toTaskOptionFromTask: ToTaskOptionFromTask = ma => () =>
  ma ().then (O.some, () => O.none)

type ToTaskOptionFromTaskEither = <E, A>(
  ma: TE.TaskEither<E, A>,
) => TaskOption<A>
export const toTaskOptionFromTaskEither: ToTaskOptionFromTaskEither =
  ma => () =>
    ma ().then (E.match (constant (O.none), O.some), constant (O.none))

type FromTaskOption = <A>(ma: TaskOption<A>) => Promise<O.Option<A>>
export const fromTaskOption: FromTaskOption = mma =>
  mma ().then (identity, constant (O.none))
