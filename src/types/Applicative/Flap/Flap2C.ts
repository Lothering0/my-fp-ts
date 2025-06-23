import { Kind2, URIS2 } from "../../Kind"

export interface Flap2C<URI extends URIS2, E>
  extends Flap2CPointed<URI, E>,
    Flap2CPointFree<URI, E> {}

export interface Flap2CPointed<URI extends URIS2, _> {
  <A, B>(fa: Kind2<URI, _, A>, ff: Kind2<URI, _, (a: A) => B>): Kind2<URI, _, B>
}

export interface Flap2CPointFree<URI extends URIS2, _> {
  <A, B>(
    ff: Kind2<URI, _, (a: A) => B>,
  ): (fa: Kind2<URI, _, A>) => Kind2<URI, _, B>
}
