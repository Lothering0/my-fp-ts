import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"
import { Either } from "../../../modules/Either"

export interface CompactEithers2<URI extends URIS2> {
  <_, A>(fa: HKT2<URI, _, Either<unknown, A>>): HKT2<URI, _, A>
}
