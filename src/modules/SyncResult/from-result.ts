import * as Sync from '../Sync'
import { FromResult as FromResult_ } from '../../typeclasses/FromResult'
import { Result } from '../Result'
import { SyncResult, SyncResultHkt } from './sync-result'

export const FromResult: FromResult_<SyncResultHkt> = {
  fromResult: Sync.of,
}

export const fromResult: {
  <A, E>(ma: Result<A, E>): SyncResult<A, E>
} = FromResult.fromResult
