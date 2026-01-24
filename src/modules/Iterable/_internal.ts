import * as Iterable from './iterable'

export const maybeNonEmpty = <A>(iterable: Iterable<A>): Iterable.NonEmpty<A> =>
  iterable as any
