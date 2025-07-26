import * as Alt_ from "../../types/Alt"
import * as A from "../Async"
import * as AO from "./async-option"
import * as O from "../Option"
import { identity } from "../Identity"
import { LazyArg } from "../../types/utils"
import { match } from "./utils"
import { constant } from "../../utils/constant"

export const getOrElse =
  <A>(onNone: LazyArg<A>) =>
  <B>(self: AO.AsyncOption<B>): A.Async<A | B> =>
    match (onNone, identity<A | B>) (self)

export const orElse =
  <A>(that: AO.AsyncOption<A>) =>
  <B>(self: AO.AsyncOption<B>): AO.AsyncOption<A | B> =>
    A.flatMap (O.match (constant (that), AO.some<A | B>)) (self)

/** Lazy version of `orElse` */
export const catchAll =
  <A>(that: LazyArg<AO.AsyncOption<A>>) =>
  <B>(self: AO.AsyncOption<B>): AO.AsyncOption<A | B> =>
    A.flatMap (O.match (that, AO.some<A | B>)) (self)

export const Alt: Alt_.Alt<AO.AsyncOptionHKT> = {
  orElse,
}
