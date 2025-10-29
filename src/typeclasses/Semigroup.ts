import * as Magma from './Magma'
import * as Invariant_ from './Invariant'
import { Hkt } from './Hkt'
import { flow } from '../utils/flow'

/** Has an associative operation */
export interface Semigroup<S> extends Magma.Magma<S> {}

export interface SemigroupHkt extends Hkt {
  readonly Type: Semigroup<this['Fixed']>
}

export const reverse: {
  <S>(Semigroup: Semigroup<S>): Semigroup<S>
} = Magma.reverse

export const constant: {
  <S>(a: S): Semigroup<S>
} = Magma.constant

export const combineAll: {
  <S>(Semigroup: Semigroup<S>): (start: S) => (as: Iterable<S>) => S
} = Magma.combineAll

export const Invariant: Invariant_.Invariant<SemigroupHkt> = {
  imap: (st, ts) => self => ({
    combine: y => flow(ts, self.combine(ts(y)), st),
  }),
}

export const imap: {
  <S, T>(st: (s: S) => T, ts: (t: T) => S): (self: Semigroup<S>) => Semigroup<T>
} = Invariant.imap
