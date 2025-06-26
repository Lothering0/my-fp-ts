import { Kind2, URIS2 } from "../../Kind"

export interface Extract2<URI extends URIS2> {
  <_, A>(fa: Kind2<URI, _, A>): A
}
