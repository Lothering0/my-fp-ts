import * as magma from "./Magma"

/** Has associative operation */
export interface Semigroup<Fixed> extends magma.Magma<Fixed> {}

export const reverse: {
  <Fixed>(Semigroup: Semigroup<Fixed>): Semigroup<Fixed>
} = magma.reverse
