import { Option } from "../../../modules/Option"
import { URIS2, Kind2 } from "../../Kind"

export interface FilterMap2C<URI extends URIS2, E>
  extends FilterMap2CPointed<URI, E>,
    FilterMap2CPointFree<URI, E> {}

export interface FilterMap2CPointed<URI extends URIS2, _> {
  <A, B>(fa: Kind2<URI, _, A>, p: (a: A) => Option<B>): Kind2<URI, _, B>
}

export interface FilterMap2CPointFree<URI extends URIS2, _> {
  <A, B>(p: (a: A) => Option<B>): (fa: Kind2<URI, _, A>) => Kind2<URI, _, B>
}
