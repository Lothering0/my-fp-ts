import { Result, Failure, Success } from "./result"
import { isRecord } from "../../utils/typeChecks"

export const isResult = (x: unknown): x is Result<unknown, unknown> =>
  isRecord (x) && x._id === "Result"

export const isFailure: {
  <E>(self: Result<E, unknown>): self is Failure<E>
} = self => self._tag === "Failure"

export const isSuccess: {
  <A>(self: Result<unknown, A>): self is Success<A>
} = self => self._tag === "Success"
