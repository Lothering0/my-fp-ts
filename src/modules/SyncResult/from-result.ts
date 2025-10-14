import { FromResult as FromResult_ } from '../../typeclasses/FromResult'
import { Result } from '../Result'
import { SyncResult, SyncResultHkt } from './sync-result'
import { _SyncResult } from './internal'

export const FromResult: FromResult_<SyncResultHkt> = _SyncResult.FromResult

export const fromResult: {
  <A, E>(ma: Result<A, E>): SyncResult<A, E>
} = FromResult.fromResult
