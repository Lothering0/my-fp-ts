import * as S from "../Sync"
import * as O from "../Option"
import * as R from "../Result"
import { tryDo } from "../../utils/exceptions"
import { pipe } from "../../utils/flow"
import { HKT } from "../../types/HKT"

export interface SyncOptionHKT extends HKT {
  readonly type: SyncOption<this["_A"]>
}

export declare const _F: SyncOptionHKT

export interface SyncOption<A> extends S.Sync<O.Option<A>> {}

export const none: SyncOption<never> = () => O.none

export const some: {
  <A>(a: A): SyncOption<A>
} = a => () => O.some (a)

export const toSyncOption: {
  <A>(ma: S.Sync<A>): SyncOption<A>
} = ma => () =>
  pipe (
    ma,
    tryDo,
    R.match (() => O.none, O.some),
  )

export const fromSyncOption: {
  <A>(ma: SyncOption<A>): O.Option<A>
} = <A>(ma: SyncOption<A>) => {
  try {
    return ma ()
  } catch {
    return O.none
  }
}
