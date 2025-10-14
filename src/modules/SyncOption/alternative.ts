import * as Alternative_ from '../../typeclasses/Alternative'
import { SyncOption, SyncOptionHkt } from './sync-option'
import { _SyncOption } from './internal'

export const zero: {
  <A = never>(): SyncOption<A>
} = _SyncOption.zero

export const Alternative: Alternative_.Alternative<SyncOptionHkt> =
  _SyncOption.Alternative
