import { Either } from "../../../modules/either"
import { Separated } from "../../../modules/separated"
import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export interface PartitionMapWithIndex2C<URI extends URIS2, I, E>
  extends PartitionMapWithIndex2CPointed<URI, I, E>,
    PartitionMapWithIndex2CPointFree<URIS2, I, E> {}

export interface PartitionMapWithIndex2CPointed<URI extends URIS2, I, E> {
  <A, B, C>(
    fa: HKT2<URI, E, A>,
    p: (i: I, a: A) => Either<B, C>,
  ): Separated<HKT2<URI, E, B>, HKT2<URI, E, C>>
}

export interface PartitionMapWithIndex2CPointFree<URI extends URIS2, I, E> {
  <A, B, C>(
    p: (i: I, a: A) => Either<B, C>,
  ): (fa: HKT2<URI, E, A>) => Separated<HKT2<URI, E, B>, HKT2<URI, E, C>>
}
