import * as Semigroup from './Semigroup'
import * as Invariant_ from './Invariant'
import { Hkt as Hkt_ } from './Hkt'

export interface Monoid<S> extends Semigroup.Semigroup<S> {
  readonly empty: S
}

export interface Hkt extends Hkt_ {
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

export const Invariant: Invariant_.Invariant<Hkt> = {
  imap: (st, ts) => self => ({
    ...Semigroup.imap(st, ts)(self),
    empty: st(self.empty),
  }),
}

export const imap: {
  <S, T>(st: (s: S) => T, ts: (t: T) => S): (self: Monoid<S>) => Monoid<T>
} = Invariant.imap
