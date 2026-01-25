import * as Boolean from '../Boolean'
import { Equivalence } from '../../typeclasses/Equivalence'
import { Magma } from '../../typeclasses/Magma'
import { pipe } from '../../utils/flow'
import { elem } from './utils'
import { filter } from './filterable'

/** Returns a `Magma` with `combine` operation that returns the iterable of elements of the first iterable that is not included in the second */
export const getDifferenceMagma = <A>(
  Equivalence: Equivalence<A>,
): Magma<Iterable<A>> => ({
  combine: ys => filter(x => pipe(ys, elem(Equivalence)(x), Boolean.not)),
})
