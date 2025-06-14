import { Either } from "../../../modules/Either"
import { Separated } from "../../../modules/Separated"
import { URIS, Kind } from "../../Kind"

export interface PartitionMap<URI extends URIS>
  extends PartitionMapPointed<URI>,
    PartitionMapPointFree<URI> {}

export interface PartitionMapPointed<URI extends URIS> {
  <A, B, C>(
    fa: Kind<URI, A>,
    p: (a: A) => Either<B, C>,
  ): Separated<Kind<URI, B>, Kind<URI, C>>
}

export interface PartitionMapPointFree<URI extends URIS> {
  <A, B, C>(
    p: (a: A) => Either<B, C>,
  ): (fa: Kind<URI, A>) => Separated<Kind<URI, B>, Kind<URI, C>>
}
