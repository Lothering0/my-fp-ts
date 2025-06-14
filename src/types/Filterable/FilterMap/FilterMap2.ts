import { Option } from "../../../modules/Option"
import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export interface FilterMap2<URI extends URIS2>
  extends FilterMap2Pointed<URI>,
    FilterMap2PointFree<URI> {}

export interface FilterMap2Pointed<URI extends URIS2> {
  <_, A, B>(fa: HKT2<URI, _, A>, p: (a: A) => Option<B>): HKT2<URI, _, B>
}

export interface FilterMap2PointFree<URI extends URIS2> {
  <_, A, B>(p: (a: A) => Option<B>): (fa: HKT2<URI, _, A>) => HKT2<URI, _, B>
}
