import { Kind2, URIS2 } from "../../Kind"

export interface Ap2<URI extends URIS2>
  extends Ap2Pointed<URI>,
    Ap2PointFree<URI> {}

export interface Ap2Pointed<URI extends URIS2> {
  <_, A, B>(
    ff: Kind2<URI, _, (a: A) => B>,
    fa: Kind2<URI, _, A>,
  ): Kind2<URI, _, B>
}

export interface Ap2PointFree<URI extends URIS2> {
  <_, A, B>(
    fa: Kind2<URI, _, A>,
  ): (ff: Kind2<URI, _, (a: A) => B>) => Kind2<URI, _, B>
}
