import { URIS2 } from "../../Kind"
import { HKT2 } from "../../HKT"

export interface ReduceRight2<URI extends URIS2>
  extends ReduceRight2Pointed<URI>,
    ReduceRight2PointFree<URI> {}

export interface ReduceRight2Pointed<URI extends URIS2> {
  <E, A, B>(fa: HKT2<URI, E, A>, b: B, f: (a: A, b: B) => B): B
}

export interface ReduceRight2PointFree<URI extends URIS2> {
  <E, A, B>(b: B, f: (a: A, b: B) => B): (fa: HKT2<URI, E, A>) => B
}
