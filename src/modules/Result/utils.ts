import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"
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

export const toUnion = <E, A>(self: Result<E, A>): E | A =>
  match<E, A, E | A> (self, identity, identity)

export const swap = <E, A>(self: Result<E, A>): Result<A, E> =>
  match<E, A, Result<A, E>> (self, success, failure)

export const getOrElse: {
  <E, A>(onFailure: (e: E) => A): (self: Result<E, A>) => A
  <E, A>(self: Result<E, A>, onFailure: (e: E) => A): A
} = overload (1, (self, onFailure) => match (self, onFailure, identity))

export const getOrElseW: {
  <E, A, B>(onFailure: (e: E) => B): (self: Result<E, A>) => A | B
  <E, A, B>(self: Result<E, A>, onFailure: (e: E) => B): A | B
} = getOrElse

export const orElse: {
  <E1, E2, A>(
    onFailure: (e: E1) => Result<E2, A>,
  ): (self: Result<E1, A>) => Result<E2, A>
  <E1, E2, A>(
    self: Result<E1, A>,
    onFailure: (e: E1) => Result<E2, A>,
  ): Result<E2, A>
} = overload (1, (self, onFailure) => match (self, onFailure, success))

export const orElseW: {
  <E1, E2, A, B>(
    onFailure: (e: E1) => Result<E2, B>,
  ): (self: Result<E1, A>) => Result<E2, A | B>
  <E1, E2, A, B>(
    self: Result<E1, A>,
    onFailure: (e: E1) => Result<E2, B>,
  ): Result<E2, A | B>
} = orElse
