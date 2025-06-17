import { Functor, Functor2, Functor2C } from "../../types/Functor"
import { Kind, Kind2, URIS, URIS2 } from "../../types/Kind"
import { run } from "./run"
import { StateT, StateT2 } from "./StateT"

export interface Evaluate2C<URI extends URIS2, E> {
  <S>(s: S): <A>(ma: StateT2<URI, S, E, A>) => Kind2<URI, E, A>
}

export interface Evaluate2<URI extends URIS2> {
  <S>(s: S): <E, A>(ma: StateT2<URI, S, E, A>) => Kind2<URI, E, A>
}

export interface Evaluate<URI extends URIS> {
  <S>(s: S): <A>(ma: StateT<URI, S, A>) => Kind<URI, A>
}

export function evaluate<URI extends URIS2, E>(
  functor: Functor2C<URI, E>,
): Evaluate2C<URI, E>
export function evaluate<URI extends URIS2>(
  functor: Functor2<URI>,
): Evaluate2<URI>
export function evaluate<URI extends URIS>(functor: Functor<URI>): Evaluate<URI>
export function evaluate<URI extends URIS>(
  functor: Functor<URI>,
): Evaluate<URI> {
  return s => ma => functor.map (run (functor) (s) (ma), ([a]) => a)
}
