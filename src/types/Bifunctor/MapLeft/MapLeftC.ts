import { Kind2, URIS2 } from "../../Kind"

export interface MapLeftC<URI extends URIS2, E>
  extends MapLeftCPointed<URI, E>,
    MapLeftCPointFree<URI, E> {}

export interface MapLeftCPointed<URI extends URIS2, E> {
  <_, D>(fe: Kind2<URI, E, _>, f: (e: E) => D): Kind2<URI, D, _>
}

export interface MapLeftCPointFree<URI extends URIS2, E> {
  <_, D>(f: (e: E) => D): (fe: Kind2<URI, E, _>) => Kind2<URI, D, _>
}
