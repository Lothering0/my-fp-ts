import { URIS, Kind } from "../../Kind"

export interface MapWithIndex<URI extends URIS, I>
  extends MapWithIndexPointed<URI, I>,
    MapWithIndexPointFree<URI, I> {}

export interface MapWithIndexPointed<URI extends URIS, I> {
  <A, B>(fa: Kind<URI, A>, f: (i: I, a: A) => B): Kind<URI, B>
}

export interface MapWithIndexPointFree<URI extends URIS, I> {
  <A, B>(f: (i: I, a: A) => B): (fa: Kind<URI, A>) => Kind<URI, B>
}
