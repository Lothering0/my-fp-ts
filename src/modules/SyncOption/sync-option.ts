import * as S from "../Sync"
import * as O from "../Option"
import { tryDo } from "../../utils/exceptions"
import { pipe } from "../../utils/flow"
import { HKT } from "../../types/HKT"

export interface SyncOptionHKT extends HKT {
  readonly type: SyncOption<this["_A"]>
}

export interface SyncOption<A> extends S.Sync<O.Option<A>> {}

export const none: SyncOption<never> = O.zero

export const some: {
  <A>(a: A): SyncOption<A>
} = a => () => O.some (a)

export const fromSync: {
  <A>(ma: S.Sync<A>): SyncOption<A>
} = ma => () => pipe (ma, tryDo, O.fromResult)

export const execute: {
  <A>(ma: SyncOption<A>): O.Option<A>
} = <A>(ma: SyncOption<A>) => {
  try {
    return ma ()
  } catch {
    return O.none
  }
}
