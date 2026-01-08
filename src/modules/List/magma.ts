import * as Boolean from '../Boolean'
import { List } from './list'
import { Equivalence } from '../../typeclasses/Equivalence'
import { Magma } from '../../typeclasses/Magma'
import { pipe } from '../../utils/flow'
import { elem } from './utils'
import { filter } from './filterable'

/** Returns a `Magma` with `combine` operation that returns the elements of the first list not included in the second */
export const getDifferenceMagma = <A>(
  Equivalence: Equivalence<A>,
): Magma<List<A>> => ({
  combine: ys => filter(x => pipe(ys, elem(Equivalence)(x), Boolean.not)),
})
