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
