import * as Result from '../Result'
import * as Sync from '../Sync'
import { pipe } from '../../utils/flow'
import { execute, SyncResult } from './sync-result'

export const toUnion: {
  <E, A>(self: SyncResult<E, A>): Sync.Sync<E | A>
} = self => () => pipe(self, execute, Result.toUnion)
