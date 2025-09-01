import * as result from "../Result"
import * as sync from "../Sync"
import { Hkt } from "../../typeclasses/Hkt"
import { pipe } from "../../utils/flow"
import { tryDo } from "../../utils/exceptions"

export interface SyncResultHkt extends Hkt {
  readonly type: SyncResult<this["_collectable"], this["_in"]>
}

export interface SyncResult<E, A> extends sync.Sync<result.Result<E, A>> {}

export const fail: {
  <E>(e: E): SyncResult<E, never>
} = e => () => result.fail (e)

export const failSync: {
  <E>(me: sync.Sync<E>): SyncResult<E, never>
} = me => () => pipe (me, sync.execute, result.fail)

export const succeed: {
  <A>(a: A): SyncResult<never, A>
} = a => () => result.succeed (a)

export const succeedSync: {
  <A>(ma: sync.Sync<A>): SyncResult<never, A>
} = ma => () => pipe (ma, sync.execute, result.succeed)

export const fromSync: {
  <E, A>(ma: sync.Sync<A>): SyncResult<E, A>
} = ma => () => tryDo (ma)

export const fromResult: {
  <E, A>(result: result.Result<E, A>): SyncResult<E, A>
} = sync.of

export const execute: {
  <E, A>(ma: SyncResult<E, A>): result.Result<E, A>
} = ma => {
  try {
    return ma ()
  } catch (exception) {
    return result.fail (exception)
  }
}
