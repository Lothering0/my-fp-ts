import * as A from "../Async"
import * as R from "../Result"
import * as S from "../Sync"
import { identity } from "../Identity"
import { flow } from "../../utils/flow"
import { HKT } from "../../types/HKT"

export interface AsyncResultHKT extends HKT {
  readonly type: AsyncResult<this["_E"], this["_A"]>
}

export declare const _F: AsyncResultHKT

export interface AsyncResult<E, A> extends A.Async<R.Result<E, A>> {}

export const failure: {
  <E = never, A = never>(e: E): AsyncResult<E, A>
} = flow (R.failure, A.of)

export const failureSync: {
  <E = never, A = never>(me: S.Sync<E>): AsyncResult<E, A>
} = flow (S.execute, failure)

export const failureAsync: {
  <E = never, A = never>(me: A.Async<E>): AsyncResult<E, A>
} = A.map (R.failure)

export const success: {
  <E = never, A = never>(a: A): AsyncResult<E, A>
} = flow (R.success, A.of)

export const successSync: {
  <E = never, A = never>(ma: S.Sync<A>): AsyncResult<E, A>
} = flow (S.execute, success)

export const successAsync: {
  <E = never, A = never>(me: A.Async<A>): AsyncResult<E, A>
} = A.map (R.success)

export const fromAsync: {
  <E, A>(ma: A.Async<A>): AsyncResult<E, A>
} = ma => () => ma ().then (R.success, R.failure)

export const toPromise: {
  <E, A>(ma: AsyncResult<E, A>): Promise<R.Result<E, A>>
} = mma => mma ().then (identity, R.failure)
