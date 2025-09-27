import * as Boolean from '../Boolean'
import { Equivalence } from '../../typeclasses/Equivalence'
import { Semigroup } from '../../typeclasses/Semigroup'
import { pipe } from '../../utils/flow'
import { reduce } from './foldable'
import { append, concat, elem } from './utils'

export const getSemigroup = <A>(): Semigroup<ReadonlyArray<A>> => ({
  combine: concat,
})

export const getIntersectionSemigroup = <A>(
  Equivalence: Equivalence<A>,
): Semigroup<ReadonlyArray<A>> => ({
  combine: ys =>
    reduce([] as ReadonlyArray<A>, (out, x) =>
      pipe(
        ys,
        elem(Equivalence)(x),
        Boolean.match({
          onFalse: () => out,
          onTrue: () => pipe(out, append(x)),
        }),
      ),
    ),
})
