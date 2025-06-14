import { Option } from "../../../modules/Option"
import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export interface FilterMapWithIndex2C<URI extends URIS2, I, E>
  extends FilterMapWithIndex2CPointed<URI, I, E>,
    FilterMapWithIndex2CPointFree<URI, I, E> {}

export interface FilterMapWithIndex2CPointed<URI extends URIS2, I, _> {
  <A, B>(fa: HKT2<URI, _, A>, p: (i: I, a: A) => Option<B>): HKT2<URI, _, B>
}

export interface FilterMapWithIndex2CPointFree<URI extends URIS2, I, _> {
  <A, B>(p: (i: I, a: A) => Option<B>): (fa: HKT2<URI, _, A>) => HKT2<URI, _, B>
}
