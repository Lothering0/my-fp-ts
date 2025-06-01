import { Option } from "../../../modules/option"
import { HKT } from "../../HKT"
import { URIS } from "../../Kind"

export interface FilterMap<URI extends URIS>
  extends FilterMapPointed<URI>,
    FilterMapPointFree<URI> {}

export interface FilterMapPointed<URI extends URIS> {
  <A, B>(fa: HKT<URI, A>, p: (a: A) => Option<B>): HKT<URI, B>
}

export interface FilterMapPointFree<URI extends URIS> {
  <A, B>(p: (a: A) => Option<B>): (fa: HKT<URI, A>) => HKT<URI, B>
}
