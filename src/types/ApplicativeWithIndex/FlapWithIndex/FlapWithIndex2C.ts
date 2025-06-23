import { Kind2, URIS2 } from "../../Kind"

export interface FlapWithIndex2C<URI extends URIS2, I, E>
  extends FlapWithIndex2CPointed<URI, I, E>,
    FlapWithIndex2CPointFree<URI, I, E> {}

export interface FlapWithIndex2CPointed<URI extends URIS2, I, _> {
  <A, B>(
    fa: Kind2<URI, _, A>,
    ff: Kind2<URI, _, (i: I, a: A) => B>,
  ): Kind2<URI, _, B>
}

export interface FlapWithIndex2CPointFree<URI extends URIS2, I, _> {
  <A, B>(
    ff: Kind2<URI, _, (i: I, a: A) => B>,
  ): (fa: Kind2<URI, _, A>) => Kind2<URI, _, B>
}
