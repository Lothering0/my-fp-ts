import { Result, Failure, Success } from "./result"

export const isFailure: {
  <E>(self: Result<E, unknown>): self is Failure<E>
} = self => self._tag === "Failure"

export const isSuccess: {
  <A>(self: Result<unknown, A>): self is Success<A>
} = self => self._tag === "Success"
