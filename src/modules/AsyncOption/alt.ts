import * as alt from "../../types/Alt"
import * as async from "../Async"
import * as asyncOption from "./async-option"
import * as option from "../Option"
import { identity } from "../Identity"
import { LazyArg } from "../../types/utils"
import { match } from "./utils"
import { constant } from "../../utils/constant"

export const getOrElse: {
  <A>(
    onNone: LazyArg<A>,
  ): <B>(self: asyncOption.AsyncOption<B>) => async.Async<A | B>
} = onNone => match (onNone, identity)

export const orElse =
  <A>(that: asyncOption.AsyncOption<A>) =>
  <B>(self: asyncOption.AsyncOption<B>): asyncOption.AsyncOption<A | B> =>
    async.flatMap (option.match (constant (that), asyncOption.some<A | B>)) (self)

/** Lazy version of `orElse` */
export const catchAll =
  <A>(that: LazyArg<asyncOption.AsyncOption<A>>) =>
  <B>(self: asyncOption.AsyncOption<B>): asyncOption.AsyncOption<A | B> =>
    async.flatMap (option.match (that, asyncOption.some<A | B>)) (self)

export const Alt: alt.Alt<asyncOption.AsyncOptionHKT> = {
  orElse,
}
