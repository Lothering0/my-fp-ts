import { URIS2, Kind2 } from "../../Kind"

export interface Compose2C<URI extends URIS2, E>
  extends Compose2CPointed<URI, E>,
    Compose2CPointFree<URI, E> {}

export interface Compose2CPointed<URI extends URIS2, _> {
  <A, B, C>(
    g: (b: B) => Kind2<URI, _, C>,
    f: (a: A) => Kind2<URI, _, B>,
    a: A,
  ): Kind2<URI, _, C>
}

export interface Compose2CPointFree<URI extends URIS2, _> {
  <A, B, C>(
    g: (b: B) => Kind2<URI, _, C>,
    f: (a: A) => Kind2<URI, _, B>,
  ): (a: A) => Kind2<URI, _, C>
}
