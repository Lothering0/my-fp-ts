import {
  FunctorWithIndex,
  FunctorWithIndex2,
  FunctorWithIndex2C,
} from "../FunctorWithIndex"
import { URIS, URIS2 } from "../Kind"
import { Filterable, Filterable2, Filterable2C } from "../Filterable"
import {
  PartitionMapWithIndex,
  PartitionMapWithIndex2,
  PartitionMapWithIndex2C,
} from "./PartitionMapWithIndex"
import {
  PartitionWithIndex,
  PartitionWithIndex2,
  PartitionWithIndex2C,
} from "./PartitionWithIndex"
import {
  FilterMapWithIndex,
  FilterMapWithIndex2,
  FilterMapWithIndex2C,
} from "./FilterMapWithIndex"
import {
  FilterWithIndex,
  FilterWithIndex2,
  FilterWithIndex2C,
} from "./FilterWithIndex"

export interface FilterableWithIndex<URI extends URIS, I>
  extends FunctorWithIndex<URI, I>,
    Filterable<URI> {
  /** Partitions and maps elements to new values */
  readonly partitionMapWithIndex: PartitionMapWithIndex<URI, I>
  readonly partitionWithIndex: PartitionWithIndex<URI, I>
  /** Removes element if predicate function returns `none`. Otherwise maps it to value of `some` */
  readonly filterMapWithIndex: FilterMapWithIndex<URI, I>
  readonly filterWithIndex: FilterWithIndex<URI, I>
}

export interface FilterableWithIndex2<URI extends URIS2, I>
  extends FunctorWithIndex2<URI, I>,
    Filterable2<URI> {
  /** Partitions and maps elements to new values */
  readonly partitionMapWithIndex: PartitionMapWithIndex2<URI, I>
  readonly partitionWithIndex: PartitionWithIndex2<URI, I>
  /** Removes element if predicate function returns `none`. Otherwise maps it to value of `some` */
  readonly filterMapWithIndex: FilterMapWithIndex2<URI, I>
  readonly filterWithIndex: FilterWithIndex2<URI, I>
}

export interface FilterableWithIndex2C<URI extends URIS2, I, E>
  extends FunctorWithIndex2C<URI, I, E>,
    Filterable2C<URI, E> {
  /** Partitions and maps elements to new values */
  readonly partitionMapWithIndex: PartitionMapWithIndex2C<URI, I, E>
  readonly partitionWithIndex: PartitionWithIndex2C<URI, I, E>
  /** Removes element if predicate function returns `none`. Otherwise maps it to value of `some` */
  readonly filterMapWithIndex: FilterMapWithIndex2C<URI, I, E>
  readonly filterWithIndex: FilterWithIndex2C<URI, I, E>
}
