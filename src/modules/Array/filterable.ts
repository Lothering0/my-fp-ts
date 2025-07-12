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

export const {
  filterMap,
  filterMapWithIndex,
  filter,
  filterWithIndex,
  partitionMap,
  partitionMapWithIndex,
  partition,
  partitionWithIndex,
} = FilterableWithIndex
