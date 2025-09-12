import { Option } from "../Option"
import { PredicateWithIndex } from "../Predicate"
import { Result } from "../Result"
import { IterableHkt } from "./iterable"
import { createFilterableWithIndex } from "../../typeclasses/FilterableWithIndex"
import { createFilterable } from "../../typeclasses/Filterable"
import { Compactable } from "./compactable"
import { Functor, FunctorWithIndex } from "./functor"
import { RefinementWithIndex } from "../Refinement"

export const Filterable = createFilterable<IterableHkt> ({
  ...Compactable,
  ...Functor,
})

export const FilterableWithIndex = createFilterableWithIndex<
  IterableHkt,
  number
> ({
  ...Filterable,
  ...FunctorWithIndex,
})

export const filterMap: {
  <A, B>(p: (a: A, i: number) => Option<B>): (self: Iterable<A>) => Iterable<B>
} = FilterableWithIndex.filterMapWithIndex

export const filter: {
  <A, B extends A>(
    p: RefinementWithIndex<A, B, number>,
  ): (self: Iterable<A>) => Iterable<B>
  <A>(p: PredicateWithIndex<A, number>): (self: Iterable<A>) => Iterable<A>
} = FilterableWithIndex.filterWithIndex

export const partitionMap: {
  <A, E, B>(
    p: (a: A, i: number) => Result<E, B>,
  ): (self: Iterable<A>) => readonly [Iterable<E>, Iterable<B>]
} = FilterableWithIndex.partitionMapWithIndex

export const partition: {
  <A>(
    p: PredicateWithIndex<A, number>,
  ): (self: Iterable<A>) => readonly [Iterable<A>, Iterable<A>]
} = FilterableWithIndex.partitionWithIndex
