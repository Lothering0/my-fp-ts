import { Either } from "../../../modules/Either"
import { Separated } from "../../../modules/Separated"
import { URIS2, Kind2 } from "../../Kind"

export interface PartitionMap2<URI extends URIS2>
  extends PartitionMapPointed2<URI>,
    PartitionMapPointFree2<URI> {}

export interface PartitionMapPointed2<URI extends URIS2> {
  <E, A, B, C>(
    fa: Kind2<URI, E, A>,
    p: (a: A) => Either<B, C>,
  ): Separated<Kind2<URI, E, B>, Kind2<URI, E, C>>
}

export interface PartitionMapPointFree2<URI extends URIS2> {
  <E, A, B, C>(
    p: (a: A) => Either<B, C>,
  ): (fa: Kind2<URI, E, A>) => Separated<Kind2<URI, E, B>, Kind2<URI, E, C>>
}
