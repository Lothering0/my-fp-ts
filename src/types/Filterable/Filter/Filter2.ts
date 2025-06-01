import { Predicate } from "../../../modules/predicate"
import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export interface Filter2<URI extends URIS2>
  extends Filter2Pointed<URI>,
    Filter2PointFree<URI> {}

export interface Filter2Pointed<URI extends URIS2> {
  <_, A>(fa: HKT2<URI, _, A>, p: Predicate<A>): HKT2<URI, _, A>
}

export interface Filter2PointFree<URI extends URIS2> {
  <_, A>(p: Predicate<A>): (fa: HKT2<URI, _, A>) => HKT2<URI, _, A>
}
