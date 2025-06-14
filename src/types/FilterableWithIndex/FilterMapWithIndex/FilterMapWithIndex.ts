import { Option } from "../../../modules/Option"
import { URIS, Kind } from "../../Kind"

export interface FilterMapWithIndex<URI extends URIS, I>
  extends FilterMapWithIndexPointed<URI, I>,
    FilterMapWithIndexPointFree<URI, I> {}

export interface FilterMapWithIndexPointed<URI extends URIS, I> {
  <A, B>(fa: Kind<URI, A>, p: (i: I, a: A) => Option<B>): Kind<URI, B>
}

export interface FilterMapWithIndexPointFree<URI extends URIS, I> {
  <A, B>(p: (i: I, a: A) => Option<B>): (fa: Kind<URI, A>) => Kind<URI, B>
}
