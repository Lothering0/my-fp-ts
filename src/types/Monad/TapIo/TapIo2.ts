import { URIS2, Kind, Kind2 } from "../../Kind"

export interface TapIo2<URI extends URIS2>
  extends TapIo2Pointed<URI>,
    TapIo2PointFree<URI> {}

export interface TapIo2Pointed<URI extends URIS2> {
  <_, A, _2>(
    ma: Kind2<URI, _, A>,
    f: (a: A) => Kind<"Io", _2>,
  ): Kind2<URI, _, A>
}

export interface TapIo2PointFree<URI extends URIS2> {
  <_, A, _2>(
    f: (a: A) => Kind<"Io", _2>,
  ): (ma: Kind2<URI, _, A>) => Kind2<URI, _, A>
}
