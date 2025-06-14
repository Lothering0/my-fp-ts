import { Separated } from "../../../modules/Separated"
import { URIS, Kind } from "../../Kind"

export interface PartitionWithIndex<URI extends URIS, I>
  extends PartitionWithIndexPointed<URI, I>,
    PartitionWithIndexPointFree<URI, I> {}

export interface PartitionWithIndexPointed<URI extends URIS, I> {
  <A>(
    fa: Kind<URI, A>,
    p: (i: I, a: A) => boolean,
  ): Separated<Kind<URI, A>, Kind<URI, A>>
}

export interface PartitionWithIndexPointFree<URI extends URIS, I> {
  <A>(
    p: (i: I, a: A) => boolean,
  ): (fa: Kind<URI, A>) => Separated<Kind<URI, A>, Kind<URI, A>>
}
