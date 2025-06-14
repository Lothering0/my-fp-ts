import { HKT } from "../../HKT"
import { URIS } from "../../Kind"
import { Option } from "../../../modules/Option"

export interface Compact<URI extends URIS> {
  <A>(fa: HKT<URI, Option<A>>): HKT<URI, A>
}
