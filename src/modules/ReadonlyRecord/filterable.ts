import { Option } from "../Option"
import { PredicateWithIndex } from "../Predicate"
import { Result } from "../Result"
import { Separated } from "../Separated"
import { createFilterableWithIndex } from "../../types/FilterableWithIndex"
import { createFilterable } from "../../types/Filterable"
import { Compactable } from "./compactable"
import { Functor, FunctorWithIndex } from "./functor"
import { ReadonlyRecord, ReadonlyRecordHkt } from "./readonly-record"
import { RefinementWithIndex } from "../../types/utils"

export const Filterable = createFilterable<ReadonlyRecordHkt> ({
  ...Compactable,
  ...Functor,
})

export const FilterableWithIndex = createFilterableWithIndex<
  ReadonlyRecordHkt,
  string
> ({
  ...Filterable,
  ...FunctorWithIndex,
})

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
  ) => Separated<ReadonlyRecord<string, E>, ReadonlyRecord<string, B>>
} = FilterableWithIndex.partitionMapWithIndex as typeof partitionMap

export const partition: {
  <A, K extends string>(
    p: PredicateWithIndex<A, K>,
  ): (
    self: ReadonlyRecord<K, A>,
  ) => Separated<ReadonlyRecord<string, A>, ReadonlyRecord<string, A>>
} = FilterableWithIndex.partitionWithIndex as typeof partition
