import { pipe } from "../../utils/flow"
import { identity } from "../Identity"
import { isFailure } from "./refinements"
import { Result, failure, Failure, success, Success } from "./result"

export const fromFailure: {
  <E>(self: Failure<E>): E
} = self => self.failure

export const fromSuccess: {
  <A>(self: Success<A>): A
} = self => self.success

export const match: {
  <E, A, B>(
    onFailure: (e: E) => B,
    onSuccess: (a: A) => B,
  ): (self: Result<E, A>) => B
} = (onFailure, onSuccess) => self =>
  isFailure (self)
    ? pipe (self, fromFailure, onFailure)
    : pipe (self, fromSuccess, onSuccess)

export const toUnion = <E, A>(self: Result<E, A>): E | A =>
  match<E, A, E | A> (identity, identity) (self)

export const swap = <E, A>(self: Result<E, A>): Result<A, E> =>
  match<E, A, Result<A, E>> (success, failure) (self)
