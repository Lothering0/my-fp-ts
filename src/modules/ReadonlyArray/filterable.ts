import * as Filterable_ from '../../typeclasses/Filterable'
import * as FilterableWithIndex_ from '../../typeclasses/FilterableWithIndex'
import { Option } from '../Option'
import { PredicateWithIndex } from '../Predicate'
import { Result } from '../Result'
import { ReadonlyArrayHkt } from './readonly-array'
import { Compactable } from './compactable'
import { Functor, FunctorWithIndex } from './functor'
import { RefinementWithIndex } from '../Refinement'

export const Filterable = Filterable_.create<ReadonlyArrayHkt>(
  Functor,
  Compactable,
)

export const FilterableWithIndex = FilterableWithIndex_.create<
  ReadonlyArrayHkt,
  number
>(FunctorWithIndex, Filterable)

export const filterMap: {
  <A, B>(
    p: (a: A, i: number) => Option<B>,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<B>
} = FilterableWithIndex.filterMapWithIndex

export const filter: {
  <A, B extends A>(
    p: RefinementWithIndex<A, B, number>,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<B>
  <A>(
    p: PredicateWithIndex<A, number>,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<A>
} = FilterableWithIndex.filterWithIndex

export const partitionMap: {
  <A, E, B>(
    p: (a: A, i: number) => Result<E, B>,
  ): (self: ReadonlyArray<A>) => readonly [ReadonlyArray<E>, ReadonlyArray<B>]
} = FilterableWithIndex.partitionMapWithIndex

export const partition: {
  <A>(
    p: PredicateWithIndex<A, number>,
  ): (self: ReadonlyArray<A>) => readonly [ReadonlyArray<A>, ReadonlyArray<A>]
} = FilterableWithIndex.partitionWithIndex
