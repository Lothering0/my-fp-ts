import * as Magma from './Magma'
import * as Invariant_ from './Invariant'
import { Hkt } from './Hkt'
import { flow } from '../utils/flow'

/** Has an associative operation */
export interface Semigroup<Fixed> extends Magma.Magma<Fixed> {}

export interface SemigroupHkt extends Hkt {
  readonly Type: Semigroup<this['In']>
}

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

export const Invariant: Invariant_.Invariant<SemigroupHkt> = {
  imap: (ab, ba) => self => ({
    combine: y => flow(ba, self.combine(ba(y)), ab),
  }),
}

export const imap: {
  <A, B>(ab: (a: A) => B, ba: (b: B) => A): (self: Semigroup<A>) => Semigroup<B>
} = Invariant.imap
