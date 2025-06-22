import { URIS, URIS2 } from "../../types/Kind"
import { overload } from "../../utils/overloads"
import { Monad, Monad2, Monad2C } from "../../types/Monad"
import { pipe } from "../../utils/flow"
import { StateT, StateT2 } from "./StateT"
import { map } from "./functor"
import { run } from "./run"

interface FlatMap2CPointed<URI extends URIS2, _> {
  <S, A, B>(
    fa: StateT2<URI, S, _, A>,
    f: (a: A) => StateT2<URI, S, _, B>,
  ): StateT2<URI, S, _, B>
}

interface FlatMap2Pointed<URI extends URIS2> {
  <S, _, A, B>(
    fa: StateT2<URI, S, _, A>,
    f: (a: A) => StateT2<URI, S, _, B>,
  ): StateT2<URI, S, _, B>
}

interface FlatMapPointed<URI extends URIS> {
  <S, A, B>(
    fa: StateT<URI, S, A>,
    f: (a: A) => StateT<URI, S, B>,
  ): StateT<URI, S, B>
}

interface FlatMap2CPointFree<URI extends URIS2, _> {
  <S, A, B>(
    f: (a: A) => StateT2<URI, S, _, B>,
  ): (fma: StateT2<URI, S, _, A>) => StateT2<URI, S, _, B>
}

interface FlatMap2PointFree<URI extends URIS2> {
  <S, _, A, B>(
    f: (a: A) => StateT2<URI, S, _, B>,
  ): (fma: StateT2<URI, S, _, A>) => StateT2<URI, S, _, B>
}

interface FlatMapPointFree<URI extends URIS> {
  <S, A, B>(
    f: (a: A) => StateT<URI, S, B>,
  ): (fma: StateT<URI, S, A>) => StateT<URI, S, B>
}

export interface FlatMap2C<URI extends URIS2, E>
  extends FlatMap2CPointed<URI, E>,
    FlatMap2CPointFree<URI, E> {}

export interface FlatMap2<URI extends URIS2>
  extends FlatMap2Pointed<URI>,
    FlatMap2PointFree<URI> {}

export interface FlatMap<URI extends URIS>
  extends FlatMapPointed<URI>,
    FlatMapPointFree<URI> {}

export function flatMap<URI extends URIS2, E>(
  monad: Monad2C<URI, E>,
): FlatMap2C<URI, E>
export function flatMap<URI extends URIS2>(monad: Monad2<URI>): FlatMap2<URI>
export function flatMap<URI extends URIS>(monad: Monad<URI>): FlatMap<URI>
export function flatMap<URI extends URIS>(monad: Monad<URI>): FlatMap<URI> {
  const map_ = map (monad)
  const run_ = run (monad)
  const flatMapPointed: FlatMapPointed<URI> = (fa, f) => s =>
    pipe (
      fa,
      map_ (f),
      run_ (s),
      monad.flatMap (([mb, s]) => run_ (s) (mb)),
    )

  return overload (1, flatMapPointed)
}
