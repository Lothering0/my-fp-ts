import { Functor, Functor2, Functor2C } from "../../types/Functor"
import { Kind, Kind2, URIS, URIS2 } from "../../types/Kind"
import { StateT, StateT2 } from "./StateT"

export interface FromF2C<URI extends URIS2, E> {
  <S, A>(ma: Kind2<URI, E, A>): StateT2<URI, S, E, A>
}

export interface FromF2<URI extends URIS2> {
  <S, E, A>(ma: Kind2<URI, E, A>): StateT2<URI, S, E, A>
}

export interface FromF<URI extends URIS> {
  <S, A>(ma: Kind<URI, A>): StateT<URI, S, A>
}

export function fromF<URI extends URIS2, E>(
  functor: Functor2C<URI, E>,
): FromF2C<URI, E>
export function fromF<URI extends URIS2>(functor: Functor2<URI>): FromF2<URI>
export function fromF<URI extends URIS>(functor: Functor<URI>): FromF<URI>
export function fromF<URI extends URIS>(functor: Functor<URI>): FromF<URI> {
  return ma => s => functor.map (ma, a => [a, s])
}
