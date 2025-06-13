import { URIS, URIS2 } from "../Kind"
import { Of, Of2, Of2C } from "./Of"
import { Apply, Apply2, Apply2C } from "./Apply"
import { Functor, Functor2, Functor2C } from "../Functor"
import { Ap, Ap2, Ap2C } from "./Ap"

export interface Applicative<URI extends URIS> extends Functor<URI> {
  readonly _URI: URI
  readonly of: Of<URI>
  readonly apply: Apply<URI>
  readonly ap: Ap<URI>
}

export interface Applicative2<URI extends URIS2> extends Functor2<URI> {
  readonly _URI: URI
  readonly of: Of2<URI>
  readonly apply: Apply2<URI>
  readonly ap: Ap2<URI>
}

export interface Applicative2C<URI extends URIS2, E> extends Functor2C<URI, E> {
  readonly _URI: URI
  readonly _E: E
  readonly of: Of2C<URI, E>
  readonly apply: Apply2C<URI, E>
  readonly ap: Ap2C<URI, E>
}
