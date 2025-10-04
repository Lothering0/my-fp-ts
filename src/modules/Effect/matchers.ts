import { flow, pipe } from '../../utils/flow'
import * as Result from '../Result'
import { Effect, toEffect } from './effect'

export const match: {
  <A, B, E, C = B>(
    matchers: Result.Matchers<A, B, E, C>,
  ): (self: Effect<A, E>) => Effect<B | C>
} = matchers => self =>
  toEffect(() => {
    const result = self.effect()
    if (result instanceof Promise) {
      return result.then(flow(Result.match(matchers), Result.succeed))
    }
    return pipe(result, Result.match(matchers), Result.succeed)
  })
