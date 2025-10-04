import * as Alternative_ from '../../typeclasses/Alternative'
import { none, AsyncOption, AsyncOptionHkt } from './async-option'
import { Alt } from './alt'

export const zero: {
  <A = never>(): AsyncOption<A>
} = none

export const Alternative: Alternative_.Alternative<AsyncOptionHkt> = {
  ...Alt,
  zero,
}
