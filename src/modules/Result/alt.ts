import * as A from "../../types/Alt"
import { identity } from "../Identity"
import { Result, ResultHKT, success } from "./result"
import { match } from "./utils"
import { constant } from "../../utils/constant"
import { pipe } from "../../utils/flow"

export const getOrElse =
  <E, B>(onFailure: (e: E) => B) =>
  <A>(self: Result<E, A>): A | B =>
    match<E, A, A | B> (onFailure, identity) (self)

export const orElse =
  <E1, A>(onFailure: Result<E1, A>) =>
  <E2, B>(self: Result<E2, B>): Result<E1 | E2, A | B> =>
    match (constant (onFailure), success<E1 | E2, A | B>) (self)

export const catchAll =
  <E1, E2, B>(onFailure: (e: E1) => Result<E2, B>) =>
  <A>(self: Result<E1, A>): Result<E2, A | B> =>
    pipe (self, match (onFailure, success<E2, A | B>))

export const Alt: A.Alt<ResultHKT> = {
  orElse,
}
