import { Option } from "../../../modules/Option"
import { URIS, Kind } from "../../Kind"

export interface FilterMap<URI extends URIS>
  extends FilterMapPointed<URI>,
    FilterMapPointFree<URI> {}

export interface FilterMapPointed<URI extends URIS> {
  <A, B>(fa: Kind<URI, A>, p: (a: A) => Option<B>): Kind<URI, B>
}

export interface FilterMapPointFree<URI extends URIS> {
  <A, B>(p: (a: A) => Option<B>): (fa: Kind<URI, A>) => Kind<URI, B>
}
