import { Either } from "../../../modules/either"
import { Separated } from "../../../modules/separated"
import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export interface PartitionMap2<URI extends URIS2>
  extends PartitionMapPointed2<URI>,
    PartitionMapPointFree2<URI> {}

export interface PartitionMapPointed2<URI extends URIS2> {
  <E, A, B, C>(
    fa: HKT2<URI, E, A>,
    p: (a: A) => Either<B, C>,
  ): Separated<HKT2<URI, E, B>, HKT2<URI, E, C>>
}

export interface PartitionMapPointFree2<URI extends URIS2> {
  <E, A, B, C>(
    p: (a: A) => Either<B, C>,
  ): (fa: HKT2<URI, E, A>) => Separated<HKT2<URI, E, B>, HKT2<URI, E, C>>
}
