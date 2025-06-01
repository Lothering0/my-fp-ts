import { Applicative, Applicative2, Applicative2C } from "../Applicative"
import { URIS, URIS2 } from "../Kind"
import { ApplyResultTo, ApplyResultTo2, ApplyResultTo2C } from "./ApplyResultTo"
import { ApplyTo, ApplyTo2, ApplyTo2C } from "./ApplyTo"
import { Compose, Compose2, Compose2C } from "./Compose"
import { Do, Do2, Do2C } from "./Do"
import { Flat, Flat2, Flat2C } from "./Flat"
import { FlatMap, FlatMap2, FlatMap2C } from "./FlatMap"
import { FlatMapTo, FlatMapTo2, FlatMapTo2C } from "./FlatMapTo"
import { MapTo, MapTo2, MapTo2C } from "./MapTo"
import { SetTo, SetTo2, SetTo2C } from "./SetTo"
import { Tap, Tap2, Tap2C } from "./Tap"
import { TapIo, TapIo2, TapIo2C } from "./TapIo"

export interface Monad<URI extends URIS> extends Applicative<URI> {
  readonly Do: Do<URI>
  readonly flat: Flat<URI>
  readonly flatMap: FlatMap<URI>
  readonly compose: Compose<URI>
  readonly setTo: SetTo<URI>
  readonly mapTo: MapTo<URI>
  readonly applyTo: ApplyTo<URI>
  readonly applyResultTo: ApplyResultTo<URI>
  /** Alias for `applyResultTo` */
  readonly apS: Monad<URI>["applyResultTo"]
  readonly flatMapTo: FlatMapTo<URI>
  readonly tap: Tap<URI>
  readonly tapIo: TapIo<URI>
}

export interface Monad2<URI extends URIS2> extends Applicative2<URI> {
  readonly Do: Do2<URI>
  readonly flat: Flat2<URI>
  readonly flatMap: FlatMap2<URI>
  readonly compose: Compose2<URI>
  readonly setTo: SetTo2<URI>
  readonly mapTo: MapTo2<URI>
  readonly applyTo: ApplyTo2<URI>
  readonly applyResultTo: ApplyResultTo2<URI>
  /** Alias for `applyResultTo` */
  readonly apS: Monad2<URI>["applyResultTo"]
  readonly flatMapTo: FlatMapTo2<URI>
  readonly tap: Tap2<URI>
  readonly tapIo: TapIo2<URI>
}

export interface Monad2C<URI extends URIS2, E> extends Applicative2C<URI, E> {
  readonly Do: Do2C<URI, E>
  readonly flat: Flat2C<URI, E>
  readonly flatMap: FlatMap2C<URI, E>
  readonly compose: Compose2C<URI, E>
  readonly setTo: SetTo2C<URI, E>
  readonly mapTo: MapTo2C<URI, E>
  readonly applyTo: ApplyTo2C<URI, E>
  readonly applyResultTo: ApplyResultTo2C<URI, E>
  /** Alias for `applyResultTo` */
  readonly apS: Monad2C<URI, E>["applyResultTo"]
  readonly flatMapTo: FlatMapTo2C<URI, E>
  readonly tap: Tap2C<URI, E>
  readonly tapIo: TapIo2C<URI, E>
}
