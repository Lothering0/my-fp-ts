import { Kind2, URIS2 } from "../../Kind"

export interface Apply2<URI extends URIS2>
  extends Apply2Pointed<URI>,
    Apply2PointFree<URI> {}

export interface Apply2Pointed<URI extends URIS2> {
  <_, A, B>(
    fa: Kind2<URI, _, A>,
    ff: Kind2<URI, _, (a: A) => B>,
  ): Kind2<URI, _, B>
}

export interface Apply2PointFree<URI extends URIS2> {
  <_, A, B>(
    ff: Kind2<URI, _, (a: A) => B>,
  ): (fa: Kind2<URI, _, A>) => Kind2<URI, _, B>
}
