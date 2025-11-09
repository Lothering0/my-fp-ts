import * as Result from '../Result'
import { Effect } from './effect'
import { mapResult } from './functor'
import { pipe } from '../../utils/flow'

export const match: {
  <A, B, E, C = B>(
    matchers: Result.Matchers<A, B, E, C>,
  ): <R>(self: Effect<A, E, R>) => Effect<B | C, never, R>
} = matchers =>
  mapResult(ma => () => pipe(ma, Result.match(matchers), Result.succeed))
