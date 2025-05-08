import {
  createFilterableWithIndex,
  FilterableWithIndex,
} from "src/types/FilterableWithIndex"
import { createFilterable, Filterable } from "../../types/Filterable"
import { compactable } from "./compactable"
import { functor, functorWithIndex } from "./functor"

export const filterable: Filterable<"Array"> = createFilterable ({
  ...compactable,
  ...functor,
})

export const filterableWithIndex: FilterableWithIndex<"Array", number> =
  createFilterableWithIndex ({
    ...filterable,
    ...functorWithIndex,
  })

export const { filter, filterWithIndex, filterMap, filterMapWithIndex } =
  filterableWithIndex
