import * as Result from '../Result'
import { Effect } from './effect'
import { mapResult } from './functor'
import { pipe } from '../../utils/flow'

export const match: {
  <A, B, E, C = B>(
    matchers: Result.Matchers<A, B, E, C>,
  ): <R>(effect: Effect<A, E, R>) => Effect<B | C, never, R>
} = matchers =>
  mapResult(
    result => () => pipe(result, Result.match(matchers), Result.succeed),
  )
