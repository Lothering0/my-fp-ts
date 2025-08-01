import * as result from "../Result"
import * as sync from "../Sync"
import { HKT } from "../../types/HKT"
import { pipe } from "../../utils/flow"
import { tryDo } from "../../utils/exceptions"

export interface SyncResultHKT extends HKT {
  readonly type: SyncResult<this["_E"], this["_A"]>
}

export interface SyncResult<E, A> extends sync.Sync<result.Result<E, A>> {}

export const fail: {
  <E = never, A = never>(e: E): SyncResult<E, A>
} = e => () => result.fail (e)

export const failSync: {
  <E = never, A = never>(me: sync.Sync<E>): SyncResult<E, A>
} = me => () => pipe (me, sync.execute, result.fail)

export const succeed: {
  <E = never, A = never>(a: A): SyncResult<E, A>
} = a => () => result.succeed (a)

export const succeedSync: {
  <E = never, A = never>(ma: sync.Sync<A>): SyncResult<E, A>
} = ma => () => pipe (ma, sync.execute, result.succeed)

export const fromSync: {
  <E, A>(ma: sync.Sync<A>): SyncResult<E, A>
} = ma => () => tryDo (ma)

export const execute: {
  <E, A>(ma: SyncResult<E, A>): result.Result<E, A>
} = ma => {
  try {
    return ma ()
  } catch (exception) {
    return result.fail (exception)
  }
}
