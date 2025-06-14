import { Separated } from "../../../modules/Separated"
import { URIS2, Kind2 } from "../../Kind"

export interface PartitionWithIndex2C<URI extends URIS2, I, E>
  extends PartitionWithIndex2CPointed<URI, I, E>,
    PartitionWithIndex2CPointFree<URIS2, I, E> {}

export interface PartitionWithIndex2CPointed<URI extends URIS2, I, E> {
  <A>(
    fa: Kind2<URI, E, A>,
    p: (i: I, a: A) => boolean,
  ): Separated<Kind2<URI, E, A>, Kind2<URI, E, A>>
}

export interface PartitionWithIndex2CPointFree<URI extends URIS2, I, E> {
  <A>(
    p: (i: I, a: A) => boolean,
  ): (fa: Kind2<URI, E, A>) => Separated<Kind2<URI, E, A>, Kind2<URI, E, A>>
}
