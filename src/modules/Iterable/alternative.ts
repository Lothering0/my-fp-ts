import * as alternative from "../../typeclasses/Alternative"
import { Alt } from "./alt"
import { IterableHkt } from "./iterable"

export const zero: {
  <A>(): Iterable<A>
} = () => ({
  *[Symbol.iterator]() {},
})

export const Alternative: alternative.Alternative<IterableHkt> = {
  ...Alt,
  zero,
}
