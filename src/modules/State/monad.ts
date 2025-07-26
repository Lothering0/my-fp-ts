import { Sync } from "../Sync"
import { flow } from "../../utils/flow"
import { createMonad } from "../../types/Monad"
import { Applicative } from "./applicative"
import { State, StateHKT } from "./state"
import { DoObject } from "src/types/DoObject"

export const Monad = createMonad<StateHKT> ({
  ...Applicative,
  flat: self => flow (self, ([ma, s1]) => ma (s1)),
})

export const Do = Monad.Do

export const flat: {
  <S, A>(self: State<S, State<S, A>>): State<S, A>
} = Monad.flat

export const flatMap: {
  <S, A, B>(amb: (a: A) => State<S, B>): (self: State<S, A>) => State<S, B>
} = Monad.flatMap

export const compose: {
  <S, A, B, C>(
    bmc: (b: B) => State<S, C>,
    amb: (a: A) => State<S, B>,
  ): (a: A) => State<S, C>
} = Monad.compose

export const setTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): <S>(self: State<S, A>) => State<S, DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): <S>(self: State<S, A>) => State<S, DoObject<N, A, B>>
} = Monad.mapTo

export const flapTo: {
  <N extends string | number | symbol, S, A, B>(
    name: Exclude<N, keyof A>,
    fab: State<S, (a: A) => B>,
  ): (self: State<S, A>) => State<S, DoObject<N, A, B>>
} = Monad.flapTo

export const apS: {
  <N extends string | number | symbol, S, A, B>(
    name: Exclude<N, keyof A>,
    fb: State<S, B>,
  ): (self: State<S, A>) => State<S, DoObject<N, A, B>>
} = Monad.apS

export const flatMapTo: {
  <N extends string | number | symbol, S, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => State<S, B>,
  ): (self: State<S, A>) => State<S, DoObject<N, A, B>>
} = Monad.flatMapTo

export const tap: {
  <S, A, _>(am_: (a: A) => State<S, _>): (self: State<S, A>) => State<S, A>
} = Monad.tap

export const tapSync: {
  <A, _>(am_: (a: A) => Sync<_>): <S>(self: State<S, A>) => State<S, A>
} = Monad.tapSync
