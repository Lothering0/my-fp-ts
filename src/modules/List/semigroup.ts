import * as Boolean from '../Boolean'
import * as List from './list'
import { Equivalence } from '../../typeclasses/Equivalence'
import { Semigroup } from '../../typeclasses/Semigroup'
import { pipe } from '../../utils/flow'
import { reduce } from './foldable'
import { append, concat, elem } from './utils'

export const getConcatSemigroup = <A>(): Semigroup<List.List<A>> => ({
  combine: concat,
})

export const getIntersectionSemigroup = <A>(
  Equivalence: Equivalence<A>,
): Semigroup<List.List<A>> => ({
  combine: ys =>
    reduce(List.nil(), (out, x) =>
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
