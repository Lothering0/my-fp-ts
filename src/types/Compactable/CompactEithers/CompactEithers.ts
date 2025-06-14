import { HKT } from "../../HKT"
import { URIS } from "../../Kind"
import { Either } from "../../../modules/Either"

export interface CompactEithers<URI extends URIS> {
  <A>(fa: HKT<URI, Either<unknown, A>>): HKT<URI, A>
}
