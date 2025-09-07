import { pipe } from "../../utils/flow"
import { isFailure } from "./refinements"
import { Result } from "./result"

export interface Matchers<E, A, B, C = B> {
  readonly onFailure: (e: E) => B
  readonly onSuccess: (a: A) => C
}

export const match: {
  <E, A, B, C = B>(
    matchers: Matchers<E, A, B, C>,
  ): (self: Result<E, A>) => B | C
} = matchers => self =>
  isFailure (self)
    ? pipe (self.failure, matchers.onFailure)
    : pipe (self.success, matchers.onSuccess)
