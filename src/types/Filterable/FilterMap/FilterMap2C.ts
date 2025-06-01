import { Option } from "../../../modules/option"
import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export interface FilterMap2C<URI extends URIS2, E>
  extends FilterMap2CPointed<URI, E>,
    FilterMap2CPointFree<URI, E> {}

export interface FilterMap2CPointed<URI extends URIS2, _> {
  <A, B>(fa: HKT2<URI, _, A>, p: (a: A) => Option<B>): HKT2<URI, _, B>
}

export interface FilterMap2CPointFree<URI extends URIS2, _> {
  <A, B>(p: (a: A) => Option<B>): (fa: HKT2<URI, _, A>) => HKT2<URI, _, B>
}
