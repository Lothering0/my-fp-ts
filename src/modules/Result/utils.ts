import { pipe } from "../../utils/flow"
import { identity } from "../Identity"
import { isFailure } from "./refinements"
import { Result, fail, Failure, succeed, Success } from "./result"

export const failure: {
  <E>(self: Failure<E>): E
} = self => self.failure

export const success: {
  <A>(self: Success<A>): A
} = self => self.success

export const match: {
  <E, A, B, C = B>(
    onFailure: (e: E) => B,
    onSuccess: (a: A) => C,
  ): (self: Result<E, A>) => B | C
} = (onFailure, onSuccess) => self =>
  isFailure (self)
    ? pipe (self, failure, onFailure)
    : pipe (self, success, onSuccess)

export const toUnion: {
  <A, E>(self: Result<A, E>): A | E
} = match (identity, identity)

export const swap: {
  <E, A>(self: Result<E, A>): Result<A, E>
} = match (succeed, fail)
