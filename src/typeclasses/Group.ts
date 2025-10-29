import * as Monoid from './Monoid'
import * as Invariant_ from './Invariant'
import { Hkt } from './Hkt'
import { flow } from '../utils/flow'

export interface Group<S> extends Monoid.Monoid<S> {
  readonly inverse: (s: S) => S
}

export interface GroupHkt extends Hkt {
  readonly Type: Group<this['Fixed']>
}

export const reverse: {
  <S>(Group: Group<S>): Group<S>
} = Group => ({
  ...Group,
  ...Monoid.reverse(Group),
})

export const Invariant: Invariant_.Invariant<GroupHkt> = {
  imap: (st, ts) => self => ({
    ...Monoid.imap(st, ts)(self),
    inverse: flow(ts, self.inverse, st),
  }),
}

export const imap: {
  <S, T>(st: (s: S) => T, ts: (t: T) => S): (self: Group<S>) => Group<T>
} = Invariant.imap
