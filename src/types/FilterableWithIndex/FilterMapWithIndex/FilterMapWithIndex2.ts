import { Option } from "../../../modules/Option"
import { URIS2, Kind2 } from "../../Kind"

export interface FilterMapWithIndex2<URI extends URIS2, I>
  extends FilterMapWithIndex2Pointed<URI, I>,
    FilterMapWithIndex2PointFree<URI, I> {}

export interface FilterMapWithIndex2Pointed<URI extends URIS2, I> {
  <_, A, B>(
    fa: Kind2<URI, _, A>,
    p: (i: I, a: A) => Option<B>,
  ): Kind2<URI, _, B>
}

export interface FilterMapWithIndex2PointFree<URI extends URIS2, I> {
  <_, A, B>(
    p: (i: I, a: A) => Option<B>,
  ): (fa: Kind2<URI, _, A>) => Kind2<URI, _, B>
}
