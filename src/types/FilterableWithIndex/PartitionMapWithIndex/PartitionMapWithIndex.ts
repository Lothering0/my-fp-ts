import { Either } from "../../../modules/Either"
import { Separated } from "../../../modules/Separated"
import { HKT } from "../../HKT"
import { URIS } from "../../Kind"

export interface PartitionMapWithIndex<URI extends URIS, I>
  extends PartitionMapWithIndexPointed<URI, I>,
    PartitionMapWithIndexPointFree<URI, I> {}

export interface PartitionMapWithIndexPointed<URI extends URIS, I> {
  <A, B, C>(
    fa: HKT<URI, A>,
    p: (i: I, a: A) => Either<B, C>,
  ): Separated<HKT<URI, B>, HKT<URI, C>>
}

export interface PartitionMapWithIndexPointFree<URI extends URIS, I> {
  <A, B, C>(
    p: (i: I, a: A) => Either<B, C>,
  ): (fa: HKT<URI, A>) => Separated<HKT<URI, B>, HKT<URI, C>>
}
