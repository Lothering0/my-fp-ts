import * as Monoid from './Monoid'
import * as Invariant_ from './Invariant'
import { Hkt } from './Hkt'
import { flow } from '../utils/flow'

export interface Group<Fixed> extends Monoid.Monoid<Fixed> {
  readonly inverse: (a: Fixed) => Fixed
}

export interface GroupHkt extends Hkt {
  readonly Type: Group<this['In']>
}

export const reverse: {
  <Fixed>(Group: Group<Fixed>): Group<Fixed>
} = Group => ({
  ...Group,
  ...Monoid.reverse(Group),
})

export const Invariant: Invariant_.Invariant<GroupHkt> = {
  imap: (ab, ba) => self => ({
    ...Monoid.imap(ab, ba)(self),
    inverse: flow(ba, self.inverse, ab),
  }),
}

export const imap: {
  <A, B>(ab: (a: A) => B, ba: (b: B) => A): (self: Group<A>) => Group<B>
} = Invariant.imap
