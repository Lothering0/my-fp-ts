import { URIS } from "../../Kind"
import { HKT } from "../../HKT"

export interface Reduce<URI extends URIS>
  extends ReducePointed<URI>,
    ReducePointFree<URI> {}

export interface ReducePointed<URI extends URIS> {
  <A, B>(fa: HKT<URI, A>, b: B, f: (b: B, a: A) => B): B
}

export interface ReducePointFree<URI extends URIS> {
  <A, B>(b: B, f: (b: B, a: A) => B): (fa: HKT<URI, A>) => B
}
