import { URIS, Kind } from "../../Kind"

export interface Reduce<URI extends URIS>
  extends ReducePointed<URI>,
    ReducePointFree<URI> {}

export interface ReducePointed<URI extends URIS> {
  <A, B>(fa: Kind<URI, A>, b: B, f: (b: B, a: A) => B): B
}

export interface ReducePointFree<URI extends URIS> {
  <A, B>(b: B, f: (b: B, a: A) => B): (fa: Kind<URI, A>) => B
}
