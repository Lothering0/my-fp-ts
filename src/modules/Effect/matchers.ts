import * as Result from '../Result'
import { Effect } from './effect'
import { mapResult } from './functor'
import { flow } from '../../utils/flow'

export const match: {
  <A, B, E, C = B>(
    matchers: Result.Matchers<A, B, E, C>,
  ): (self: Effect<A, E>) => Effect<B | C>
} = matchers => mapResult(flow(Result.match(matchers), Result.succeed))
