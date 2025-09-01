import * as alt from "../../typeclasses/Alt"
import { concat } from "./utils"
import { ReadonlyArrayHkt } from "./readonly-array"

export const orElse =
  <B>(that: ReadonlyArray<B>) =>
  <A>(self: ReadonlyArray<A>): ReadonlyArray<A | B> =>
    concat<A | B> (that) (self)

export const Alt: alt.Alt<ReadonlyArrayHkt> = {
  orElse,
}
