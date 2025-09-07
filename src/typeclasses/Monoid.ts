import * as semigroup from "./Semigroup"

export interface Monoid<Fixed> extends semigroup.Semigroup<Fixed> {
  readonly empty: Fixed
}

export const reverse: {
  <Fixed>(Monoid: Monoid<Fixed>): Monoid<Fixed>
} = Monoid => ({
  ...Monoid,
  ...semigroup.reverse (Monoid),
})

export const combineAll: {
  <Fixed>(Monoid: Monoid<Fixed>): (as: ReadonlyArray<Fixed>) => Fixed
} = Monoid => semigroup.combineAll (Monoid) (Monoid.empty)
