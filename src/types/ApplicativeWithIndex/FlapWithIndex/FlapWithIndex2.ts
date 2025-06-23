import { Kind2, URIS2 } from "../../Kind"

export interface FlapWithIndex2<URI extends URIS2, I>
  extends FlapWithIndex2Pointed<URI, I>,
    FlapWithIndex2PointFree<URI, I> {}

export interface FlapWithIndex2Pointed<URI extends URIS2, I> {
  <_, A, B>(
    fa: Kind2<URI, _, A>,
    ff: Kind2<URI, _, (i: I, a: A) => B>,
  ): Kind2<URI, _, B>
}

export interface FlapWithIndex2PointFree<URI extends URIS2, I> {
  <_, A, B>(
    ff: Kind2<URI, _, (i: I, a: A) => B>,
  ): (fa: Kind2<URI, _, A>) => Kind2<URI, _, B>
}
