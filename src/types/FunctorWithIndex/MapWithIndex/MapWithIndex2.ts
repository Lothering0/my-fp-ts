import { URIS2, Kind2 } from "../../Kind"

export interface MapWithIndex2<URI extends URIS2, I>
  extends MapWithIndex2Pointed<URI, I>,
    MapWithIndex2PointFree<URI, I> {}

export interface MapWithIndex2Pointed<URI extends URIS2, I> {
  <_, A, B>(fa: Kind2<URI, _, A>, f: (i: I, a: A) => B): Kind2<URI, _, B>
}

export interface MapWithIndex2PointFree<URI extends URIS2, I> {
  <_, A, B>(f: (i: I, a: A) => B): (fa: Kind2<URI, _, A>) => Kind2<URI, _, B>
}
