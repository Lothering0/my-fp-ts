import { URIS2, Kind2 } from "../../Kind"

export interface FilterWithIndex2<URI extends URIS2, I>
  extends FilterWithIndex2Pointed<URI, I>,
    FilterWithIndex2PointFree<URI, I> {}

export interface FilterWithIndex2Pointed<URI extends URIS2, I> {
  <_, A>(fa: Kind2<URI, _, A>, p: (i: I, a: A) => boolean): Kind2<URI, _, A>
}

export interface FilterWithIndex2PointFree<URI extends URIS2, I> {
  <_, A>(p: (i: I, a: A) => boolean): (fa: Kind2<URI, _, A>) => Kind2<URI, _, A>
}
