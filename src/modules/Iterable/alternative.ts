import * as Alternative_ from '../../typeclasses/Alternative'
import { Alt } from './alt'
import { Hkt } from './iterable'
import { zero } from './utils'

export const Alternative: Alternative_.Alternative<Hkt> = {
  ...Alt,
  zero,
}
