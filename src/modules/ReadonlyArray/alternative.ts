import * as alternative from "../../typeclasses/Alternative"
import { Alt } from "./alt"
import { ReadonlyArrayHkt } from "./readonly-array"

export const zero: {
  <A>(): ReadonlyArray<A>
} = () => []

export const Alternative: alternative.Alternative<ReadonlyArrayHkt> = {
  ...Alt,
  zero,
}
