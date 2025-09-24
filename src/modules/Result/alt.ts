import * as alt from "../../typeclasses/Alt"
import { identity } from "../Identity"
import { Result, ResultHkt, succeed } from "./result"
import { match } from "./matchers"
import { constant } from "../../utils/constant"

export const getOrElse: {
  <E, B>(onFailure: (e: E) => B): <A>(self: Result<E, A>) => A | B
} = onFailure =>
  match ({
    onFailure,
    onSuccess: identity,
  })

export const orElse: {
  <E, A>(
    onFailure: Result<E, A>,
  ): <B>(self: Result<unknown, B>) => Result<E, A | B>
} = onFailure =>
  match ({
    onFailure: constant (onFailure),
    onSuccess: succeed,
  })

export const catchAll: {
  <E1, E2, B>(
    onFailure: (e: E1) => Result<E2, B>,
  ): <A>(self: Result<E1, A>) => Result<E2, A | B>
} = onFailure =>
  match ({
    onFailure,
    onSuccess: succeed,
  })

export const Alt: alt.Alt<ResultHkt> = {
  orElse,
}
