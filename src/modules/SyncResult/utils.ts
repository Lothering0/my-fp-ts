import * as Sync from '../Sync'
import { SyncResult } from './sync-result'
import { _SyncResult } from './internal'

export const toUnion: {
  <A, E>(self: SyncResult<A, E>): Sync.Sync<A | E>
} = _SyncResult.toUnion
