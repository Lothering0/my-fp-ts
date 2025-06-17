import { Functor, Functor2, Functor2C } from "../../types/Functor"
import { Kind, Kind2, URIS, URIS2 } from "../../types/Kind"
import { StateT, StateT2 } from "./StateT"

export interface Run2C<URI extends URIS2, E> {
  <S>(s: S): <A>(ma: StateT2<URI, S, E, A>) => Kind2<URI, E, [A, S]>
}

export interface Run2<URI extends URIS2> {
  <S>(s: S): <E, A>(ma: StateT2<URI, S, E, A>) => Kind2<URI, E, [A, S]>
}

export interface Run<URI extends URIS> {
  <S>(s: S): <A>(ma: StateT<URI, S, A>) => Kind<URI, [A, S]>
}

export function run<URI extends URIS2, E>(
  functor: Functor2C<URI, E>,
): Run2C<URI, E>
export function run<URI extends URIS2>(functor: Functor2<URI>): Run2<URI>
export function run<URI extends URIS>(functor: Functor<URI>): Run<URI>
export function run<URI extends URIS>(_: Functor<URI>): Run<URI> {
  return s => ma => ma (s)
}
