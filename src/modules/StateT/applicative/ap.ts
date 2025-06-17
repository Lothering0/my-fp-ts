import { URIS, URIS2 } from "../../../types/Kind"
import { overload } from "../../../utils/overloads"
import { StateT, StateT2 } from "../StateT"
import { Monad, Monad2, Monad2C } from "../../../types/Monad"
import { pipe } from "../../../utils/flow"
import { map } from "../functor"
import { run } from "../run"

interface Ap2CPointed<URI extends URIS2, _> {
  <S, A, B>(
    ff: StateT2<URI, S, _, (a: A) => B>,
    fa: StateT2<URI, S, _, A>,
  ): StateT2<URI, S, _, B>
}

interface Ap2Pointed<URI extends URIS2> {
  <S, _, A, B>(
    ff: StateT2<URI, S, _, (a: A) => B>,
    fa: StateT2<URI, S, _, A>,
  ): StateT2<URI, S, _, B>
}

interface ApPointed<URI extends URIS> {
  <S, A, B>(
    ff: StateT<URI, S, (a: A) => B>,
    fa: StateT<URI, S, A>,
  ): StateT<URI, S, B>
}

interface Ap2CPointFree<URI extends URIS2, _> {
  <S, A, B>(
    fa: StateT2<URI, S, _, A>,
  ): (ff: StateT2<URI, S, _, (a: A) => B>) => StateT2<URI, S, _, B>
}

interface Ap2PointFree<URI extends URIS2> {
  <S, _, A, B>(
    fa: StateT2<URI, S, _, A>,
  ): (ff: StateT2<URI, S, _, (a: A) => B>) => StateT2<URI, S, _, B>
}

interface ApPointFree<URI extends URIS> {
  <S, A, B>(
    fa: StateT<URI, S, A>,
  ): (ff: StateT<URI, S, (a: A) => B>) => StateT<URI, S, B>
}

export interface Ap2C<URI extends URIS2, E>
  extends Ap2CPointed<URI, E>,
    Ap2CPointFree<URI, E> {}

export interface Ap2<URI extends URIS2>
  extends Ap2Pointed<URI>,
    Ap2PointFree<URI> {}

export interface Ap<URI extends URIS>
  extends ApPointed<URI>,
    ApPointFree<URI> {}

export function ap<URI extends URIS2, E>(monad: Monad2C<URI, E>): Ap2C<URI, E>
export function ap<URI extends URIS2>(monad: Monad2<URI>): Ap2<URI>
export function ap<URI extends URIS>(monad: Monad<URI>): Ap<URI>
export function ap<URI extends URIS>(monad: Monad<URI>): Ap<URI> {
  const map_ = map (monad)
  const run_ = run (monad)
  const apPointed: ApPointed<URI> = (ff, fa) => s =>
    pipe (
      ff,
      map_ (f => map_ (fa, f)),
      run_ (s),
      monad.flatMap (([mb, s]) => run_ (s) (mb)),
    )

  return overload (apPointed)
}
