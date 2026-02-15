import * as Iterable from './iterable'
import * as Filterable_ from '../../typeclasses/Filterable'
import * as FilterableWithIndex_ from '../../typeclasses/FilterableWithIndex'
import { Option } from '../Option'
import { PredicateWithIndex } from '../Predicate'
import { Result } from '../Result'
import { Compactable } from './compactable'
import { Functor, FunctorWithIndex } from './functor'
import { RefinementWithIndex } from '../Refinement'

export const Filterable = Filterable_.create<Iterable.Hkt>(Functor, Compactable)

export const FilterableWithIndex = FilterableWithIndex_.create<
  Iterable.Hkt,
  number
>(FunctorWithIndex, Filterable)

export const filterMap: {
  <A, B>(
    p: (a: A, i: number) => Option<B>,
  ): (iterable: Iterable<A>) => Iterable<B>
} = FilterableWithIndex.filterMapWithIndex

export const filter: {
  <A, B extends A>(
    p: RefinementWithIndex<A, B, number>,
  ): (iterable: Iterable<A>) => Iterable<B>
  <A>(p: PredicateWithIndex<A, number>): (iterable: Iterable<A>) => Iterable<A>
} = FilterableWithIndex.filterWithIndex

export const partitionMap: {
  <A, E, B>(
    p: (a: A, i: number) => Result<E, B>,
  ): (iterable: Iterable<A>) => readonly [Iterable<E>, Iterable<B>]
} = FilterableWithIndex.partitionMapWithIndex

export const partition: {
  <A>(
    p: PredicateWithIndex<A, number>,
  ): (iterable: Iterable<A>) => readonly [Iterable<A>, Iterable<A>]
} = FilterableWithIndex.partitionWithIndex
