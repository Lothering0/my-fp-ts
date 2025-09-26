import * as result from '../Result'
import { Async } from '../Async'
import { toPromise, AsyncResult } from './async-result'

export interface Matchers<Failure, In, Out1, Out2 = Out1> {
  readonly onFailure: (failure: Failure) => Out1
  readonly onSuccess: (success: In) => Out2
}

export const match: {
  <Failure, In, Out1, Out2 = Out1>(
    matchers: Matchers<Failure, In, Out1, Out2>,
  ): (self: AsyncResult<Failure, In>) => Async<Out1 | Out2>
} = matchers => self => () => toPromise(self).then(result.match(matchers))
