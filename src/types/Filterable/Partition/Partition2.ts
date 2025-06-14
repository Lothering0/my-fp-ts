import { Predicate } from "../../../modules/Predicate"
import { Separated } from "../../../modules/Separated"
import { URIS2, Kind2 } from "../../Kind"

export interface Partition2<URI extends URIS2>
  extends Partition2Pointed<URI>,
    Partition2PointFree<URI> {}

export interface Partition2Pointed<URI extends URIS2> {
  <E, A>(
    fa: Kind2<URI, E, A>,
    p: Predicate<A>,
  ): Separated<Kind2<URI, E, A>, Kind2<URI, E, A>>
}

export interface Partition2PointFree<URI extends URIS2> {
  <E, A>(
    p: Predicate<A>,
  ): (fa: Kind2<URI, E, A>) => Separated<Kind2<URI, E, A>, Kind2<URI, E, A>>
}
