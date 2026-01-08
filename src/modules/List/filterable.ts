import * as Filterable_ from '../../typeclasses/Filterable'
import * as FilterableWithIndex_ from '../../typeclasses/FilterableWithIndex'
import * as List from './list'
import { Option } from '../Option'
import { PredicateWithIndex } from '../Predicate'
import { Result } from '../Result'
import { Compactable } from './compactable'
import { Functor, FunctorWithIndex } from './functor'
import { RefinementWithIndex } from '../Refinement'

export const Filterable = Filterable_.create<List.ListHkt>(Functor, Compactable)

export const FilterableWithIndex = FilterableWithIndex_.create<
  List.ListHkt,
  number
>(FunctorWithIndex, Filterable)

export const filterMap: {
  <A, B>(
    p: (a: A, i: number) => Option<B>,
  ): (list: List.List<A>) => List.List<B>
} = FilterableWithIndex.filterMapWithIndex

export const filter: {
  <A, B extends A>(
    p: RefinementWithIndex<A, B, number>,
  ): (list: List.List<A>) => List.List<B>
  <A>(p: PredicateWithIndex<A, number>): (list: List.List<A>) => List.List<A>
} = FilterableWithIndex.filterWithIndex

export const partitionMap: {
  <A, E, B>(
    p: (a: A, i: number) => Result<E, B>,
  ): (list: List.List<A>) => readonly [List.List<E>, List.List<B>]
} = FilterableWithIndex.partitionMapWithIndex

export const partition: {
  <A>(
    p: PredicateWithIndex<A, number>,
  ): (list: List.List<A>) => readonly [List.List<A>, List.List<A>]
} = FilterableWithIndex.partitionWithIndex
