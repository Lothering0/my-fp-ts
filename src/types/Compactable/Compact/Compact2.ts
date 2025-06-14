import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"
import { Option } from "../../../modules/Option"

export interface Compact2<URI extends URIS2> {
  <_, A>(fa: HKT2<URI, _, Option<A>>): HKT2<URI, _, A>
}
