import * as alt from "../../typeclasses/Alt"
import { concat } from "./utils"
import { ReadonlyArrayHkt } from "./readonly-array"

export const orElse =
  <Out>(that: ReadonlyArray<Out>) =>
  <In>(self: ReadonlyArray<In>): ReadonlyArray<In | Out> =>
    concat<In | Out> (that) (self)

export const Alt: alt.Alt<ReadonlyArrayHkt> = {
  orElse,
}
