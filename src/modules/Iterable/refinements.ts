import { NonEmpty } from './iterable'

export const isNonEmpty = <A>(iterable: Iterable<A>): iterable is NonEmpty<A> =>
  '0' in iterable
