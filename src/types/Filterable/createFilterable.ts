import * as O from "../../modules/option"
import * as E from "../../modules/either"
import { Functor, Functor2 } from "../Functor"
import { URIS, URIS2 } from "../Kind"
import { Compactable, Compactable2 } from "../Compactable"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"
import { Filterable, Filterable2 } from "./Filterable"
import { FilterMapPointed } from "./FilterMap"
import { FilterPointed } from "./Filter"
import { PartitionMapPointed } from "./PartitionMap"
import { PartitionPointed } from "./Partition"

export const createFilterable = <URI extends URIS>(
  filterable: Functor<URI> & Compactable<URI>,
): Filterable<URI> => {
  const { compact, separate, map } = filterable

  const filterMapPointed: FilterMapPointed<URI> = (fa, p) =>
    pipe (fa, map (p), compact)

  const filterPointed: FilterPointed<URI> = (fa, p) =>
    filterMapPointed (fa, a => p (a) ? O.some (a) : O.none)

  const partitionMapPointed: PartitionMapPointed<URI> = (fa, p) =>
    pipe (fa, map (p), separate)

  const partitionPointed: PartitionPointed<URI> = (fa, p) =>
    partitionMapPointed (fa, a => p (a) ? E.right (a) : E.left (a))

  return {
    ...filterable,
    partitionMap: overload (partitionMapPointed),
    partition: overload (partitionPointed),
    filterMap: overload (filterMapPointed),
    filter: overload (filterPointed),
  }
}

type CreateFilterable2 = <URI extends URIS2>(
  filterable: Functor2<URI> & Compactable2<URI>,
) => Filterable2<URI>
export const createFilterable2: CreateFilterable2 =
  createFilterable as CreateFilterable2
