import { Either } from "../../../modules/Either"
import { Separated } from "../../../modules/Separated"
import { URIS2, Kind2 } from "../../Kind"

export interface PartitionMap2C<URI extends URIS2, E>
  extends PartitionMapPointed2C<URI, E>,
    PartitionMapPointFree2C<URI, E> {}

export interface PartitionMapPointed2C<URI extends URIS2, E> {
  <A, B, C>(
    fa: Kind2<URI, E, A>,
    p: (a: A) => Either<B, C>,
  ): Separated<Kind2<URI, E, B>, Kind2<URI, E, C>>
}

export interface PartitionMapPointFree2C<URI extends URIS2, E> {
  <A, B, C>(
    p: (a: A) => Either<B, C>,
  ): (fa: Kind2<URI, E, A>) => Separated<Kind2<URI, E, B>, Kind2<URI, E, C>>
}
