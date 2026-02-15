import { FromResult as FromResult_ } from '../../typeclasses/FromResult'
import { Result } from '../Result'
import { Effect, Hkt, fromSyncResult } from './effect'

export const FromResult: FromResult_<Hkt> = {
  fromResult: result => fromSyncResult(() => result),
}

export const fromResult: {
  <A, E>(result: Result<A, E>): Effect<A, E>
} = FromResult.fromResult
