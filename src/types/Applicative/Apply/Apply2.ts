import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export interface Apply2<URI extends URIS2>
  extends Apply2Pointed<URI>,
    Apply2PointFree<URI> {}

export interface Apply2Pointed<URI extends URIS2> {
  <_, A, B>(fa: HKT2<URI, _, A>, ff: HKT2<URI, _, (a: A) => B>): HKT2<URI, _, B>
}

export interface Apply2PointFree<URI extends URIS2> {
  <_, A, B>(
    ff: HKT2<URI, _, (a: A) => B>,
  ): (fa: HKT2<URI, _, A>) => HKT2<URI, _, B>
}
