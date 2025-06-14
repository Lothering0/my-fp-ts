import { URIS2, Kind2 } from "../../Kind"

export interface ReduceRight2C<URI extends URIS2, E>
  extends ReduceRight2CPointed<URI, E>,
    ReduceRight2CPointFree<URI, E> {}

export interface ReduceRight2CPointed<URI extends URIS2, E> {
  <A, B>(fa: Kind2<URI, E, A>, b: B, f: (a: A, b: B) => B): B
}

export interface ReduceRight2CPointFree<URI extends URIS2, E> {
  <A, B>(b: B, f: (a: A, b: B) => B): (fa: Kind2<URI, E, A>) => B
}
