import { ArrayHKT } from "./array"
import {
  createFilterableWithIndex,
  FilterableWithIndex,
} from "../../types/FilterableWithIndex"
import { createFilterable, Filterable } from "../../types/Filterable"
import { compactable } from "./compactable"
import { functor, functorWithIndex } from "./functor"

export const filterable: Filterable<ArrayHKT> = createFilterable ({
  ...compactable,
  ...functor,
})

export const filterableWithIndex: FilterableWithIndex<ArrayHKT, number> =
  createFilterableWithIndex ({
    ...filterable,
    ...functorWithIndex,
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
} = filterableWithIndex
