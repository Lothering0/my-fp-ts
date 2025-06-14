import { URIS2, Kind2 } from "../../Kind"

export interface Reduce2C<URI extends URIS2, E>
  extends Reduce2CPointed<URI, E>,
    Reduce2CPointFree<URI, E> {}

export interface Reduce2CPointed<URI extends URIS2, E> {
  <A, B>(fa: Kind2<URI, E, A>, b: B, f: (b: B, a: A) => B): B
}

export interface Reduce2CPointFree<URI extends URIS2, E> {
  <A, B>(b: B, f: (b: B, a: A) => B): (fa: Kind2<URI, E, A>) => B
}
