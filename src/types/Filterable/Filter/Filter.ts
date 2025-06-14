import { Predicate } from "../../../modules/Predicate"
import { HKT } from "../../HKT"
import { URIS } from "../../Kind"

export interface Filter<URI extends URIS>
  extends FilterPointed<URI>,
    FilterPointFree<URI> {}

export interface FilterPointed<URI extends URIS> {
  <A>(fa: HKT<URI, A>, p: Predicate<A>): HKT<URI, A>
}

export interface FilterPointFree<URI extends URIS> {
  <A>(p: Predicate<A>): (fa: HKT<URI, A>) => HKT<URI, A>
}
