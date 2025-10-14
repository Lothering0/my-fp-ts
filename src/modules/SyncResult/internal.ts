import * as Sync from '../Sync'
import * as Result from '../Result'

export const _SyncResult = Result.transform(Sync.Monad)
