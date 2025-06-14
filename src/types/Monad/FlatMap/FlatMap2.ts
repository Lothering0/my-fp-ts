import { URIS2, Kind2 } from "../../Kind"

export interface FlatMap2<URI extends URIS2>
  extends FlatMap2Pointed<URI>,
    FlatMap2PointFree<URI> {}

export interface FlatMap2Pointed<URI extends URIS2> {
  <_, A, B>(
    ma: Kind2<URI, _, A>,
    f: (a: A) => Kind2<URI, _, B>,
  ): Kind2<URI, _, B>
}

export interface FlatMap2PointFree<URI extends URIS2> {
  <_, A, B>(
    f: (a: A) => Kind2<URI, _, B>,
  ): (ma: Kind2<URI, _, A>) => Kind2<URI, _, B>
}
