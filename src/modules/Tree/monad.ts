import * as RA from "../ReadonlyArray"
import * as M from "../../types/Monad"
import { Sync } from "../Sync"
import { DoObject } from "../../types/DoObject"
import { Tree, TreeHKT } from "./tree"
import { Applicative } from "./applicative"
import { make, valueOf, forestOf } from "./utils"
import { pipe } from "../../utils/flow"

export const Monad: M.Monad<TreeHKT> = M.createMonad<TreeHKT> ({
  ...Applicative,
  flat: self =>
    make (
      pipe (self, valueOf, valueOf),
      RA.concat (pipe (self, forestOf, RA.map (flat))) (
        pipe (self, valueOf, forestOf),
      ),
    ),
})

export const Do = Monad.Do

export const flat: {
  <A>(self: Tree<Tree<A>>): Tree<A>
} = Monad.flat

export const flatMap: {
  <A, B>(amb: (a: A) => Tree<B>): (self: Tree<A>) => Tree<B>
} = Monad.flatMap

export const compose: {
  <A, B, C>(bmc: (b: B) => Tree<C>, amb: (a: A) => Tree<B>): (a: A) => Tree<C>
} = Monad.compose

export const setTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (self: Tree<A>) => Tree<DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): (self: Tree<A>) => Tree<DoObject<N, A, B>>
} = Monad.mapTo

export const flapTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    fab: Tree<(a: A) => B>,
  ): (self: Tree<A>) => Tree<DoObject<N, A, B>>
} = Monad.flapTo

export const apS: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    fb: Tree<B>,
  ): (self: Tree<A>) => Tree<DoObject<N, A, B>>
} = Monad.apS

export const flatMapTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => Tree<B>,
  ): (self: Tree<A>) => Tree<DoObject<N, A, B>>
} = Monad.flatMapTo

export const tap: {
  <A, _>(am_: (a: A) => Tree<_>): (self: Tree<A>) => Tree<A>
} = Monad.tap

export const tapSync: {
  <A, _>(am_: (a: A) => Sync<_>): (self: Tree<A>) => Tree<A>
} = Monad.tapSync
