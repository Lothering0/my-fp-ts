import { Functor, Functor2, Functor2C } from "../Functor"
import { URIS, URIS2 } from "../Kind"
import { Extend, Extend2, Extend2C } from "./Extend"

export interface Extendable<URI extends URIS> extends Functor<URI> {
  readonly extend: Extend<URI>
}

export interface Extendable2<URI extends URIS2> extends Functor2<URI> {
  readonly extend: Extend2<URI>
}

export interface Extendable2C<URI extends URIS2, E> extends Functor2C<URI, E> {
  readonly extend: Extend2C<URI, E>
}
