import { FromResult as FromResult_ } from '../../typeclasses/FromResult'
import { Result } from '../Result'
import { SyncResult, Hkt } from './sync-result'
import { _SyncResult } from './_internal'

export const FromResult: FromResult_<Hkt> = _SyncResult.FromResult

export const fromResult: {
  <A, E>(result: Result<A, E>): SyncResult<A, E>
} = FromResult.fromResult
