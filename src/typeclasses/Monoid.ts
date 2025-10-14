import * as Semigroup from './Semigroup'
import * as Invariant_ from './Invariant'
import { Hkt } from './Hkt'

export interface Monoid<Fixed> extends Semigroup.Semigroup<Fixed> {
  readonly empty: Fixed
}

export interface MonoidHkt extends Hkt {
  readonly Type: Monoid<this['In']>
}

export const reverse: {
  <Fixed>(Monoid: Monoid<Fixed>): Monoid<Fixed>
} = Monoid => ({
  ...Monoid,
  ...Semigroup.reverse(Monoid),
})

export const combineAll: {
  <Fixed>(Monoid: Monoid<Fixed>): (as: Iterable<Fixed>) => Fixed
} = Monoid => Semigroup.combineAll(Monoid)(Monoid.empty)

export const Invariant: Invariant_.Invariant<MonoidHkt> = {
  imap: (ab, ba) => self => ({
    ...Semigroup.imap(ab, ba)(self),
    empty: ab(self.empty),
  }),
}

export const imap: {
  <A, B>(ab: (a: A) => B, ba: (b: B) => A): (self: Monoid<A>) => Monoid<B>
} = Invariant.imap
