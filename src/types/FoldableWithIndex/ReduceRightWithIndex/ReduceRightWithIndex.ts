import { URIS } from "../../Kind"
import { HKT } from "../../HKT"

export interface ReduceRightWithIndex<URI extends URIS, I>
  extends ReduceRightWithIndexPointed<URI, I>,
    ReduceRightWithIndexPointFree<URI, I> {}

export interface ReduceRightWithIndexPointed<URI extends URIS, I> {
  <A, B>(fa: HKT<URI, A>, b: B, f: (i: I, a: A, b: B) => B): B
}

export interface ReduceRightWithIndexPointFree<URI extends URIS, I> {
  <A, B>(b: B, f: (i: I, a: A, b: B) => B): (fa: HKT<URI, A>) => B
}
