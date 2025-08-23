import * as sync from "../Sync"
import * as option from "../Option"
import { tryDo } from "../../utils/exceptions"
import { pipe } from "../../utils/flow"
import { Hkt } from "../../types/Hkt"

export interface SyncOptionHkt extends Hkt {
  readonly type: SyncOption<this["_in"]>
}

export interface SyncOption<A> extends sync.Sync<option.Option<A>> {}

export const none: SyncOption<never> = option.zero

export const some: {
  <A>(a: A): SyncOption<A>
} = a => () => option.some (a)

export const fromSync: {
  <A>(ma: sync.Sync<A>): SyncOption<A>
} = ma => () => pipe (ma, tryDo, option.fromResult)

export const execute: {
  <A>(ma: SyncOption<A>): option.Option<A>
} = <A>(ma: SyncOption<A>) => {
  try {
    return ma ()
  } catch {
    return option.none
  }
}
