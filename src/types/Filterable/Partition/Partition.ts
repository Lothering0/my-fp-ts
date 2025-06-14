import { Predicate } from "../../../modules/Predicate"
import { Separated } from "../../../modules/Separated"
import { URIS, Kind } from "../../Kind"

export interface Partition<URI extends URIS>
  extends PartitionPointed<URI>,
    PartitionPointFree<URI> {}

export interface PartitionPointed<URI extends URIS> {
  <A>(fa: Kind<URI, A>, p: Predicate<A>): Separated<Kind<URI, A>, Kind<URI, A>>
}

export interface PartitionPointFree<URI extends URIS> {
  <A>(
    p: Predicate<A>,
  ): (fa: Kind<URI, A>) => Separated<Kind<URI, A>, Kind<URI, A>>
}
