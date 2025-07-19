import * as A from "../../types/Alt"
import { SyncOption, SyncOptionHKT, some } from "./sync-option"
import { identity } from "../Identity"
import { LazyArg } from "../../types/utils"
import { match } from "./utils"
import { overload } from "../../utils/overloads"
import { constant } from "../../utils/constant"

export const getOrElse: {
  <A, B>(onNone: LazyArg<B>): (self: SyncOption<A>) => A | B
  <A, B>(self: SyncOption<A>, onNone: LazyArg<B>): A | B
} = overload (1, <A, B>(self: SyncOption<A>, onNone: LazyArg<B>): A | B =>
  match (self, onNone, identity<A | B>),
)

export const orElse: {
  <A, B>(that: SyncOption<B>): (self: SyncOption<A>) => SyncOption<A | B>
  <A, B>(self: SyncOption<A>, that: SyncOption<B>): SyncOption<A | B>
} = overload (1, (self, that) => match (self, constant (that), some))

/** Lazy version of `orElse` */
export const catchAll: {
  <A, B>(
    that: LazyArg<SyncOption<B>>,
  ): (self: SyncOption<A>) => SyncOption<A | B>
  <A, B>(self: SyncOption<A>, that: LazyArg<SyncOption<B>>): SyncOption<A | B>
} = overload (1, (self, that) => match (self, that, some))

export const Alt: A.Alt<SyncOptionHKT> = {
  orElse,
}
