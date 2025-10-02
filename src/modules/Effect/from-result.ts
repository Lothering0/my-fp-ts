import { FromResult as FromResult_ } from '../../typeclasses/FromResult'
import { Result } from '../Result'
import { Effect, EffectHkt, fromSyncResult } from './effect'

export const FromResult: FromResult_<EffectHkt> = {
  fromResult: result => fromSyncResult(() => result),
}

export const fromResult: {
  <A, E>(result: Result<A, E>): Effect<A, E>
} = FromResult.fromResult
