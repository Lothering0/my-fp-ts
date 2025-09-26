import * as alternative from '../../typeclasses/Alternative'
import { Alt } from './alt'
import { IterableHkt } from './iterable'

export const zero: {
  <Out>(): Iterable<Out>
} = () => ({
  *[Symbol.iterator]() {},
})

export const Alternative: alternative.Alternative<IterableHkt> = {
  ...Alt,
  zero,
}
