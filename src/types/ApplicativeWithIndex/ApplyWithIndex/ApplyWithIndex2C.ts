import { Kind2, URIS2 } from "../../Kind"

export interface ApplyWithIndex2C<URI extends URIS2, I, E>
  extends ApplyWithIndex2CPointed<URI, I, E>,
    ApplyWithIndex2CPointFree<URI, I, E> {}

export interface ApplyWithIndex2CPointed<URI extends URIS2, I, _> {
  <A, B>(
    fa: Kind2<URI, _, A>,
    ff: Kind2<URI, _, (i: I, a: A) => B>,
  ): Kind2<URI, _, B>
}

export interface ApplyWithIndex2CPointFree<URI extends URIS2, I, _> {
  <A, B>(
    ff: Kind2<URI, _, (i: I, a: A) => B>,
  ): (fa: Kind2<URI, _, A>) => Kind2<URI, _, B>
}
