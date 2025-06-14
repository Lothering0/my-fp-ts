import { Either } from "../../../modules/Either"
import { Separated } from "../../../modules/Separated"
import { HKT } from "../../HKT"
import { URIS } from "../../Kind"

export interface PartitionMap<URI extends URIS>
  extends PartitionMapPointed<URI>,
    PartitionMapPointFree<URI> {}

export interface PartitionMapPointed<URI extends URIS> {
  <A, B, C>(
    fa: HKT<URI, A>,
    p: (a: A) => Either<B, C>,
  ): Separated<HKT<URI, B>, HKT<URI, C>>
}

export interface PartitionMapPointFree<URI extends URIS> {
  <A, B, C>(
    p: (a: A) => Either<B, C>,
  ): (fa: HKT<URI, A>) => Separated<HKT<URI, B>, HKT<URI, C>>
}
