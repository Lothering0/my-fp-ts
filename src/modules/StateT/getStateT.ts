/* eslint-disable @typescript-eslint/no-explicit-any */
import { URIS, URIS2 } from "../../types/Kind"
import { Monad, Monad2, Monad2C } from "../../types/Monad"
import { map, Map, Map2, Map2C } from "./functor"
import { of, Of, Of2, Of2C, ap, Ap, Ap2, Ap2C } from "./applicative"
import { flatMap, FlatMap, FlatMap2, FlatMap2C } from "./monad"
import { fromF, FromF, FromF2, FromF2C } from "./fromF"
import { fromState, FromState, FromState2, FromState2C } from "./fromState"
import { run, Run, Run2, Run2C } from "./run"
import { evaluate, Evaluate, Evaluate2, Evaluate2C } from "./evaluate"
import { execute, Execute, Execute2, Execute2C } from "./execute"

interface StateTM2C<URI extends URIS2, E> {
  readonly map: Map2C<URI, E>
  readonly of: Of2C<URI, E>
  readonly ap: Ap2C<URI, E>
  readonly flatMap: FlatMap2C<URI, E>
  readonly fromF: FromF2C<URI, E>
  readonly fromState: FromState2C<URI, E>
  readonly run: Run2C<URI, E>
  readonly evaluate: Evaluate2C<URI, E>
  readonly execute: Execute2C<URI, E>
}

interface StateTM2<URI extends URIS2> {
  readonly map: Map2<URI>
  readonly of: Of2<URI>
  readonly ap: Ap2<URI>
  readonly flatMap: FlatMap2<URI>
  readonly fromF: FromF2<URI>
  readonly fromState: FromState2<URI>
  readonly run: Run2<URI>
  readonly evaluate: Evaluate2<URI>
  readonly execute: Execute2<URI>
}

interface StateTM<URI extends URIS> {
  readonly map: Map<URI>
  readonly of: Of<URI>
  readonly ap: Ap<URI>
  readonly flatMap: FlatMap<URI>
  readonly fromF: FromF<URI>
  readonly fromState: FromState<URI>
  readonly run: Run<URI>
  readonly evaluate: Evaluate<URI>
  readonly execute: Execute<URI>
}

export function getStateT<URI extends URIS2, E>(
  monad: Monad2C<URI, E>,
): StateTM2C<URI, E>
export function getStateT<URI extends URIS2>(monad: Monad2<URI>): StateTM2<URI>
export function getStateT<URI extends URIS>(monad: Monad<URI>): StateTM<URI>
export function getStateT<URI extends URIS>(monad: Monad<URI>): StateTM<URI> {
  const m: any = monad
  return {
    map: map (m),
    of: of (m),
    ap: ap (m),
    flatMap: flatMap (m),
    fromF: fromF (m),
    fromState: fromState (m),
    run: run (m),
    evaluate: evaluate (m),
    execute: execute (m),
  } as any
}
