import * as Sync from '../Sync'
import { SyncResult } from './sync-result'
import { _SyncResult } from './_internal'

export const toUnion: {
  <A, E>(syncResult: SyncResult<A, E>): Sync.Sync<A | E>
} = _SyncResult.toUnion
