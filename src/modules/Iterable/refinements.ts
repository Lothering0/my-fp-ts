import { NonEmpty } from './iterable'

/** Notice: it always executes one iteration */
export const isNonEmpty = <A>(
  iterable: Iterable<A>,
): iterable is NonEmpty<A> => {
  for (const _ of iterable) {
    return true
  }
  return false
}
