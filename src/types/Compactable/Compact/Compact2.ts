import { Kind2, URIS2 } from "../../Kind"
import { Option } from "../../../modules/Option"

export interface Compact2<URI extends URIS2> {
  <_, A>(fa: Kind2<URI, _, Option<A>>): Kind2<URI, _, A>
}
