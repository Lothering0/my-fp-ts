import { Option } from "../Option"
import { PredicateWithIndex } from "../Predicate"
import { Result } from "../Result"
import { ReadonlyArrayHkt } from "./readonly-array"
import { createFilterableWithIndex } from "../../typeclasses/FilterableWithIndex"
import { createFilterable } from "../../typeclasses/Filterable"
import { Compactable } from "./compactable"
import { Functor, FunctorWithIndex } from "./functor"
import { RefinementWithIndex } from "../Refinement"

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
