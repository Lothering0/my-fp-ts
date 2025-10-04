import * as Alternative_ from '../../typeclasses/Alternative'
import { none, SyncOption, SyncOptionHkt } from './sync-option'
import { Alt } from './alt'

export const zero: {
  <A = never>(): SyncOption<A>
} = none

export const Alternative: Alternative_.Alternative<SyncOptionHkt> = {
  ...Alt,
  zero,
}
