import { URIS, URIS2 } from "../Kind"
import { Of, Of2, Of2C } from "./Of"
import { Apply, Apply2, Apply2C } from "./Apply"

export interface Applicative<URI extends URIS> {
  readonly _URI: URI
  readonly of: Of<URI>
  readonly apply: Apply<URI>
}

export interface Applicative2<URI extends URIS2> {
  readonly _URI: URI
  readonly of: Of2<URI>
  readonly apply: Apply2<URI>
}

export interface Applicative2C<URI extends URIS2, E> {
  readonly _URI: URI
  readonly _E: E
  readonly of: Of2C<URI, E>
  readonly apply: Apply2C<URI, E>
}
