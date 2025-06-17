import * as S from "../State"
import { URIS, URIS2 } from "../../types/Kind"
import { StateT, StateT2 } from "./StateT"
import {
  Applicative,
  Applicative2,
  Applicative2C,
} from "../../types/Applicative"

export interface FromState2C<URI extends URIS2, E> {
  <S, A>(ma: S.State<S, A>): StateT2<URI, S, E, A>
}

export interface FromState2<URI extends URIS2> {
  <S, E, A>(ma: S.State<S, A>): StateT2<URI, S, E, A>
}

export interface FromState<URI extends URIS> {
  <S, A>(ma: S.State<S, A>): StateT<URI, S, A>
}

export function fromState<URI extends URIS2, E>(
  applicative: Applicative2C<URI, E>,
): FromState2C<URI, E>
export function fromState<URI extends URIS2>(
  applicative: Applicative2<URI>,
): FromState2<URI>
export function fromState<URI extends URIS>(
  applicative: Applicative<URI>,
): FromState<URI>
export function fromState<URI extends URIS>(
  applicative: Applicative<URI>,
): FromState<URI> {
  return ma => s => applicative.of (S.run (s) (ma))
}
