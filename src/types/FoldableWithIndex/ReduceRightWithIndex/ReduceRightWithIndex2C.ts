import { URIS2, Kind2 } from "../../Kind"

export interface ReduceRightWithIndex2C<URI extends URIS2, I, E>
  extends ReduceRightWithIndex2CPointed<URI, I, E>,
    ReduceRightWithIndex2CPointFree<URI, I, E> {}

export interface ReduceRightWithIndex2CPointed<URI extends URIS2, I, E> {
  <A, B>(fa: Kind2<URI, E, A>, b: B, f: (i: I, a: A, b: B) => B): B
}

export interface ReduceRightWithIndex2CPointFree<URI extends URIS2, I, E> {
  <A, B>(b: B, f: (i: I, a: A, b: B) => B): (fa: Kind2<URI, E, A>) => B
}
