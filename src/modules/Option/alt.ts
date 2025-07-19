import * as A from "../../types/Alt"
import { some, Option, OptionHKT } from "./option"
import { identity } from "../Identity"
import { LazyArg } from "../../types/utils"
import { match } from "./utils"
import { overload } from "../../utils/overloads"
import { constant } from "../../utils/constant"

export const getOrElse: {
  <A, B>(onNone: LazyArg<B>): (self: Option<A>) => A | B
  <A, B>(self: Option<A>, onNone: LazyArg<B>): A | B
} = overload (1, <A, B>(self: Option<A>, onNone: LazyArg<B>): A | B =>
  match (self, onNone, identity<A | B>),
)

export const orElse: {
  <A, B>(that: Option<B>): (self: Option<A>) => Option<A | B>
  <A, B>(self: Option<A>, that: Option<B>): Option<A | B>
} = overload (1, (self, that) => match (self, constant (that), some))

/** Lazy version of `orElse` */
export const catchAll: {
  <A, B>(that: LazyArg<Option<B>>): (self: Option<A>) => Option<A | B>
  <A, B>(self: Option<A>, that: LazyArg<Option<B>>): Option<A | B>
} = overload (1, (self, that) => match (self, that, some))

export const Alt: A.Alt<OptionHKT> = {
  orElse,
}
