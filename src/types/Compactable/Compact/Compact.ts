import { Kind, URIS } from "../../Kind"
import { Option } from "../../../modules/Option"

export interface Compact<URI extends URIS> {
  <A>(fa: Kind<URI, Option<A>>): Kind<URI, A>
}
