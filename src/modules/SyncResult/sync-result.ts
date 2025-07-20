import * as R from "../Result"
import * as S from "../Sync"
import { tryDo } from "../../utils/exceptions"
import { HKT } from "../../types/HKT"

export interface SyncResultHKT extends HKT {
  readonly type: SyncResult<this["_E"], this["_A"]>
}

export declare const _F: SyncResultHKT

export interface SyncResult<E, A> extends S.Sync<R.Result<E, A>> {}

export const failure: {
  <E>(e: E): SyncResult<E, never>
} = e => () => R.failure (e)

export const success: {
  <A>(a: A): SyncResult<never, A>
} = a => () => R.success (a)

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
