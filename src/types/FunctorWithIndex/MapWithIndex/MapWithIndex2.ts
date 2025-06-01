import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export interface MapWithIndex2<URI extends URIS2, I>
  extends MapWithIndex2Pointed<URI, I>,
    MapWithIndex2PointFree<URI, I> {}

export interface MapWithIndex2Pointed<URI extends URIS2, I> {
  <_, A, B>(fa: HKT2<URI, _, A>, f: (i: I, a: A) => B): HKT2<URI, _, B>
}

export interface MapWithIndex2PointFree<URI extends URIS2, I> {
  <_, A, B>(f: (i: I, a: A) => B): (fa: HKT2<URI, _, A>) => HKT2<URI, _, B>
}
