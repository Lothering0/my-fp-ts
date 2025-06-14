import { Separated } from "../../../modules/Separated"
import { HKT } from "../../HKT"
import { URIS } from "../../Kind"

export interface PartitionWithIndex<URI extends URIS, I>
  extends PartitionWithIndexPointed<URI, I>,
    PartitionWithIndexPointFree<URI, I> {}

export interface PartitionWithIndexPointed<URI extends URIS, I> {
  <A>(
    fa: HKT<URI, A>,
    p: (i: I, a: A) => boolean,
  ): Separated<HKT<URI, A>, HKT<URI, A>>
}

export interface PartitionWithIndexPointFree<URI extends URIS, I> {
  <A>(
    p: (i: I, a: A) => boolean,
  ): (fa: HKT<URI, A>) => Separated<HKT<URI, A>, HKT<URI, A>>
}
