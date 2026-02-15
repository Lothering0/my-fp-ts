import * as Alternative_ from '../../typeclasses/Alternative'
import { SyncOption, Hkt } from './sync-option'
import { _SyncOption } from './_internal'

export const zero: {
  <A = never>(): SyncOption<A>
} = _SyncOption.zero

export const Alternative: Alternative_.Alternative<Hkt> =
  _SyncOption.Alternative
