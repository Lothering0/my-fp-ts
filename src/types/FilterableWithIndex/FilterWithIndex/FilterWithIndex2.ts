import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export interface FilterWithIndex2<URI extends URIS2, I>
  extends FilterWithIndex2Pointed<URI, I>,
    FilterWithIndex2PointFree<URI, I> {}

export interface FilterWithIndex2Pointed<URI extends URIS2, I> {
  <_, A>(fa: HKT2<URI, _, A>, p: (i: I, a: A) => boolean): HKT2<URI, _, A>
}

export interface FilterWithIndex2PointFree<URI extends URIS2, I> {
  <_, A>(p: (i: I, a: A) => boolean): (fa: HKT2<URI, _, A>) => HKT2<URI, _, A>
}
