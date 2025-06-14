import { Kind2, URIS2 } from "../../Kind"

export interface Apply2C<URI extends URIS2, E>
  extends Apply2CPointed<URI, E>,
    Apply2CPointFree<URI, E> {}

export interface Apply2CPointed<URI extends URIS2, _> {
  <A, B>(fa: Kind2<URI, _, A>, ff: Kind2<URI, _, (a: A) => B>): Kind2<URI, _, B>
}

export interface Apply2CPointFree<URI extends URIS2, _> {
  <A, B>(
    ff: Kind2<URI, _, (a: A) => B>,
  ): (fa: Kind2<URI, _, A>) => Kind2<URI, _, B>
}
