import { Either } from "../../../modules/Either"
import { Separated } from "../../../modules/Separated"
import { URIS2, Kind2 } from "../../Kind"

export interface PartitionMapWithIndex2<URI extends URIS2, I>
  extends PartitionMapWithIndex2Pointed<URI, I>,
    PartitionMapWithIndex2PointFree<URIS2, I> {}

export interface PartitionMapWithIndex2Pointed<URI extends URIS2, I> {
  <E, A, B, C>(
    fa: Kind2<URI, E, A>,
    p: (i: I, a: A) => Either<B, C>,
  ): Separated<Kind2<URI, E, B>, Kind2<URI, E, C>>
}

export interface PartitionMapWithIndex2PointFree<URI extends URIS2, I> {
  <E, A, B, C>(
    p: (i: I, a: A) => Either<B, C>,
  ): (fa: Kind2<URI, E, A>) => Separated<Kind2<URI, E, B>, Kind2<URI, E, C>>
}
