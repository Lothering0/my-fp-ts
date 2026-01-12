import * as Alternative_ from '../../typeclasses/Alternative'
import * as Array from './readonly-array'
import { Alt } from './alt'

export const zero: {
  <A>(): ReadonlyArray<A>
} = () => []

export const Alternative: Alternative_.Alternative<Array.Hkt> = {
  ...Alt,
  zero,
}
