import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"
import { Result, failure, Failure, success, Success } from "./result"

export const isFailure: {
  <E>(self: Result<E, unknown>): self is Failure<E>
} = self => self._tag === "Failure"

export const isSuccess: {
  <A>(self: Result<unknown, A>): self is Success<A>
} = self => self._tag === "Success"

export const fromFailure: {
  <E>(self: Failure<E>): E
} = self => self.failure

export const fromSuccess: {
  <A>(self: Success<A>): A
} = self => self.success

export const toUnion: {
  <E, A>(self: Result<E, A>): E | A
} = self => isFailure (self) ? self.failure : self.success

export const match: {
  <E, A, B>(
    onFailure: (e: E) => B,
    onSuccess: (a: A) => B,
  ): (self: Result<E, A>) => B
  <E, A, B>(
    self: Result<E, A>,
    onFailure: (e: E) => B,
    onSuccess: (a: A) => B,
  ): B
} = overload (
  2,
  <E, A, B>(
    self: Result<E, A>,
    onFailure: (e: E) => B,
    onSuccess: (a: A) => B,
  ) =>
    isFailure (self)
      ? pipe (self, fromFailure, onFailure)
      : pipe (self, fromSuccess, onSuccess),
)

export const swap = <E, A>(self: Result<E, A>): Result<A, E> =>
  match<E, A, Result<A, E>> (self, success, failure)
