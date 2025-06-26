import { Kind2, URIS2 } from "../../Kind"

export interface Extend2<URI extends URIS2>
  extends Extend2Pointed<URI>,
    Extend2PointFree<URI> {}

export interface Extend2Pointed<URI extends URIS2> {
  <_, A, B>(
    fa: Kind2<URI, _, A>,
    f: (fa: Kind2<URI, _, A>) => B,
  ): Kind2<URI, _, B>
}

export interface Extend2PointFree<URI extends URIS2> {
  <_, A, B>(
    f: (fa: Kind2<URI, _, A>) => B,
  ): (fa: Kind2<URI, _, A>) => Kind2<URI, _, B>
}
