import * as Chunk from './chunk'
import * as Iterable from '../Iterable'
import * as Semigroup from '../../typeclasses/Semigroup'
import { Equivalence } from '../../typeclasses/Equivalence'
import { pipe } from '../../utils/flow'
import { concat, fromIterable } from './utils'
import { identity } from '../Identity'

export const getConcatSemigroup = <A>(): Semigroup.Semigroup<
  Chunk.Chunk<A>
> => ({
  combine: concat,
})

export const getConcatNonEmptySemigroup = <A>(): Semigroup.Semigroup<
  Chunk.NonEmpty<A>
> => ({
  combine: concat,
})

export const getIntersectionSemigroup = <A>(
  Equivalence: Equivalence<A>,
): Semigroup.Semigroup<Chunk.Chunk<A>> =>
  pipe(
    Iterable.getIntersectionSemigroup(Equivalence),
    Semigroup.imap(fromIterable, identity),
  )
