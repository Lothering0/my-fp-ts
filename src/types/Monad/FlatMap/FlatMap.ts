import { URIS, Kind } from "../../Kind"

export interface FlatMap<URI extends URIS>
  extends FlatMapPointed<URI>,
    FlatMapPointFree<URI> {}

export interface FlatMapPointed<URI extends URIS> {
  <A, B>(ma: Kind<URI, A>, f: (a: A) => Kind<URI, B>): Kind<URI, B>
}

export interface FlatMapPointFree<URI extends URIS> {
  <A, B>(f: (a: A) => Kind<URI, B>): (ma: Kind<URI, A>) => Kind<URI, B>
}
