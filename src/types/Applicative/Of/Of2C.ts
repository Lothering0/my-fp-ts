import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export interface Of2C<URI extends URIS2, E> {
  <A>(a: A): HKT2<URI, E, A>
}
