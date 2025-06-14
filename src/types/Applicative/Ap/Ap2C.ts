import { Kind2, URIS2 } from "../../Kind"

export interface Ap2C<URI extends URIS2, E>
  extends Ap2CPointed<URI, E>,
    Ap2CPointFree<URI, E> {}

export interface Ap2CPointed<URI extends URIS2, _> {
  <A, B>(ff: Kind2<URI, _, (a: A) => B>, fa: Kind2<URI, _, A>): Kind2<URI, _, B>
}

export interface Ap2CPointFree<URI extends URIS2, _> {
  <A, B>(
    fa: Kind2<URI, _, A>,
  ): (ff: Kind2<URI, _, (a: A) => B>) => Kind2<URI, _, B>
}
