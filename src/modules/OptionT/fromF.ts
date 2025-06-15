import * as O from "../Option"
import { Functor, Functor2, Functor2C } from "../../types/Functor"
import { Kind, Kind2, URIS, URIS2 } from "../../types/Kind"

export interface FromF2C<URI extends URIS2, E> {
  <A>(ma: Kind2<URI, E, A>): Kind2<URI, E, O.Option<A>>
}

export interface FromF2<URI extends URIS2> {
  <E, A>(ma: Kind2<URI, E, A>): Kind2<URI, E, O.Option<A>>
}

export interface FromF<URI extends URIS> {
  <A>(ma: Kind<URI, A>): Kind<URI, O.Option<A>>
}

export function fromF<URI extends URIS2, E>(
  functor: Functor2C<URI, E>,
): FromF2C<URI, E>
export function fromF<URI extends URIS2>(functor: Functor2<URI>): FromF2<URI>
export function fromF<URI extends URIS>(functor: Functor<URI>): FromF<URI> {
  return functor.map (O.some)
}
