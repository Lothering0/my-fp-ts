import * as R from "../Result"
import * as S from "../Sync"
import { HKT } from "../../types/HKT"
import { pipe } from "../../utils/flow"
import { tryDo } from "../../utils/exceptions"

export interface SyncResultHKT extends HKT {
  readonly type: SyncResult<this["_E"], this["_A"]>
}

export interface SyncResult<E, A> extends S.Sync<R.Result<E, A>> {}

export const failure: {
  <E = never, A = never>(e: E): SyncResult<E, A>
} = e => () => R.failure (e)

export const failureSync: {
  <E = never, A = never>(me: S.Sync<E>): SyncResult<E, A>
} = me => () => pipe (me, S.execute, R.failure)

export const success: {
  <E = never, A = never>(a: A): SyncResult<E, A>
} = a => () => R.success (a)

export const successSync: {
  <E = never, A = never>(ma: S.Sync<A>): SyncResult<E, A>
} = ma => () => pipe (ma, S.execute, R.success)

export const fromSync: {
  <E, A>(ma: S.Sync<A>): SyncResult<E, A>
} = ma => () => tryDo (ma)

export const execute: {
  <E, A>(ma: SyncResult<E, A>): R.Result<E, A>
} = ma => {
  try {
    return ma ()
  } catch (exception) {
    return R.failure (exception)
  }
}
