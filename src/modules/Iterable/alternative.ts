import * as Alternative_ from '../../typeclasses/Alternative'
import { Alt } from './alt'
import { IterableHkt } from './iterable'
import { zero } from './utils'

export const Alternative: Alternative_.Alternative<IterableHkt> = {
  ...Alt,
  zero,
}
