import { Option } from "../Option"
import { Predicate } from "../Predicate"
import { Result } from "../Result"
import { Separated } from "../Separated"
import { ArrayHKT } from "./array"
import { createFilterableWithIndex } from "../../types/FilterableWithIndex"
import { createFilterable } from "../../types/Filterable"
import { Compactable } from "./compactable"
import { Functor, FunctorWithIndex } from "./functor"

export const Filterable = createFilterable<ArrayHKT> ({
  ...Compactable,
  ...Functor,
})

export const FilterableWithIndex = createFilterableWithIndex<ArrayHKT, number> ({
  ...Filterable,
  ...FunctorWithIndex,
})

export const filterMap: {
  <A, B>(p: (a: A) => Option<B>): (self: A[]) => B[]
  <A, B>(self: A[], p: (a: A) => Option<B>): B[]
} = Filterable.filterMap

export const filterMapWithIndex: {
  <A, B>(p: (i: number, a: A) => Option<B>): (self: A[]) => B[]
  <A, B>(self: A[], p: (i: number, a: A) => Option<B>): B[]
} = FilterableWithIndex.filterMapWithIndex

export const filter: {
  <A>(p: Predicate<A>): (self: A[]) => A[]
  <A>(self: A[], p: Predicate<A>): A[]
} = Filterable.filter

export const filterWithIndex: {
  <A>(p: (i: number, a: A) => boolean): (self: A[]) => A[]
  <A>(self: A[], p: (i: number, a: A) => boolean): A[]
} = FilterableWithIndex.filterWithIndex

export const partitionMap: {
  <A, E, B>(p: (a: A) => Result<E, B>): (self: A[]) => Separated<E[], B[]>
  <A, E, B>(self: A[], p: (a: A) => Result<E, B>): Separated<E[], B[]>
} = Filterable.partitionMap

export const partitionMapWithIndex: {
  <A, E, B>(
    p: (i: number, a: A) => Result<E, B>,
  ): (self: A[]) => Separated<E[], B[]>
  <A, E, B>(
    self: A[],
    p: (i: number, a: A) => Result<E, B>,
  ): Separated<E[], B[]>
} = FilterableWithIndex.partitionMapWithIndex

export const partition: {
  <A>(p: Predicate<A>): (self: A[]) => Separated<A[], A[]>
  <A>(self: A[], p: Predicate<A>): Separated<A[], A[]>
} = Filterable.partition

export const partitionWithIndex: {
  <A>(p: (i: number, a: A) => boolean): (self: A[]) => Separated<A[], A[]>
  <A>(self: A[], p: (i: number, a: A) => boolean): Separated<A[], A[]>
} = FilterableWithIndex.partitionWithIndex
