import { Either } from "../../../modules/either"
import { Separated } from "../../../modules/separated"
import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export interface PartitionMapWithIndex2<URI extends URIS2, I>
  extends PartitionMapWithIndex2Pointed<URI, I>,
    PartitionMapWithIndex2PointFree<URIS2, I> {}

export interface PartitionMapWithIndex2Pointed<URI extends URIS2, I> {
  <E, A, B, C>(
    fa: HKT2<URI, E, A>,
    p: (i: I, a: A) => Either<B, C>,
  ): Separated<HKT2<URI, E, B>, HKT2<URI, E, C>>
}

export interface PartitionMapWithIndex2PointFree<URI extends URIS2, I> {
  <E, A, B, C>(
    p: (i: I, a: A) => Either<B, C>,
  ): (fa: HKT2<URI, E, A>) => Separated<HKT2<URI, E, B>, HKT2<URI, E, C>>
}
