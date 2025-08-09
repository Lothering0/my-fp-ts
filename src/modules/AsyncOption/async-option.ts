import * as async from "../Async"
import * as asyncResult from "../AsyncResult"
import * as result from "../Result"
import * as option from "../Option"
import { Hkt } from "../../types/Hkt"
import { identity } from "../Identity"
import { constant } from "../../utils/constant"
import { flow } from "../../utils/flow"

export interface AsyncOptionHkt extends Hkt {
  readonly type: AsyncOption<this["_A"]>
}

export interface AsyncOption<A> extends async.Async<option.Option<A>> {}

export const none: AsyncOption<never> = async.of (option.none)

export const some: {
  <A>(a: A): AsyncOption<A>
} = flow (option.some, async.of)

export const toPromise: {
  <A>(ma: AsyncOption<A>): Promise<option.Option<A>>
} = mma => mma ().then (identity, constant (option.none))

export const fromAsync: {
  <A>(ma: async.Async<A>): AsyncOption<A>
} = ma => () => ma ().then (option.some, () => option.none)

export const fromAsyncResult: {
  <E, A>(ma: asyncResult.AsyncResult<E, A>): AsyncOption<A>
} = ma => () =>
  ma ().then (
    result.match (constant (option.none), option.some),
    constant (option.none),
  )
