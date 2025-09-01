import * as alt from "../../typeclasses/Alt"
import { identity } from "../Identity"
import { Result, ResultHkt, succeed } from "./result"
import { match } from "./utils"
import { constant } from "../../utils/constant"

export const getOrElse: {
  <E, B>(onFailure: (e: E) => B): <A>(self: Result<E, A>) => A | B
} = onFailure => match (onFailure, identity)

export const orElse: {
  <E1, A>(
    onFailure: Result<E1, A>,
  ): <E2, B>(self: Result<E2, B>) => Result<E1 | E2, A | B>
} = onFailure => match (constant (onFailure), succeed)

export const catchAll: {
  <E1, E2, B>(
    onFailure: (e: E1) => Result<E2, B>,
  ): <A>(self: Result<E1, A>) => Result<E2, A | B>
} = onFailure => match (onFailure, succeed)

export const Alt: alt.Alt<ResultHkt> = {
  orElse,
}
