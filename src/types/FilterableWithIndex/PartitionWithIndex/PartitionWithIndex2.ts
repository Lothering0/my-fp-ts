import { Separated } from "../../../modules/separated"
import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export interface PartitionWithIndex2<URI extends URIS2, I>
  extends PartitionWithIndex2Pointed<URI, I>,
    PartitionWithIndex2PointFree<URIS2, I> {}

export interface PartitionWithIndex2Pointed<URI extends URIS2, I> {
  <E, A>(
    fa: HKT2<URI, E, A>,
    p: (i: I, a: A) => boolean,
  ): Separated<HKT2<URI, E, A>, HKT2<URI, E, A>>
}

export interface PartitionWithIndex2PointFree<URI extends URIS2, I> {
  <E, A>(
    p: (i: I, a: A) => boolean,
  ): (fa: HKT2<URI, E, A>) => Separated<HKT2<URI, E, A>, HKT2<URI, E, A>>
}
