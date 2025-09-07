import * as alt from "../../typeclasses/Alt"
import { some, Option, OptionHkt } from "./option"
import { identity } from "../Identity"
import { LazyArg } from "../../types/utils"
import { match } from "./matchers"
import { constant } from "../../utils/constant"

export const getOrElse: {
  <B>(onNone: LazyArg<B>): <A>(self: Option<A>) => A | B
} = onNone =>
  match ({
    onNone,
    onSome: identity,
  })

export const orElse: {
  <B>(that: Option<B>): <A>(self: Option<A>) => Option<A | B>
} = that =>
  match ({
    onNone: constant (that),
    onSome: some,
  })

/** Lazy version of `orElse` */
export const catchAll: {
  <B>(that: LazyArg<Option<B>>): <A>(self: Option<A>) => Option<A | B>
} = that =>
  match ({
    onNone: that,
    onSome: some,
  })

export const Alt: alt.Alt<OptionHkt> = {
  orElse,
}
