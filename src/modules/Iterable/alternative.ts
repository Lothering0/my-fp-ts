import * as Alternative_ from '../../typeclasses/Alternative'
import { Alt } from './alt'
import { IterableHkt } from './iterable'

export const zero: {
  <Out>(): Iterable<Out>
} = () => ({
  *[Symbol.iterator]() {},
})

export const Alternative: Alternative_.Alternative<IterableHkt> = {
  ...Alt,
  zero,
}
