/* eslint-disable @typescript-eslint/no-explicit-any */
import { URIS, URIS2 } from "src/types/Kind"
import { Monad, Monad2, Monad2C } from "src/types/Monad"
import {
  map,
  Map,
  Map2,
  Map2C,
  mapLeft,
  MapLeft,
  MapLeft2,
  MapLeft2C,
  bimap,
  Bimap,
  Bimap2,
  Bimap2C,
} from "./functor"
import { ap, Ap, Ap2, Ap2C } from "./applicative"
import { chain, Chain, Chain2, Chain2C } from "./monad"
import {
  left,
  Left,
  Left2,
  Left2C,
  leftF,
  LeftF,
  LeftF2,
  LeftF2C,
} from "./left"
import {
  right,
  rightF,
  Right,
  RightF,
  Right2,
  RightF2,
  Right2C,
  RightF2C,
} from "./right"
import { match, Match, Match2, Match2C } from "./match"
import { swap, Swap, Swap2, Swap2C } from "./swap"
import { toUnion, ToUnion, ToUnion2, ToUnion2C } from "./toUnion"

interface EitherT2C<URI extends URIS2, E> {
  readonly map: Map2C<URI, E>
  readonly mapLeft: MapLeft2C<URI, E>
  readonly bimap: Bimap2C<URI, E>
  readonly ap: Ap2C<URI, E>
  readonly chain: Chain2C<URI, E>
  readonly left: Left2C<URI, E>
  readonly leftF: LeftF2C<URI, E>
  readonly right: Right2C<URI, E>
  readonly rightF: RightF2C<URI, E>
  readonly match: Match2C<URI, E>
  readonly swap: Swap2C<URI, E>
  readonly toUnion: ToUnion2C<URI, E>
}

interface EitherT2<URI extends URIS2> {
  readonly map: Map2<URI>
  readonly mapLeft: MapLeft2<URI>
  readonly bimap: Bimap2<URI>
  readonly ap: Ap2<URI>
  readonly chain: Chain2<URI>
  readonly left: Left2<URI>
  readonly leftF: LeftF2<URI>
  readonly right: Right2<URI>
  readonly rightF: RightF2<URI>
  readonly match: Match2<URI>
  readonly swap: Swap2<URI>
  readonly toUnion: ToUnion2<URI>
}

interface EitherT<URI extends URIS> {
  readonly map: Map<URI>
  readonly mapLeft: MapLeft<URI>
  readonly bimap: Bimap<URI>
  readonly ap: Ap<URI>
  readonly chain: Chain<URI>
  readonly left: Left<URI>
  readonly leftF: LeftF<URI>
  readonly right: Right<URI>
  readonly rightF: RightF<URI>
  readonly match: Match<URI>
  readonly swap: Swap<URI>
  readonly toUnion: ToUnion<URI>
}

export function getEitherT<URI extends URIS2, E>(
  monad: Monad2C<URI, E>,
): EitherT2C<URI, E>
export function getEitherT<URI extends URIS2>(monad: Monad2<URI>): EitherT2<URI>
export function getEitherT<URI extends URIS>(monad: Monad<URI>): EitherT<URI>
export function getEitherT<URI extends URIS>(monad: Monad<URI>): EitherT<URI> {
  const m: any = monad
  return {
    map: map (m),
    mapLeft: mapLeft (m),
    bimap: bimap (m),
    ap: ap (m),
    chain: chain (m),
    left: left (m),
    leftF: leftF (m),
    right: right (m),
    rightF: rightF (m),
    match: match (m),
    swap: swap (m),
    toUnion: toUnion (m),
  } as any
}
