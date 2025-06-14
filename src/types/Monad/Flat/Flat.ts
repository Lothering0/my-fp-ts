import { URIS, Kind } from "../../Kind"

export interface Flat<URI extends URIS> {
  <A>(mma: Kind<URI, Kind<URI, A>>): Kind<URI, A>
}
