import { Kind, URIS } from "../../Kind"

export interface Of<URI extends URIS> {
  <A>(a: A): Kind<URI, A>
}
