import { Predicate } from "../../../modules/Predicate"
import { Kind, URIS } from "../../Kind"

export interface Filter<URI extends URIS>
  extends FilterPointed<URI>,
    FilterPointFree<URI> {}

export interface FilterPointed<URI extends URIS> {
  <A>(fa: Kind<URI, A>, p: Predicate<A>): Kind<URI, A>
}

export interface FilterPointFree<URI extends URIS> {
  <A>(p: Predicate<A>): (fa: Kind<URI, A>) => Kind<URI, A>
}
