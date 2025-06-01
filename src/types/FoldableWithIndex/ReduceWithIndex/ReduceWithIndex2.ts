import { URIS2 } from "../../Kind"
import { HKT2 } from "../../HKT"

export interface ReduceWithIndex2<URI extends URIS2, I>
  extends ReduceWithIndex2Pointed<URI, I>,
    ReduceWithIndex2PointFree<URI, I> {}

export interface ReduceWithIndex2Pointed<URI extends URIS2, I> {
  <E, A, B>(fa: HKT2<URI, E, A>, b: B, f: (i: I, b: B, a: A) => B): B
}

export interface ReduceWithIndex2PointFree<URI extends URIS2, I> {
  <E, A, B>(b: B, f: (i: I, b: B, a: A) => B): (fa: HKT2<URI, E, A>) => B
}
