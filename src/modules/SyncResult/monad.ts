import * as result from "../Result"
import { createMonad } from "../../types/Monad"
import { DoObject, DoObjectKey } from "../../types/DoObject"
import { SyncResultHkt, execute, SyncResult } from "./sync-result"
import { Applicative } from "./applicative"
import { pipe } from "../../utils/flow"

export const Monad = createMonad<SyncResultHkt> ({
  ...Applicative,
  flat: self => () =>
    pipe (self, execute, ma =>
      result.isFailure (ma) ? ma : pipe (ma, result.success, execute),
    ),
})

export const Do = Monad.Do

export const flat: {
  <E1, E2, A>(self: SyncResult<E1, SyncResult<E2, A>>): SyncResult<E1 | E2, A>
} = Monad.flat

export const flatMap: {
  <E1, A, B>(
    amb: (a: A) => SyncResult<E1, B>,
  ): <E2>(self: SyncResult<E2, A>) => SyncResult<E1 | E2, B>
} = Monad.flatMap

export const compose: {
  <E1, E2, A, B, C>(
    bmc: (b: B) => SyncResult<E2, C>,
    amb: (a: A) => SyncResult<E1, B>,
  ): (a: A) => SyncResult<E1 | E2, C>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): <E>(self: SyncResult<E, A>) => SyncResult<E, DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): <E>(self: SyncResult<E, A>) => SyncResult<E, DoObject<N, A, B>>
} = Monad.mapTo

export const flapTo: {
  <N extends DoObjectKey, E1, A, B>(
    name: Exclude<N, keyof A>,
    fab: SyncResult<E1, (a: A) => B>,
  ): <E2>(self: SyncResult<E2, A>) => SyncResult<E1 | E2, DoObject<N, A, B>>
} = Monad.flapTo

export const apS: {
  <N extends DoObjectKey, E1, A, B>(
    name: Exclude<N, keyof A>,
    fb: SyncResult<E1, B>,
  ): <E2>(self: SyncResult<E2, A>) => SyncResult<E1 | E2, DoObject<N, A, B>>
} = Monad.apS

export const flatMapTo: {
  <N extends DoObjectKey, E1, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => SyncResult<E1, B>,
  ): <E2>(self: SyncResult<E2, A>) => SyncResult<E1 | E2, DoObject<N, A, B>>
} = Monad.flatMapTo
