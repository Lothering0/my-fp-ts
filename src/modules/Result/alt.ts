import * as alt from "../../types/Alt"
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
/* export const getOrElse: {
  <E, B>(onFailure: (e: E) => B): <A>(self: Result<A, E>) => A | B
} = onFailure => match (onFailure, identity)

export const orElse: {
  <A, E1>(
    onFailure: Result<A, E1>,
  ): <B, E2>(self: Result<B, E2>) => Result<A | B, E1 | E2>
} = onFailure => match (constant (onFailure), succeed)

export const catchAll: {
  <B, E1, E2>(
    onFailure: (e: E1) => Result<B, E2>,
  ): <A>(self: Result<A, E1>) => Result<A | B, E2>
} = onFailure => match (onFailure, succeed) */

export const Alt: alt.Alt<ResultHkt> = {
  orElse,
}
