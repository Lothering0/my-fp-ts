import * as magma from "./Magma"

/** Has associative operation */
export interface Semigroup<Fixed> extends magma.Magma<Fixed> {}

export const reverse: {
  <Fixed>(Semigroup: Semigroup<Fixed>): Semigroup<Fixed>
} = magma.reverse

export const constant: {
  <Fixed>(a: Fixed): Semigroup<Fixed>
} = magma.constant

export const combineAll: {
  <Fixed>(
    Semigroup: Semigroup<Fixed>,
  ): (start: Fixed) => (as: Iterable<Fixed>) => Fixed
} = magma.combineAll
