import * as monad from "../../types/Monad"
import { Sync } from "../Sync"
import { DoObject, DoObjectKey } from "../../types/DoObject"
import { Tree, TreeHkt } from "./tree"
import { Applicative, flat } from "./applicative"

export const Monad: monad.Monad<TreeHkt> = monad.createMonad<TreeHkt> ({
  ...Applicative,
  flat,
})

export const Do = Monad.Do

export const flatMap: {
  <A, B>(amb: (a: A) => Tree<B>): (self: Tree<A>) => Tree<B>
} = Monad.flatMap

export const compose: {
  <A, B, C>(bmc: (b: B) => Tree<C>, amb: (a: A) => Tree<B>): (a: A) => Tree<C>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (self: Tree<A>) => Tree<DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): (self: Tree<A>) => Tree<DoObject<N, A, B>>
} = Monad.mapTo

export const flapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fab: Tree<(a: A) => B>,
  ): (self: Tree<A>) => Tree<DoObject<N, A, B>>
} = Monad.flapTo

export const apS: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fb: Tree<B>,
  ): (self: Tree<A>) => Tree<DoObject<N, A, B>>
} = Monad.apS

export const flatMapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => Tree<B>,
  ): (self: Tree<A>) => Tree<DoObject<N, A, B>>
} = Monad.flatMapTo

export const tap: {
  <A>(f: (a: A) => Tree<unknown>): (self: Tree<A>) => Tree<A>
} = Monad.tap

export const tapSync: {
  <A>(f: (a: A) => Sync<unknown>): (self: Tree<A>) => Tree<A>
} = Monad.tapSync
