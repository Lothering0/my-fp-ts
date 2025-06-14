import { Either } from "../../../modules/Either"
import { Separated } from "../../../modules/Separated"
import { URIS, Kind } from "../../Kind"

export interface PartitionMapWithIndex<URI extends URIS, I>
  extends PartitionMapWithIndexPointed<URI, I>,
    PartitionMapWithIndexPointFree<URI, I> {}

export interface PartitionMapWithIndexPointed<URI extends URIS, I> {
  <A, B, C>(
    fa: Kind<URI, A>,
    p: (i: I, a: A) => Either<B, C>,
  ): Separated<Kind<URI, B>, Kind<URI, C>>
}

export interface PartitionMapWithIndexPointFree<URI extends URIS, I> {
  <A, B, C>(
    p: (i: I, a: A) => Either<B, C>,
  ): (fa: Kind<URI, A>) => Separated<Kind<URI, B>, Kind<URI, C>>
}
