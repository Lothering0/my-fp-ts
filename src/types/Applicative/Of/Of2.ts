import { Kind2, URIS2 } from "../../Kind"

export interface Of2<URI extends URIS2> {
  <E = never, A = never>(a: A): Kind2<URI, E, A>
}
