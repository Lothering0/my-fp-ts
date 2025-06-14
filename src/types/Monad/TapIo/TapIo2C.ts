import { URIS2, Kind, Kind2 } from "../../Kind"

export interface TapIo2C<URI extends URIS2, E>
  extends TapIo2CPointed<URI, E>,
    TapIo2CPointFree<URI, E> {}

export interface TapIo2CPointed<URI extends URIS2, _> {
  <A, _2>(ma: Kind2<URI, _, A>, f: (a: A) => Kind<"Io", _2>): Kind2<URI, _, A>
}

export interface TapIo2CPointFree<URI extends URIS2, _> {
  <A, _2>(
    f: (a: A) => Kind<"Io", _2>,
  ): (ma: Kind2<URI, _, A>) => Kind2<URI, _, A>
}
