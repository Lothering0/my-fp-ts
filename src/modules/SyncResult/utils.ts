import * as result from '../Result'
import * as sync from '../Sync'
import { pipe } from '../../utils/flow'
import { execute, SyncResult } from './sync-result'

export const toUnion: {
  <E, A>(self: SyncResult<E, A>): sync.Sync<E | A>
} = self => () => pipe(self, execute, result.toUnion)
