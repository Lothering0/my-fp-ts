import { URIS } from "../../Kind"
import { HKT } from "../../HKT"

export interface ReduceRight<URI extends URIS>
  extends ReduceRightPointed<URI>,
    ReduceRightPointFree<URI> {}

export interface ReduceRightPointed<URI extends URIS> {
  <A, B>(fa: HKT<URI, A>, b: B, f: (a: A, b: B) => B): B
}

export interface ReduceRightPointFree<URI extends URIS> {
  <A, B>(b: B, f: (a: A, b: B) => B): (fa: HKT<URI, A>) => B
}
