import { Predicate } from "../../../modules/Predicate"
import { Separated } from "../../../modules/Separated"
import { URIS2, Kind2 } from "../../Kind"

export interface Partition2C<URI extends URIS2, E>
  extends Partition2CPointed<URI, E>,
    Partition2CPointFree<URI, E> {}

export interface Partition2CPointed<URI extends URIS2, E> {
  <A>(
    fa: Kind2<URI, E, A>,
    p: Predicate<A>,
  ): Separated<Kind2<URI, E, A>, Kind2<URI, E, A>>
}

export interface Partition2CPointFree<URI extends URIS2, E> {
  <A>(
    p: Predicate<A>,
  ): (fa: Kind2<URI, E, A>) => Separated<Kind2<URI, E, A>, Kind2<URI, E, A>>
}
