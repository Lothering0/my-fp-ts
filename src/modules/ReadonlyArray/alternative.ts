import * as A from "../../types/Alternative"
import { Alt } from "./alt"
import { ReadonlyArrayHKT } from "./readonly-array"

export const zero: {
  <A>(): ReadonlyArray<A>
} = () => []

export const Alternative: A.Alternative<ReadonlyArrayHKT> = {
  ...Alt,
  zero,
}
