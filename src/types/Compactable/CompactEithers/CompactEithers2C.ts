import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"
import { Either } from "../../../modules/either"

export interface CompactEithers2C<URI extends URIS2, _> {
  <A>(fa: HKT2<URI, _, Either<unknown, A>>): HKT2<URI, _, A>
}
