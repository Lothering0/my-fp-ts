import { Kind, URIS } from "../../Kind"
import { Either } from "../../../modules/Either"

export interface CompactEithers<URI extends URIS> {
  <A>(fa: Kind<URI, Either<unknown, A>>): Kind<URI, A>
}
