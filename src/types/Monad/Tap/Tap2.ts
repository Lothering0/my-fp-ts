import { URIS2, Kind2 } from "../../Kind"

export interface Tap2<URI extends URIS2>
  extends Tap2Pointed<URI>,
    Tap2PointFree<URI> {}

export interface Tap2Pointed<URI extends URIS2> {
  <_, A, _2>(
    ma: Kind2<URI, _, A>,
    f: (a: A) => Kind2<URI, _, _2>,
  ): Kind2<URI, _, A>
}

export interface Tap2PointFree<URI extends URIS2> {
  <_, A, _2>(
    f: (a: A) => Kind2<URI, _, _2>,
  ): (ma: Kind2<URI, _, A>) => Kind2<URI, _, A>
}
