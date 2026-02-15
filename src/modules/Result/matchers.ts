import { pipe } from '../../utils/flow'
import { isFailure } from './refinements'
import { Result } from './result'

export interface Matchers<A, B, E, C = B> {
  readonly onSuccess: (success: A) => B
  readonly onFailure: (failure: E) => C
}

export const match: {
  <A, B, E, C = B>(
    matchers: Matchers<A, B, E, C>,
  ): (result: Result<A, E>) => B | C
} = matchers => result =>
  isFailure(result)
    ? pipe(result.failure, matchers.onFailure)
    : pipe(result.success, matchers.onSuccess)
