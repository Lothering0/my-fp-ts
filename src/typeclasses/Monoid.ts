import * as Semigroup from './Semigroup'

export interface Monoid<Fixed> extends Semigroup.Semigroup<Fixed> {
  readonly empty: Fixed
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
