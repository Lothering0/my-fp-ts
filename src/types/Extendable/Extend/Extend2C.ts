import { Kind2, URIS2 } from "../../Kind"

export interface Extend2C<URI extends URIS2, E>
  extends Extend2CPointed<URI, E>,
    Extend2CPointFree<URI, E> {}

export interface Extend2CPointed<URI extends URIS2, _> {
  <A, B>(fa: Kind2<URI, _, A>, f: (fa: Kind2<URI, _, A>) => B): Kind2<URI, _, B>
}

export interface Extend2CPointFree<URI extends URIS2, _> {
  <A, B>(
    f: (fa: Kind2<URI, _, A>) => B,
  ): (fa: Kind2<URI, _, A>) => Kind2<URI, _, B>
}
