import * as Alt_ from "../../types/Alt"
import * as A from "../Async"
import * as AO from "./async-option"
import * as O from "../Option"
import { identity } from "../Identity"
import { LazyArg } from "../../types/utils"
import { match } from "./utils"
import { overload } from "../../utils/overloads"
import { constant } from "../../utils/constant"

export const getOrElse: {
  <A, B>(onNone: LazyArg<B>): (self: AO.AsyncOption<A>) => A.Async<A | B>
  <A, B>(self: AO.AsyncOption<A>, onNone: LazyArg<B>): A.Async<A | B>
} = overload (
  1,
  <A, B>(self: AO.AsyncOption<A>, onNone: LazyArg<B>): A.Async<A | B> =>
    match (self, onNone, identity<A | B>),
)

export const orElse: {
  <A, B>(
    that: AO.AsyncOption<B>,
  ): (self: AO.AsyncOption<A>) => AO.AsyncOption<A | B>
  <A, B>(
    self: AO.AsyncOption<A>,
    that: AO.AsyncOption<B>,
  ): AO.AsyncOption<A | B>
} = overload (1, (self, that) =>
  A.flatMap (self, O.match (constant (that), AO.some)),
)

/** Lazy version of `orElse` */
export const catchAll: {
  <A, B>(
    that: LazyArg<AO.AsyncOption<B>>,
  ): (self: AO.AsyncOption<A>) => AO.AsyncOption<A | B>
  <A, B>(
    self: AO.AsyncOption<A>,
    that: LazyArg<AO.AsyncOption<B>>,
  ): AO.AsyncOption<A | B>
} = overload (1, (self, that) => A.flatMap (self, O.match (that, AO.some)))

export const Alt: Alt_.Alt<AO.AsyncOptionHKT> = {
  orElse,
}
