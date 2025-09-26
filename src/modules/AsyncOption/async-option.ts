import * as async from "../Async"
import * as asyncResult from "../AsyncResult"
import * as result from "../Result"
import * as option from "../Option"
import { Hkt } from "../../typeclasses/Hkt"
import { identity } from "../Identity"
import { constant } from "../../utils/constant"
import { flow } from "../../utils/flow"

export interface AsyncOptionHkt extends Hkt {
  readonly Type: AsyncOption<this["In"]>
}

export interface AsyncOption<A> extends async.Async<option.Option<A>> {}

export const none: AsyncOption<never> = async.of (option.none)

export const some: {
  <Out>(a: Out): AsyncOption<Out>
} = flow (option.some, async.of)

export const toPromise: {
  <Out>(ma: AsyncOption<Out>): Promise<option.Option<Out>>
} = mma => mma ().then (identity, constant (option.none))

export const fromAsync: {
  <Out>(ma: async.Async<Out>): AsyncOption<Out>
} = ma => () => ma ().then (option.some, () => option.none)

export const fromAsyncResult: {
  <Collectable, Out>(
    ma: asyncResult.AsyncResult<Collectable, Out>,
  ): AsyncOption<Out>
} = ma => () =>
  ma ().then (
    result.match ({
      onFailure: constant (option.none),
      onSuccess: option.some,
    }),
    constant (option.none),
  )
