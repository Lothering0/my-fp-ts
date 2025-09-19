import { Result, Failure, Success } from "./result"
import { isRecord } from "../../utils/typeChecks"

export const isFailure: {
  <E>(self: Result<E, unknown>): self is Failure<E>
} = self => self._tag === "Failure"

export const isSuccess: {
  <A>(self: Result<unknown, A>): self is Success<A>
} = self => self._tag === "Success"

export const isResult = (x: unknown): x is Result<unknown, unknown> =>
  isRecord (x) &&
  (isFailure (x as unknown as Result<unknown, unknown>) ||
    isSuccess (x as unknown as Result<unknown, unknown>))
