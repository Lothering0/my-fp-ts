import { Functor, Functor2, Functor2C } from "../Functor"
import { URIS, URIS2 } from "../Kind"
import { Compactable, Compactable2, Compactable2C } from "../Compactable"
import { PartitionMap, PartitionMap2, PartitionMap2C } from "./PartitionMap"
import { Partition, Partition2, Partition2C } from "./Partition"
import { FilterMap, FilterMap2, FilterMap2C } from "./FilterMap"
import { Filter, Filter2, Filter2C } from "./Filter"

export interface Filterable<URI extends URIS>
  extends Functor<URI>,
    Compactable<URI> {
  /** Partitions and maps elements to new values */
  readonly partitionMap: PartitionMap<URI>
  readonly partition: Partition<URI>
  /** Removes element if predicate function returns `none`. Otherwise maps it to value of `some` */
  readonly filterMap: FilterMap<URI>
  readonly filter: Filter<URI>
}

export interface Filterable2<URI extends URIS2>
  extends Functor2<URI>,
    Compactable2<URI> {
  /** Partitions and maps elements to new values */
  readonly partitionMap: PartitionMap2<URI>
  readonly partition: Partition2<URI>
  /** Removes element if predicate function returns `none`. Otherwise maps it to value of `some` */
  readonly filterMap: FilterMap2<URI>
  readonly filter: Filter2<URI>
}

export interface Filterable2C<URI extends URIS2, E>
  extends Functor2C<URI, E>,
    Compactable2C<URI, E> {
  /** Partitions and maps elements to new values */
  readonly partitionMap: PartitionMap2C<URI, E>
  readonly partition: Partition2C<URI, E>
  /** Removes element if predicate function returns `none`. Otherwise maps it to value of `some` */
  readonly filterMap: FilterMap2C<URI, E>
  readonly filter: Filter2C<URI, E>
}
