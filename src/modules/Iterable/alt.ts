import * as alt from "../../typeclasses/Alt"
import { concat } from "./utils"
import { IterableHkt } from "./iterable"

export const orElse =
  <B>(that: Iterable<B>) =>
  <A>(self: Iterable<A>): Iterable<A | B> =>
    concat<A | B> (that) (self)

export const Alt: alt.Alt<IterableHkt> = {
  orElse,
}
