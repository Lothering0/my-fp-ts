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

export const fail: {
  <E = never, A = never>(e: E): AsyncResult<E, A>
} = flow (result.fail, async.of)

export const failSync: {
  <E = never, A = never>(me: sync.Sync<E>): AsyncResult<E, A>
} = flow (sync.execute, fail)

export const failAsync: {
  <E = never, A = never>(me: async.Async<E>): AsyncResult<E, A>
} = async.map (result.fail)

export const succeed: {
  <E = never, A = never>(a: A): AsyncResult<E, A>
} = flow (result.succeed, async.of)

export const succeedSync: {
  <E = never, A = never>(ma: sync.Sync<A>): AsyncResult<E, A>
} = flow (sync.execute, succeed)

export const succeedAsync: {
  <E = never, A = never>(me: async.Async<A>): AsyncResult<E, A>
} = async.map (result.succeed)

export const fromAsync: {
  <E, A>(ma: async.Async<A>): AsyncResult<E, A>
} = ma => () => ma ().then (result.succeed, result.fail)

export const toPromise: {
  <E, A>(ma: AsyncResult<E, A>): Promise<result.Result<E, A>>
} = mma => mma ().then (identity, result.fail)
