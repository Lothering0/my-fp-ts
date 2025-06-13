import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export interface Ap2<URI extends URIS2>
  extends Ap2Pointed<URI>,
    Ap2PointFree<URI> {}

export interface Ap2Pointed<URI extends URIS2> {
  <_, A, B>(ff: HKT2<URI, _, (a: A) => B>, fa: HKT2<URI, _, A>): HKT2<URI, _, B>
}

export interface Ap2PointFree<URI extends URIS2> {
  <_, A, B>(
    fa: HKT2<URI, _, A>,
  ): (ff: HKT2<URI, _, (a: A) => B>) => HKT2<URI, _, B>
}
