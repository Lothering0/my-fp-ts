import { Kind2, URIS2 } from "../../Kind"
import { Either } from "../../../modules/Either"

export interface CompactEithers2<URI extends URIS2> {
  <_, A>(fa: Kind2<URI, _, Either<unknown, A>>): Kind2<URI, _, A>
}
