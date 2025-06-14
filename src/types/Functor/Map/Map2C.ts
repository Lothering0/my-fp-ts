import { URIS2, Kind2 } from "../../Kind"

export interface Map2C<URI extends URIS2, E>
  extends Map2CPointed<URI, E>,
    Map2CPointFree<URI, E> {}

export interface Map2CPointed<URI extends URIS2, _> {
  <A, B>(fa: Kind2<URI, _, A>, f: (a: A) => B): Kind2<URI, _, B>
}

export interface Map2CPointFree<URI extends URIS2, _> {
  <A, B>(f: (a: A) => B): (fa: Kind2<URI, _, A>) => Kind2<URI, _, B>
}
