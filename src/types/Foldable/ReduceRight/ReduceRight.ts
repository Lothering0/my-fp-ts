import { URIS, Kind } from "../../Kind"

export interface ReduceRight<URI extends URIS>
  extends ReduceRightPointed<URI>,
    ReduceRightPointFree<URI> {}

export interface ReduceRightPointed<URI extends URIS> {
  <A, B>(fa: Kind<URI, A>, b: B, f: (a: A, b: B) => B): B
}

export interface ReduceRightPointFree<URI extends URIS> {
  <A, B>(b: B, f: (a: A, b: B) => B): (fa: Kind<URI, A>) => B
}
