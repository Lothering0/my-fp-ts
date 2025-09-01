import * as monoid from "./Monoid"

export interface Group<Fixed> extends monoid.Monoid<Fixed> {
  readonly inverse: (a: Fixed) => Fixed
}

export const reverse: {
  <Fixed>(Group: Group<Fixed>): Group<Fixed>
} = Group => ({
  ...Group,
  ...monoid.reverse (Group),
})
