import { URIS2, Kind2 } from "../../Kind"

export interface ReduceRightWithIndex2<URI extends URIS2, I>
  extends ReduceRightWithIndex2Pointed<URI, I>,
    ReduceRightWithIndex2PointFree<URI, I> {}

export interface ReduceRightWithIndex2Pointed<URI extends URIS2, I> {
  <E, A, B>(fa: Kind2<URI, E, A>, b: B, f: (i: I, a: A, b: B) => B): B
}

export interface ReduceRightWithIndex2PointFree<URI extends URIS2, I> {
  <E, A, B>(b: B, f: (i: I, a: A, b: B) => B): (fa: Kind2<URI, E, A>) => B
}
