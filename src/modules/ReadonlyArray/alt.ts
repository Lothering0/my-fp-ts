import * as A from "../../types/Alt"
import { concat } from "./semigroup"
import { ReadonlyArrayHKT } from "./readonly-array"

export const orElse: {
  <A, B>(
    that: ReadonlyArray<B>,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<A | B>
  <A, B>(self: ReadonlyArray<A>, that: ReadonlyArray<B>): ReadonlyArray<A | B>
} = concat

export const Alt: A.Alt<ReadonlyArrayHKT> = {
  orElse,
}
