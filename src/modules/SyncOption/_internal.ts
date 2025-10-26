import * as Sync from '../Sync'
import * as Option from '../Option'

export const _SyncOption = Option.transform(Sync.Monad)
