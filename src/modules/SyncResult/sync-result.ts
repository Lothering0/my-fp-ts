import * as result from "../Result"
import * as sync from "../Sync"
import { HKT } from "../../types/HKT"
import { pipe } from "../../utils/flow"
import { tryDo } from "../../utils/exceptions"

export interface SyncResultHKT extends HKT {
  readonly type: SyncResult<this["_E"], this["_A"]>
}

export interface SyncResult<E, A> extends sync.Sync<result.Result<E, A>> {}

export const failure: {
  <E = never, A = never>(e: E): SyncResult<E, A>
} = e => () => result.failure (e)

export const failureSync: {
  <E = never, A = never>(me: sync.Sync<E>): SyncResult<E, A>
} = me => () => pipe (me, sync.execute, result.failure)

export const success: {
  <E = never, A = never>(a: A): SyncResult<E, A>
} = a => () => result.success (a)

export const successSync: {
  <E = never, A = never>(ma: sync.Sync<A>): SyncResult<E, A>
} = ma => () => pipe (ma, sync.execute, result.success)

export const fromSync: {
  <E, A>(ma: sync.Sync<A>): SyncResult<E, A>
} = ma => () => tryDo (ma)

export const execute: {
  <E, A>(ma: SyncResult<E, A>): result.Result<E, A>
} = ma => {
  try {
    return ma ()
  } catch (exception) {
    return result.failure (exception)
  }
}
