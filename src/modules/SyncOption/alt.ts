import * as A from "../../types/Alt"
import { SyncOption, SyncOptionHKT, some } from "./sync-option"
import { identity } from "../Identity"
import { LazyArg } from "../../types/utils"
import { match } from "./utils"
import { constant } from "../../utils/constant"

export const getOrElse =
  <A>(onNone: LazyArg<A>) =>
  <B>(self: SyncOption<B>): A | B =>
    match (onNone, identity<A | B>) (self)

export const orElse =
  <A>(that: SyncOption<A>) =>
  <B>(self: SyncOption<B>): SyncOption<A | B> =>
    match (constant (that), some<A | B>) (self)

/** Lazy version of `orElse` */
export const catchAll =
  <A>(that: LazyArg<SyncOption<A>>) =>
  <B>(self: SyncOption<B>): SyncOption<A | B> =>
    match (that, some<A | B>) (self)

export const Alt: A.Alt<SyncOptionHKT> = {
  orElse,
}
