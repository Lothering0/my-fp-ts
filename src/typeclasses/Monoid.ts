import * as Semigroup from './Semigroup'
import * as Invariant_ from './Invariant'
import { Hkt } from './Hkt'

export interface Monoid<S> extends Semigroup.Semigroup<S> {
  readonly empty: S
}

export interface MonoidHkt extends Hkt {
  readonly Type: Monoid<this['Fixed']>
}

export const reverse: {
  <S>(Monoid: Monoid<S>): Monoid<S>
} = Monoid => ({
  ...Monoid,
  ...Semigroup.reverse(Monoid),
})

export const combineAll: {
  <S>(Monoid: Monoid<S>): (as: Iterable<S>) => S
} = Monoid => Semigroup.combineAll(Monoid)(Monoid.empty)

export const Invariant: Invariant_.Invariant<MonoidHkt> = {
  imap: (st, ts) => self => ({
    ...Semigroup.imap(st, ts)(self),
    empty: st(self.empty),
  }),
}

export const imap: {
  <S, T>(st: (s: S) => T, ts: (t: T) => S): (self: Monoid<S>) => Monoid<T>
} = Invariant.imap
