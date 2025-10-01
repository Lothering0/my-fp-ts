import * as Alternative_ from '../../typeclasses/Alternative'
import { none, AsyncOption, AsyncOptionHkt } from './async-option'
import { constant } from '../../utils/constant'
import { Alt } from './alt'

export const zero: {
  <A = never>(): AsyncOption<A>
} = constant(none)

export const Alternative: Alternative_.Alternative<AsyncOptionHkt> = {
  ...Alt,
  zero,
}
