import { Predicate } from "../../../modules/Predicate"
import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export interface Filter2C<URI extends URIS2, E>
  extends Filter2CPointed<URI, E>,
    Filter2CPointFree<URI, E> {}

export interface Filter2CPointed<URI extends URIS2, _> {
  <A>(fa: HKT2<URI, _, A>, p: Predicate<A>): HKT2<URI, _, A>
}

export interface Filter2CPointFree<URI extends URIS2, _> {
  <A>(p: Predicate<A>): (fa: HKT2<URI, _, A>) => HKT2<URI, _, A>
}
