import { URIS2, Kind2 } from "../../Kind"

export interface Flat2<URI extends URIS2> {
  <E, A>(mma: Kind2<URI, E, Kind2<URI, E, A>>): Kind2<URI, E, A>
}
