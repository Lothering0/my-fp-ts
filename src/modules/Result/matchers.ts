import { pipe } from '../../utils/flow'
import { isFailure } from './refinements'
import { Result } from './result'

export interface Matchers<Failure, In, Out1, Out2 = Out1> {
  readonly onFailure: (failure: Failure) => Out1
  readonly onSuccess: (success: In) => Out2
}

export const match: {
  <Failure, In, Out1, Out2 = Out1>(
    matchers: Matchers<Failure, In, Out1, Out2>,
  ): (self: Result<Failure, In>) => Out1 | Out2
} = matchers => self =>
  isFailure(self)
    ? pipe(self.failure, matchers.onFailure)
    : pipe(self.success, matchers.onSuccess)
