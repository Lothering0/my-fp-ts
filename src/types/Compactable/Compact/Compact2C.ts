import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"
import { Option } from "../../../modules/option"

export interface Compact2C<URI extends URIS2, _> {
  <A>(fa: HKT2<URI, _, Option<A>>): HKT2<URI, _, A>
}
