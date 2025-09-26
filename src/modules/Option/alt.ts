import * as alt from "../../typeclasses/Alt"
import { some, Option, OptionHkt } from "./option"
import { identity } from "../Identity"
import { LazyArg } from "../../types/utils"
import { match } from "./matchers"
import { constant } from "../../utils/constant"

export const getOrElse: {
  <Out>(onNone: LazyArg<Out>): <In>(self: Option<In>) => In | Out
} = onNone =>
  match ({
    onNone,
    onSome: identity,
  })

export const orElse: {
  <Out>(that: Option<Out>): <In>(self: Option<In>) => Option<In | Out>
} = that =>
  match ({
    onNone: constant (that),
    onSome: some,
  })

/** Lazy version of `orElse` */
export const catchAll: {
  <Out>(that: LazyArg<Option<Out>>): <In>(self: Option<In>) => Option<In | Out>
} = that =>
  match ({
    onNone: that,
    onSome: some,
  })

export const Alt: alt.Alt<OptionHkt> = {
  orElse,
}
