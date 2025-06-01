import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export interface FlatMap2<URI extends URIS2>
  extends FlatMap2Pointed<URI>,
    FlatMap2PointFree<URI> {}

export interface FlatMap2Pointed<URI extends URIS2> {
  <_, A, B>(ma: HKT2<URI, _, A>, f: (a: A) => HKT2<URI, _, B>): HKT2<URI, _, B>
}

export interface FlatMap2PointFree<URI extends URIS2> {
  <_, A, B>(
    f: (a: A) => HKT2<URI, _, B>,
  ): (ma: HKT2<URI, _, A>) => HKT2<URI, _, B>
}
