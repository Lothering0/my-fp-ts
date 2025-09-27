import * as Result from '../Result'
import * as Sync from '../Sync'
import { flow } from '../../utils/flow'
import { execute, SyncResult } from './sync-result'

export const match: {
  <A, B, E, C = B>(
    matchers: Result.Matchers<A, B, E, C>,
  ): (self: SyncResult<A, E>) => Sync.Sync<B | C>
} = matchers => flow(execute, Result.match(matchers), Sync.of)
