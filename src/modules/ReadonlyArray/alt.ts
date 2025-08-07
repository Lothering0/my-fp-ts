import * as alt from "../../types/Alt"
import { concat } from "./utils"
import { ReadonlyArrayHKT } from "./readonly-array"

export const orElse =
  <B>(that: ReadonlyArray<B>) =>
  <A>(self: ReadonlyArray<A>): ReadonlyArray<A | B> =>
    concat<A | B> (that) (self)

export const Alt: alt.Alt<ReadonlyArrayHKT> = {
  orElse,
}
