import * as Magma from './Magma'

/** Has an associative operation */
export interface Semigroup<Fixed> extends Magma.Magma<Fixed> {}

export const reverse: {
  <Fixed>(Semigroup: Semigroup<Fixed>): Semigroup<Fixed>
} = Magma.reverse

export const constant: {
  <Fixed>(a: Fixed): Semigroup<Fixed>
} = Magma.constant

export const combineAll: {
  <Fixed>(
    Semigroup: Semigroup<Fixed>,
  ): (start: Fixed) => (as: Iterable<Fixed>) => Fixed
} = Magma.combineAll
