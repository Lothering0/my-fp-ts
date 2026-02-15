import * as Alternative_ from '../../typeclasses/Alternative'
import { none, Option, Hkt } from './option'
import { Alt } from './alt'

export const zero: {
  <A = never>(): Option<A>
} = none

export const Alternative: Alternative_.Alternative<Hkt> = {
  ...Alt,
  zero,
}
