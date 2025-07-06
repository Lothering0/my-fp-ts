import * as A from "../Async"
import * as R from "../Result"
import { identity } from "../Identity"
import { flow } from "../../utils/flow"
import { HKT } from "../../types/HKT"

export interface AsyncResultHKT extends HKT {
  readonly type: AsyncResult<this["_E"], this["_A"]>
}

export declare const _F: AsyncResultHKT

export interface AsyncResult<E, A> extends A.Async<R.Result<E, A>> {}

export const failure: {
  <E>(e: E): AsyncResult<E, never>
} = flow (R.failure, A.of)

export const success: {
  <A>(a: A): AsyncResult<never, A>
} = flow (R.success, A.of)

export const toAsyncResult: {
  <E, A>(ma: A.Async<A>): AsyncResult<E, A>
} = ma => () => ma ().then (R.success, R.failure)

export const fromAsyncResult: {
  <E, A>(ma: AsyncResult<E, A>): Promise<R.Result<E, A>>
} = mma => mma ().then (identity, R.failure)
