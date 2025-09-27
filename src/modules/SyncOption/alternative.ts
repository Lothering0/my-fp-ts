import * as Alternative_ from '../../typeclasses/Alternative'
import { none, SyncOption, SyncOptionHkt } from './sync-option'
import { constant } from '../../utils/constant'
import { Alt } from './alt'

export const zero: {
  <Out = never>(): SyncOption<Out>
} = constant(none)

export const Alternative: Alternative_.Alternative<SyncOptionHkt> = {
  ...Alt,
  zero,
}
