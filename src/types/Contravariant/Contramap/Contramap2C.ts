import { Kind2, URIS2 } from "../../Kind"

export interface Contramap2C<URI extends URIS2, E>
  extends Contramap2CPointed<URI, E>,
    Contramap2CPointFree<URI, E> {}

export interface Contramap2CPointed<URI extends URIS2, _> {
  <A, B>(fa: Kind2<URI, _, A>, f: (b: B) => A): Kind2<URI, _, B>
}

export interface Contramap2CPointFree<URI extends URIS2, _> {
  <A, B>(f: (b: B) => A): (fa: Kind2<URI, _, A>) => Kind2<URI, _, B>
}
