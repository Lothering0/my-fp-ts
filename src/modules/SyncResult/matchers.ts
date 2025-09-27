import * as Result from '../Result'
import * as Sync from '../Sync'
import { flow } from '../../utils/flow'
import { execute, SyncResult } from './sync-result'

export const match: {
  <Failure, In, Out1, Out2 = Out1>(
    matchers: Result.Matchers<Failure, In, Out1, Out2>,
  ): (self: SyncResult<Failure, In>) => Sync.Sync<Out1 | Out2>
} = matchers => flow(execute, Result.match(matchers), Sync.of)
