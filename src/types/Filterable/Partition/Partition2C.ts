import { Predicate } from "../../../modules/predicate"
import { Separated } from "../../../modules/separated"
import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export interface Partition2C<URI extends URIS2, E>
  extends Partition2CPointed<URI, E>,
    Partition2CPointFree<URI, E> {}

export interface Partition2CPointed<URI extends URIS2, E> {
  <A>(
    fa: HKT2<URI, E, A>,
    p: Predicate<A>,
  ): Separated<HKT2<URI, E, A>, HKT2<URI, E, A>>
}

export interface Partition2CPointFree<URI extends URIS2, E> {
  <A>(
    p: Predicate<A>,
  ): (fa: HKT2<URI, E, A>) => Separated<HKT2<URI, E, A>, HKT2<URI, E, A>>
}
