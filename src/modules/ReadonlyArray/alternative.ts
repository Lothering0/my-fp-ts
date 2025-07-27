import * as alternative from "../../types/Alternative"
import { Alt } from "./alt"
import { ReadonlyArrayHKT } from "./readonly-array"

export const zero: {
  <A>(): ReadonlyArray<A>
} = () => []

export const Alternative: alternative.Alternative<ReadonlyArrayHKT> = {
  ...Alt,
  zero,
}
