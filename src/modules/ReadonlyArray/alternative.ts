import * as Alternative_ from '../../typeclasses/Alternative'
import { Alt } from './alt'
import { ReadonlyArrayHkt } from './readonly-array'

export const zero: {
  <A>(): ReadonlyArray<A>
} = () => []

export const Alternative: Alternative_.Alternative<ReadonlyArrayHkt> = {
  ...Alt,
  zero,
}
