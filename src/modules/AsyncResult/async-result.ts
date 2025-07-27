import * as async from "../Async"
import * as result from "../Result"
import * as sync from "../Sync"
import { identity } from "../Identity"
import { flow } from "../../utils/flow"
import { HKT } from "../../types/HKT"

export interface AsyncResultHKT extends HKT {
  readonly type: AsyncResult<this["_E"], this["_A"]>
}

export interface AsyncResult<E, A> extends async.Async<result.Result<E, A>> {}

export const failure: {
  <E = never, A = never>(e: E): AsyncResult<E, A>
} = flow (result.failure, async.of)

export const failureSync: {
  <E = never, A = never>(me: sync.Sync<E>): AsyncResult<E, A>
} = flow (sync.execute, failure)

export const failureAsync: {
  <E = never, A = never>(me: async.Async<E>): AsyncResult<E, A>
} = async.map (result.failure)

export const success: {
  <E = never, A = never>(a: A): AsyncResult<E, A>
} = flow (result.success, async.of)

export const successSync: {
  <E = never, A = never>(ma: sync.Sync<A>): AsyncResult<E, A>
} = flow (sync.execute, success)

export const successAsync: {
  <E = never, A = never>(me: async.Async<A>): AsyncResult<E, A>
} = async.map (result.success)

export const fromAsync: {
  <E, A>(ma: async.Async<A>): AsyncResult<E, A>
} = ma => () => ma ().then (result.success, result.failure)

export const toPromise: {
  <E, A>(ma: AsyncResult<E, A>): Promise<result.Result<E, A>>
} = mma => mma ().then (identity, result.failure)
