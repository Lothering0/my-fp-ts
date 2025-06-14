import { Separated } from "../../../modules/Separated"
import { URIS2, Kind2 } from "../../Kind"

export interface PartitionWithIndex2<URI extends URIS2, I>
  extends PartitionWithIndex2Pointed<URI, I>,
    PartitionWithIndex2PointFree<URIS2, I> {}

export interface PartitionWithIndex2Pointed<URI extends URIS2, I> {
  <E, A>(
    fa: Kind2<URI, E, A>,
    p: (i: I, a: A) => boolean,
  ): Separated<Kind2<URI, E, A>, Kind2<URI, E, A>>
}

export interface PartitionWithIndex2PointFree<URI extends URIS2, I> {
  <E, A>(
    p: (i: I, a: A) => boolean,
  ): (fa: Kind2<URI, E, A>) => Separated<Kind2<URI, E, A>, Kind2<URI, E, A>>
}
