import * as Monoid from './Monoid'

export interface Group<Fixed> extends Monoid.Monoid<Fixed> {
  readonly inverse: (a: Fixed) => Fixed
}

export const reverse: {
  <Fixed>(Group: Group<Fixed>): Group<Fixed>
} = Group => ({
  ...Group,
  ...Monoid.reverse(Group),
})
