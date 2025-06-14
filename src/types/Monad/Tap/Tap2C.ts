import { URIS2, Kind2 } from "../../Kind"

export interface Tap2C<URI extends URIS2, E>
  extends Tap2CPointed<URI, E>,
    Tap2CPointFree<URI, E> {}

export interface Tap2CPointed<URI extends URIS2, _> {
  <A, _2>(
    ma: Kind2<URI, _, A>,
    f: (a: A) => Kind2<URI, _, _2>,
  ): Kind2<URI, _, A>
}

export interface Tap2CPointFree<URI extends URIS2, _> {
  <A, _2>(
    f: (a: A) => Kind2<URI, _, _2>,
  ): (ma: Kind2<URI, _, A>) => Kind2<URI, _, A>
}
