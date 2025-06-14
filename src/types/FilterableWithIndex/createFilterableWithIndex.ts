import * as O from "../../modules/Option"
import * as E from "../../modules/Either"
import { FunctorWithIndex, FunctorWithIndex2 } from "../FunctorWithIndex"
import { URIS, URIS2 } from "../Kind"
import { Filterable, Filterable2 } from "../Filterable"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"
import {
  FilterableWithIndex,
  FilterableWithIndex2,
} from "./FilterableWithIndex"
import { FilterMapWithIndexPointed } from "./FilterMapWithIndex"
import { FilterWithIndexPointed } from "./FilterWithIndex"
import { PartitionMapWithIndexPointed } from "./PartitionMapWithIndex"
import { PartitionWithIndexPointed } from "./PartitionWithIndex"

export const createFilterableWithIndex = <URI extends URIS, I>(
  filterable: FunctorWithIndex<URI, I> & Filterable<URI>,
): FilterableWithIndex<URI, I> => {
  const { compact, separate, mapWithIndex } = filterable

  const filterMapWithIndexPointed: FilterMapWithIndexPointed<URI, I> = (
    fa,
    p,
  ) => pipe (fa, mapWithIndex (p), compact)

  const filterWithIndexPointed: FilterWithIndexPointed<URI, I> = (fa, p) =>
    filterMapWithIndexPointed (fa, (i, a) => p (i, a) ? O.some (a) : O.none)

  const partitionMapWithIndexPointed: PartitionMapWithIndexPointed<URI, I> = (
    fa,
    p,
  ) => pipe (fa, mapWithIndex (p), separate)

  const partitionWithIndexPointed: PartitionWithIndexPointed<URI, I> = (
    fa,
    p,
  ) =>
    partitionMapWithIndexPointed (fa, (i, a) =>
      p (i, a) ? E.right (a) : E.left (a),
    )

  return {
    ...filterable,
    partitionMapWithIndex: overload (partitionMapWithIndexPointed),
    partitionWithIndex: overload (partitionWithIndexPointed),
    filterMapWithIndex: overload (filterMapWithIndexPointed),
    filterWithIndex: overload (filterWithIndexPointed),
  }
}

type CreateFilterableWithIndex2 = <URI extends URIS2, I>(
  filterable: FunctorWithIndex2<URI, I> & Filterable2<URI>,
) => FilterableWithIndex2<URI, I>
export const createFilterableWithIndex2: CreateFilterableWithIndex2 =
  createFilterableWithIndex as CreateFilterableWithIndex2
