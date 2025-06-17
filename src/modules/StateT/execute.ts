import { Functor, Functor2, Functor2C } from "../../types/Functor"
import { Kind, Kind2, URIS, URIS2 } from "../../types/Kind"
import { run } from "./run"
import { StateT, StateT2 } from "./StateT"

export interface Execute2C<URI extends URIS2, E> {
  <S>(s: S): <A>(ma: StateT2<URI, S, E, A>) => Kind2<URI, E, S>
}

export interface Execute2<URI extends URIS2> {
  <S>(s: S): <E, A>(ma: StateT2<URI, S, E, A>) => Kind2<URI, E, S>
}

export interface Execute<URI extends URIS> {
  <S>(s: S): <A>(ma: StateT<URI, S, A>) => Kind<URI, S>
}

export function execute<URI extends URIS2, E>(
  functor: Functor2C<URI, E>,
): Execute2C<URI, E>
export function execute<URI extends URIS2>(
  functor: Functor2<URI>,
): Execute2<URI>
export function execute<URI extends URIS>(functor: Functor<URI>): Execute<URI>
export function execute<URI extends URIS>(functor: Functor<URI>): Execute<URI> {
  return s => ma => functor.map (run (functor) (s) (ma), ([, s]) => s)
}
