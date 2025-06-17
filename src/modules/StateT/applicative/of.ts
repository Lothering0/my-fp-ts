import {
  Applicative,
  Applicative2,
  Applicative2C,
} from "../../../types/Applicative"
import { URIS, URIS2 } from "../../../types/Kind"
import { StateT, StateT2 } from "../StateT"

export interface Of2C<URI extends URIS2, E> {
  <S, A>(a: A): StateT2<URI, S, E, A>
}

export interface Of2<URI extends URIS2> {
  <S, E, A>(a: A): StateT2<URI, S, E, A>
}

export interface Of<URI extends URIS> {
  <S, A>(a: A): StateT<URI, S, A>
}

export function of<URI extends URIS2, E>(
  applicative: Applicative2C<URI, E>,
): Of2C<URI, E>
export function of<URI extends URIS2>(applicative: Applicative2<URI>): Of2<URI>
export function of<URI extends URIS>(applicative: Applicative<URI>): Of<URI>
export function of<URI extends URIS>(applicative: Applicative<URI>): Of<URI> {
  return a => s => applicative.of ([a, s])
}
