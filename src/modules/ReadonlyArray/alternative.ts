import * as alternative from "../../typeclasses/Alternative"
import { Alt } from "./alt"
import { ReadonlyArrayHkt } from "./readonly-array"

export const zero: {
  <Out>(): ReadonlyArray<Out>
} = () => []

export const Alternative: alternative.Alternative<ReadonlyArrayHkt> = {
  ...Alt,
  zero,
}
