import { URIS, Kind } from "../../Kind"

export interface Map<URI extends URIS>
  extends MapPointed<URI>,
    MapPointFree<URI> {}

export interface MapPointed<URI extends URIS> {
  <A, B>(fa: Kind<URI, A>, f: (a: A) => B): Kind<URI, B>
}

export interface MapPointFree<URI extends URIS> {
  <A, B>(f: (a: A) => B): (fa: Kind<URI, A>) => Kind<URI, B>
}
