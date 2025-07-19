import * as A from "../../types/Alt"
import { identity } from "../Identity"
import { Result, ResultHKT, success } from "./result"
import { match } from "./utils"
import { constant } from "../../utils/constant"
import { overload } from "../../utils/overloads"

export const getOrElse: {
  <E, A, B>(onFailure: (e: E) => B): (self: Result<E, A>) => A | B
  <E, A, B>(self: Result<E, A>, onFailure: (e: E) => B): A | B
} = overload (1, (self, onFailure) => match (self, onFailure, identity))

export const orElse: {
  <E1, E2, A>(onFailure: Result<E2, A>): (self: Result<E1, A>) => Result<E2, A>
  <E1, E2, A>(self: Result<E1, A>, onFailure: Result<E2, A>): Result<E2, A>
} = overload (1, (self, onFailure) => match (self, constant (onFailure), success))

export const catchAll: {
  <E1, E2, A, B>(
    onFailure: (e: E1) => Result<E2, B>,
  ): (self: Result<E1, A>) => Result<E2, A | B>
  <E1, E2, A, B>(
    self: Result<E1, A>,
    onFailure: (e: E1) => Result<E2, B>,
  ): Result<E2, A | B>
} = overload (1, (self, onFailure) => match (self, onFailure, success))

export const Alt: A.Alt<ResultHKT> = {
  orElse,
}
