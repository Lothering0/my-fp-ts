import { Predicate } from "../../../modules/Predicate"
import { Separated } from "../../../modules/Separated"
import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export interface Partition2<URI extends URIS2>
  extends Partition2Pointed<URI>,
    Partition2PointFree<URI> {}

export interface Partition2Pointed<URI extends URIS2> {
  <E, A>(
    fa: HKT2<URI, E, A>,
    p: Predicate<A>,
  ): Separated<HKT2<URI, E, A>, HKT2<URI, E, A>>
}

export interface Partition2PointFree<URI extends URIS2> {
  <E, A>(
    p: Predicate<A>,
  ): (fa: HKT2<URI, E, A>) => Separated<HKT2<URI, E, A>, HKT2<URI, E, A>>
}
