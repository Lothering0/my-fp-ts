import { Predicate } from "../../../modules/Predicate"
import { Kind2, URIS2 } from "../../Kind"

export interface Filter2C<URI extends URIS2, E>
  extends Filter2CPointed<URI, E>,
    Filter2CPointFree<URI, E> {}

export interface Filter2CPointed<URI extends URIS2, _> {
  <A>(fa: Kind2<URI, _, A>, p: Predicate<A>): Kind2<URI, _, A>
}

export interface Filter2CPointFree<URI extends URIS2, _> {
  <A>(p: Predicate<A>): (fa: Kind2<URI, _, A>) => Kind2<URI, _, A>
}
