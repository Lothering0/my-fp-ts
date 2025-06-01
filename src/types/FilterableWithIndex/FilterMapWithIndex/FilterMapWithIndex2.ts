import { Option } from "../../../modules/option"
import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export interface FilterMapWithIndex2<URI extends URIS2, I>
  extends FilterMapWithIndex2Pointed<URI, I>,
    FilterMapWithIndex2PointFree<URI, I> {}

export interface FilterMapWithIndex2Pointed<URI extends URIS2, I> {
  <_, A, B>(fa: HKT2<URI, _, A>, p: (i: I, a: A) => Option<B>): HKT2<URI, _, B>
}

export interface FilterMapWithIndex2PointFree<URI extends URIS2, I> {
  <_, A, B>(
    p: (i: I, a: A) => Option<B>,
  ): (fa: HKT2<URI, _, A>) => HKT2<URI, _, B>
}
