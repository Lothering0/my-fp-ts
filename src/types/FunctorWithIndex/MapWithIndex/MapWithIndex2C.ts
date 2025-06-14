import { URIS2, Kind2 } from "../../Kind"

export interface MapWithIndex2C<URI extends URIS2, I, E>
  extends MapWithIndex2CPointed<URI, I, E>,
    MapWithIndex2CPointFree<URI, I, E> {}

export interface MapWithIndex2CPointed<URI extends URIS2, I, _> {
  <A, B>(fa: Kind2<URI, _, A>, f: (i: I, a: A) => B): Kind2<URI, _, B>
}

export interface MapWithIndex2CPointFree<URI extends URIS2, I, _> {
  <A, B>(f: (i: I, a: A) => B): (fa: Kind2<URI, _, A>) => Kind2<URI, _, B>
}
