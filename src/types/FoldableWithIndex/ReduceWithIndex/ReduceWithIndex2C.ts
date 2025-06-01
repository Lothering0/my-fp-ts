import { URIS2 } from "../../Kind"
import { HKT2 } from "../../HKT"

export interface ReduceWithIndex2C<URI extends URIS2, I, E>
  extends ReduceWithIndex2CPointed<URI, I, E>,
    ReduceWithIndex2CPointFree<URI, I, E> {}

export interface ReduceWithIndex2CPointed<URI extends URIS2, I, E> {
  <A, B>(fa: HKT2<URI, E, A>, b: B, f: (i: I, b: B, a: A) => B): B
}

export interface ReduceWithIndex2CPointFree<URI extends URIS2, I, E> {
  <A, B>(b: B, f: (i: I, b: B, a: A) => B): (fa: HKT2<URI, E, A>) => B
}
