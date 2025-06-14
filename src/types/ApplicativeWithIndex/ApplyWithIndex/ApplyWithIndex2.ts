import { Kind2, URIS2 } from "../../Kind"

export interface ApplyWithIndex2<URI extends URIS2, I>
  extends ApplyWithIndex2Pointed<URI, I>,
    ApplyWithIndex2PointFree<URI, I> {}

export interface ApplyWithIndex2Pointed<URI extends URIS2, I> {
  <_, A, B>(
    fa: Kind2<URI, _, A>,
    ff: Kind2<URI, _, (i: I, a: A) => B>,
  ): Kind2<URI, _, B>
}

export interface ApplyWithIndex2PointFree<URI extends URIS2, I> {
  <_, A, B>(
    ff: Kind2<URI, _, (i: I, a: A) => B>,
  ): (fa: Kind2<URI, _, A>) => Kind2<URI, _, B>
}
