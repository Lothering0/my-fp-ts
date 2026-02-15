import * as Result from '../Result'
import * as Sync from '../Sync'
import { SyncResult } from './sync-result'
import { _SyncResult } from './_internal'

export const match: {
  <A, B, E, C = B>(
    matchers: Result.Matchers<A, B, E, C>,
  ): (syncResult: SyncResult<A, E>) => Sync.Sync<B | C>
} = _SyncResult.match
