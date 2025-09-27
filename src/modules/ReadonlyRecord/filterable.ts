import * as Filterable_ from '../../typeclasses/Filterable'
import * as FilterableWithIndex_ from '../../typeclasses/FilterableWithIndex'
import { Option } from '../Option'
import { PredicateWithIndex } from '../Predicate'
import { Result } from '../Result'
import { Compactable } from './compactable'
import { Functor, FunctorWithIndex } from './functor'
import { ReadonlyRecord, ReadonlyRecordHkt } from './readonly-record'
import { RefinementWithIndex } from '../Refinement'

export const Filterable = Filterable_.create<ReadonlyRecordHkt>(
  Functor,
  Compactable,
)

export const FilterableWithIndex = FilterableWithIndex_.create<
  ReadonlyRecordHkt,
  string
>(FunctorWithIndex, Filterable)

export const filterMap: {
  <A, B, K extends string>(
    p: (a: A, k: K) => Option<B>,
  ): (self: ReadonlyRecord<K, A>) => ReadonlyRecord<K, B>
} = FilterableWithIndex.filterMapWithIndex as typeof filterMap

export const filter: {
  <A, B extends A, K extends string>(
    p: RefinementWithIndex<A, B, K>,
  ): (self: ReadonlyRecord<K, A>) => ReadonlyRecord<K, B>
  <A, K extends string>(
    p: PredicateWithIndex<A, K>,
  ): (self: ReadonlyRecord<K, A>) => ReadonlyRecord<K, A>
} = FilterableWithIndex.filterWithIndex

export const partitionMap: {
  <A, E, B, K extends string>(
    p: (a: A, k: K) => Result<E, B>,
  ): (
    self: ReadonlyRecord<K, A>,
  ) => readonly [ReadonlyRecord<string, E>, ReadonlyRecord<string, B>]
} = FilterableWithIndex.partitionMapWithIndex as typeof partitionMap

export const partition: {
  <A, K extends string>(
    p: PredicateWithIndex<A, K>,
  ): (
    self: ReadonlyRecord<K, A>,
  ) => readonly [ReadonlyRecord<string, A>, ReadonlyRecord<string, A>]
} = FilterableWithIndex.partitionWithIndex as typeof partition
