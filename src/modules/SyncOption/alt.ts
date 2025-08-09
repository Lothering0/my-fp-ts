import * as alt from "../../types/Alt"
import { SyncOption, SyncOptionHkt, some } from "./sync-option"
import { identity } from "../Identity"
import { LazyArg } from "../../types/utils"
import { match } from "./utils"
import { constant } from "../../utils/constant"

export const getOrElse: {
  <A>(onNone: LazyArg<A>): <B>(self: SyncOption<B>) => A | B
} = onNone => match (onNone, identity)

export const orElse: {
  <A>(that: SyncOption<A>): <B>(self: SyncOption<B>) => SyncOption<A | B>
} = that => match (constant (that), some)

/** Lazy version of `orElse` */
export const catchAll: {
  <A>(
    that: LazyArg<SyncOption<A>>,
  ): <B>(self: SyncOption<B>) => SyncOption<A | B>
} = that => match (that, some)

export const Alt: alt.Alt<SyncOptionHkt> = {
  orElse,
}
