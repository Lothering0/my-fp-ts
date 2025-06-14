import { Predicate } from "../../../modules/Predicate"
import { Separated } from "../../../modules/Separated"
import { HKT } from "../../HKT"
import { URIS } from "../../Kind"

export interface Partition<URI extends URIS>
  extends PartitionPointed<URI>,
    PartitionPointFree<URI> {}

export interface PartitionPointed<URI extends URIS> {
  <A>(fa: HKT<URI, A>, p: Predicate<A>): Separated<HKT<URI, A>, HKT<URI, A>>
}

export interface PartitionPointFree<URI extends URIS> {
  <A>(p: Predicate<A>): (fa: HKT<URI, A>) => Separated<HKT<URI, A>, HKT<URI, A>>
}
