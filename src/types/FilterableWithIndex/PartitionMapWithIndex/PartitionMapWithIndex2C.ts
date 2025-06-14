import { Either } from "../../../modules/Either"
import { Separated } from "../../../modules/Separated"
import { URIS2, Kind2 } from "../../Kind"

export interface PartitionMapWithIndex2C<URI extends URIS2, I, E>
  extends PartitionMapWithIndex2CPointed<URI, I, E>,
    PartitionMapWithIndex2CPointFree<URIS2, I, E> {}

export interface PartitionMapWithIndex2CPointed<URI extends URIS2, I, E> {
  <A, B, C>(
    fa: Kind2<URI, E, A>,
    p: (i: I, a: A) => Either<B, C>,
  ): Separated<Kind2<URI, E, B>, Kind2<URI, E, C>>
}

export interface PartitionMapWithIndex2CPointFree<URI extends URIS2, I, E> {
  <A, B, C>(
    p: (i: I, a: A) => Either<B, C>,
  ): (fa: Kind2<URI, E, A>) => Separated<Kind2<URI, E, B>, Kind2<URI, E, C>>
}
