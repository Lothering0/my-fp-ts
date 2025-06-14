import { Predicate } from "../../../modules/Predicate"
import { Kind2, URIS2 } from "../../Kind"

export interface Filter2<URI extends URIS2>
  extends Filter2Pointed<URI>,
    Filter2PointFree<URI> {}

export interface Filter2Pointed<URI extends URIS2> {
  <_, A>(fa: Kind2<URI, _, A>, p: Predicate<A>): Kind2<URI, _, A>
}

export interface Filter2PointFree<URI extends URIS2> {
  <_, A>(p: Predicate<A>): (fa: Kind2<URI, _, A>) => Kind2<URI, _, A>
}
