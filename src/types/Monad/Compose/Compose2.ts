import { URIS2, Kind2 } from "../../Kind"

export interface Compose2<URI extends URIS2>
  extends Compose2Pointed<URI>,
    Compose2PointFree<URI> {}

export interface Compose2Pointed<URI extends URIS2> {
  <_, A, B, C>(
    g: (b: B) => Kind2<URI, _, C>,
    f: (a: A) => Kind2<URI, _, B>,
    a: A,
  ): Kind2<URI, _, C>
}

export interface Compose2PointFree<URI extends URIS2> {
  <_, A, B, C>(
    g: (b: B) => Kind2<URI, _, C>,
    f: (a: A) => Kind2<URI, _, B>,
  ): (a: A) => Kind2<URI, _, C>
}
