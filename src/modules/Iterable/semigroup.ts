import * as Iterable from './iterable'
import { Equivalence } from '../../typeclasses/Equivalence'
import { Semigroup } from '../../typeclasses/Semigroup'
import { pipe } from '../../utils/flow'
import { concat } from './utils'

export const getConcatSemigroup = <A>(): Semigroup<Iterable<A>> => ({
  combine: concat,
})

export const getConcatNonEmptySemigroup = <A>(): Semigroup<
  Iterable.NonEmpty<A>
> => ({
  combine: concat,
})

export const getIntersectionSemigroup = <A>(
  Equivalence: Equivalence<A>,
): Semigroup<Iterable<A>> => ({
  combine: ys => xs => ({
    *[Symbol.iterator]() {
      for (const x of xs) {
        for (const y of ys) {
          if (pipe(x, Equivalence.equals(y))) {
            yield x
          }
        }
      }
    },
  }),
})
