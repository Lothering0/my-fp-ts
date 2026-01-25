import * as Chunk from './chunk'
import * as Iterable from '../Iterable'
import { Equivalence } from '../../typeclasses/Equivalence'
import { Magma } from '../../typeclasses/Magma'
import { pipe } from '../../utils/flow'
import { fromIterable } from './utils'

/** Returns a `Magma` with `combine` operation that returns the elements of the first chunk that is not included in the second */
export const getDifferenceMagma = <A>(
  Equivalence: Equivalence<A>,
): Magma<Chunk.Chunk<A>> => ({
  combine: ys => xs =>
    pipe(
      xs,
      Iterable.getDifferenceMagma(Equivalence).combine(ys),
      fromIterable,
    ),
})
