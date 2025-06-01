import { Separated } from "../../../modules/separated"
import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export interface PartitionWithIndex2C<URI extends URIS2, I, E>
  extends PartitionWithIndex2CPointed<URI, I, E>,
    PartitionWithIndex2CPointFree<URIS2, I, E> {}

export interface PartitionWithIndex2CPointed<URI extends URIS2, I, E> {
  <A>(
    fa: HKT2<URI, E, A>,
    p: (i: I, a: A) => boolean,
  ): Separated<HKT2<URI, E, A>, HKT2<URI, E, A>>
}

export interface PartitionWithIndex2CPointFree<URI extends URIS2, I, E> {
  <A>(
    p: (i: I, a: A) => boolean,
  ): (fa: HKT2<URI, E, A>) => Separated<HKT2<URI, E, A>, HKT2<URI, E, A>>
}
