import * as Result from '../Result'
import * as Sync from '../Sync'
import { pipe } from '../../utils/flow'
import { execute, SyncResult } from './sync-result'

export const toUnion: {
  <A, E>(self: SyncResult<A, E>): Sync.Sync<A | E>
} = self => () => pipe(self, execute, Result.toUnion)
