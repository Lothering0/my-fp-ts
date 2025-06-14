import { Kind2, URIS2 } from "../../Kind"

export interface Of2C<URI extends URIS2, E> {
  <A>(a: A): Kind2<URI, E, A>
}
