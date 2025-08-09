import { Option } from "../Option"
import { Predicate } from "../Predicate"
import { Result } from "../Result"
import { Separated } from "../Separated"
import { ReadonlyArrayHkt } from "./readonly-array"
import { createFilterableWithIndex } from "../../types/FilterableWithIndex"
import { createFilterable } from "../../types/Filterable"
import { Compactable } from "./compactable"
import { Functor, FunctorWithIndex } from "./functor"

export const Filterable = createFilterable<ReadonlyArrayHkt> ({
  ...Compactable,
  ...Functor,
})

export const FilterableWithIndex = createFilterableWithIndex<
  ReadonlyArrayHkt,
  number
> ({
  ...Filterable,
  ...FunctorWithIndex,
})

export const filterMap: {
  <A, B>(p: (a: A) => Option<B>): (self: ReadonlyArray<A>) => ReadonlyArray<B>
} = Filterable.filterMap

export const filterMapWithIndex: {
  <A, B>(
    p: (i: number, a: A) => Option<B>,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<B>
} = FilterableWithIndex.filterMapWithIndex

export const filter: {
  <A>(p: Predicate<A>): (self: ReadonlyArray<A>) => ReadonlyArray<A>
} = Filterable.filter

export const filterWithIndex: {
  <A>(
    p: (i: number, a: A) => boolean,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<A>
} = FilterableWithIndex.filterWithIndex

export const partitionMap: {
  <A, E, B>(
    p: (a: A) => Result<E, B>,
  ): (self: ReadonlyArray<A>) => Separated<ReadonlyArray<E>, ReadonlyArray<B>>
} = Filterable.partitionMap

export const partitionMapWithIndex: {
  <A, E, B>(
    p: (i: number, a: A) => Result<E, B>,
  ): (self: ReadonlyArray<A>) => Separated<ReadonlyArray<E>, ReadonlyArray<B>>
} = FilterableWithIndex.partitionMapWithIndex

export const partition: {
  <A>(
    p: Predicate<A>,
  ): (self: ReadonlyArray<A>) => Separated<ReadonlyArray<A>, ReadonlyArray<A>>
} = Filterable.partition

export const partitionWithIndex: {
  <A>(
    p: (i: number, a: A) => boolean,
  ): (self: ReadonlyArray<A>) => Separated<ReadonlyArray<A>, ReadonlyArray<A>>
} = FilterableWithIndex.partitionWithIndex
