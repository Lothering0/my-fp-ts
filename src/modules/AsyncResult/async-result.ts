import * as async from "../Async"
import * as result from "../Result"
import * as sync from "../Sync"
import * as syncResult from "../SyncResult"
import { identity } from "../Identity"
import { flow, pipe } from "../../utils/flow"
import { Hkt } from "../../types/Hkt"

export interface AsyncResultHkt extends Hkt {
  readonly type: AsyncResult<this["_E"], this["_A"]>
}

export interface AsyncResult<E, A> extends async.Async<result.Result<E, A>> {}

export const fail: {
  <E>(e: E): AsyncResult<E, never>
} = flow (result.fail, async.of)

export const failSync: {
  <E>(me: sync.Sync<E>): AsyncResult<E, never>
} = flow (sync.execute, fail)

export const failAsync: {
  <E>(me: async.Async<E>): AsyncResult<E, never>
} = async.map (result.fail)

export const succeed: {
  <A>(a: A): AsyncResult<never, A>
} = flow (result.succeed, async.of)

export const succeedSync: {
  <A>(ma: sync.Sync<A>): AsyncResult<never, A>
} = flow (sync.execute, succeed)

export const succeedAsync: {
  <A>(me: async.Async<A>): AsyncResult<never, A>
} = async.map (result.succeed)

export const fromAsync: {
  <E, A>(ma: async.Async<A>): AsyncResult<E, A>
} = ma => () => ma ().then (result.succeed, result.fail)

export const fromResult: {
  <E, A>(ma: result.Result<E, A>): AsyncResult<E, A>
} = async.of

export const fromSyncResult: {
  <E, A>(mma: syncResult.SyncResult<E, A>): AsyncResult<E, A>
} = mma => () => pipe (mma, syncResult.execute, ma => Promise.resolve (ma))

export const toPromise: {
  <E, A>(ma: AsyncResult<E, A>): Promise<result.Result<E, A>>
} = mma => mma ().then (identity, result.fail)
