/* eslint-disable @typescript-eslint/no-explicit-any */
import { URIS, URIS2 } from "src/types/Kind"
import { Monad, Monad2, Monad2C } from "src/types/Monad"
import { map, Map, Map2, Map2C } from "./functor"
import { ap, Ap, Ap2, Ap2C } from "./applicative"
import { chain, Chain, Chain2, Chain2C } from "./monad"
import { fromF, FromF, FromF2, FromF2C } from "./fromF"
import { match, Match, Match2, Match2C } from "./match"
import {
  some,
  SomeConstructor,
  SomeConstructor2,
  SomeConstructor2C,
} from "./some"
import { zero, Zero, Zero2, Zero2C } from "./zero"

interface OptionT2C<URI extends URIS2, E> {
  readonly map: Map2C<URI, E>
  readonly ap: Ap2C<URI, E>
  readonly chain: Chain2C<URI, E>
  readonly fromF: FromF2C<URI, E>
  readonly match: Match2C<URI, E>
  readonly some: SomeConstructor2C<URI, E>
  readonly zero: Zero2C<URI, E>
}

interface OptionT2<URI extends URIS2> {
  readonly map: Map2<URI>
  readonly ap: Ap2<URI>
  readonly chain: Chain2<URI>
  readonly fromF: FromF2<URI>
  readonly match: Match2<URI>
  readonly some: SomeConstructor2<URI>
  readonly zero: Zero2<URI>
}

interface OptionT<URI extends URIS> {
  readonly map: Map<URI>
  readonly ap: Ap<URI>
  readonly chain: Chain<URI>
  readonly fromF: FromF<URI>
  readonly match: Match<URI>
  readonly some: SomeConstructor<URI>
  readonly zero: Zero<URI>
}

export function getOptionT<URI extends URIS2, E>(
  monad: Monad2C<URI, E>,
): OptionT2C<URI, E>
export function getOptionT<URI extends URIS2>(monad: Monad2<URI>): OptionT2<URI>
export function getOptionT<URI extends URIS>(monad: Monad<URI>): OptionT<URI>
export function getOptionT<URI extends URIS>(monad: Monad<URI>): OptionT<URI> {
  const m: any = monad
  return {
    map: map (m),
    ap: ap (m),
    chain: chain (m),
    fromF: fromF (m),
    match: match (m),
    some: some (m),
    zero: zero (m),
  } as any
}
