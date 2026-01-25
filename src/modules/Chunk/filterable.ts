import * as Chunk from './chunk'
import * as Filterable_ from '../../typeclasses/Filterable'
import * as FilterableWithIndex_ from '../../typeclasses/FilterableWithIndex'
import { Option } from '../Option'
import { PredicateWithIndex } from '../Predicate'
import { Result } from '../Result'
import { Compactable } from './compactable'
import { Functor, FunctorWithIndex } from './functor'
import { RefinementWithIndex } from '../Refinement'

export const Filterable = Filterable_.create<Chunk.Hkt>(Functor, Compactable)

export const FilterableWithIndex = FilterableWithIndex_.create<
  Chunk.Hkt,
  number
>(FunctorWithIndex, Filterable)

export const filterMap: {
  <A, B>(
    p: (a: A, i: number) => Option<B>,
  ): (chunk: Chunk.Chunk<A>) => Chunk.Chunk<B>
} = FilterableWithIndex.filterMapWithIndex

export const filter: {
  <A, B extends A>(
    p: RefinementWithIndex<A, B, number>,
  ): (chunk: Chunk.Chunk<A>) => Chunk.Chunk<B>
  <A>(
    p: PredicateWithIndex<A, number>,
  ): (chunk: Chunk.Chunk<A>) => Chunk.Chunk<A>
} = FilterableWithIndex.filterWithIndex

export const partitionMap: {
  <A, E, B>(
    p: (a: A, i: number) => Result<E, B>,
  ): (chunk: Chunk.Chunk<A>) => readonly [Chunk.Chunk<E>, Chunk.Chunk<B>]
} = FilterableWithIndex.partitionMapWithIndex

export const partition: {
  <A>(
    p: PredicateWithIndex<A, number>,
  ): (chunk: Chunk.Chunk<A>) => readonly [Chunk.Chunk<A>, Chunk.Chunk<A>]
} = FilterableWithIndex.partitionWithIndex
