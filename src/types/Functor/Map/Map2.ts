import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export interface Map2<URI extends URIS2>
  extends Map2Pointed<URI>,
    Map2PointFree<URI> {}

export interface Map2Pointed<URI extends URIS2> {
  <_, A, B>(fa: HKT2<URI, _, A>, f: (a: A) => B): HKT2<URI, _, B>
}

export interface Map2PointFree<URI extends URIS2> {
  <_, A, B>(f: (a: A) => B): (fa: HKT2<URI, _, A>) => HKT2<URI, _, B>
}
