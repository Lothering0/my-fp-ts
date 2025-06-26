import { Kind, URIS } from "../../Kind"

export interface Extract<URI extends URIS> {
  <A>(fa: Kind<URI, A>): A
}
