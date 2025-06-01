import { URIS2 } from "../../Kind"
import { HKT2 } from "../../HKT"

export interface Flat2C<URI extends URIS2, E> {
  <A>(mma: HKT2<URI, E, HKT2<URI, E, A>>): HKT2<URI, E, A>
}
