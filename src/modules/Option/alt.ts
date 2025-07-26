import * as A from "../../types/Alt"
import { some, Option, OptionHKT } from "./option"
import { identity } from "../Identity"
import { LazyArg } from "../../types/utils"
import { match } from "./utils"
import { constant } from "../../utils/constant"

export const getOrElse =
  <B>(onNone: LazyArg<B>) =>
  <A>(self: Option<A>): A | B =>
    match (onNone, identity<A | B>) (self)

export const orElse =
  <B>(that: Option<B>) =>
  <A>(self: Option<A>): Option<A | B> =>
    match (constant (that), some<A | B>) (self)

/** Lazy version of `orElse` */
export const catchAll =
  <B>(that: LazyArg<Option<B>>) =>
  <A>(self: Option<A>): Option<A | B> =>
    match (that, some<A | B>) (self)

export const Alt: A.Alt<OptionHKT> = {
  orElse,
}
