import { Option } from "../../../modules/Option"
import { URIS2, Kind2 } from "../../Kind"

export interface FilterMapWithIndex2C<URI extends URIS2, I, E>
  extends FilterMapWithIndex2CPointed<URI, I, E>,
    FilterMapWithIndex2CPointFree<URI, I, E> {}

export interface FilterMapWithIndex2CPointed<URI extends URIS2, I, _> {
  <A, B>(fa: Kind2<URI, _, A>, p: (i: I, a: A) => Option<B>): Kind2<URI, _, B>
}

export interface FilterMapWithIndex2CPointFree<URI extends URIS2, I, _> {
  <A, B>(
    p: (i: I, a: A) => Option<B>,
  ): (fa: Kind2<URI, _, A>) => Kind2<URI, _, B>
}
