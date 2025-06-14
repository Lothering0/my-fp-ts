import { URIS, Kind } from "../../Kind"

export interface ReduceWithIndex<URI extends URIS, I>
  extends ReduceWithIndexPointed<URI, I>,
    ReduceWithIndexPointFree<URI, I> {}

export interface ReduceWithIndexPointed<URI extends URIS, I> {
  <A, B>(fa: Kind<URI, A>, b: B, f: (i: I, b: B, a: A) => B): B
}

export interface ReduceWithIndexPointFree<URI extends URIS, I> {
  <A, B>(b: B, f: (i: I, b: B, a: A) => B): (fa: Kind<URI, A>) => B
}
