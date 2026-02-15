import * as Monad_ from '../../typeclasses/Monad'
import * as Iterable from '../Iterable'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import { Tree, Hkt } from './tree'
import { Functor } from './functor'
import { make, valueOf, forestOf } from './utils'
import { pipe } from '../../utils/flow'
import { FromIdentity } from './from-identity'
import { getIterableGen } from '../_internal'

export const Monad: Monad_.Monad<Hkt> = Monad_.create<Hkt>(
  FromIdentity,
  Functor,
  {
    flat: tree =>
      make(
        pipe(tree, valueOf, valueOf),
        Iterable.concat(pipe(tree, forestOf, Iterable.map(Monad.flat)))(
          pipe(tree, valueOf, forestOf),
        ),
      ),
  },
)

export const Do = Monad.Do

export const flatMap: {
  <A, B>(amb: (a: A) => Tree<B>): (tree: Tree<A>) => Tree<B>
} = Monad.flatMap

export const andThen: {
  <A>(tree: Tree<A>): (selfTree: Tree<unknown>) => Tree<A>
} = Monad.andThen

export const compose: {
  <A, B, C>(amb: (a: A) => Tree<B>, bmc: (b: B) => Tree<C>): (a: A) => Tree<C>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (tree: Tree<A>) => Tree<DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): (tree: Tree<A>) => Tree<DoObject<N, A, B>>
} = Monad.mapTo

export const flipApplyTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    tree: Tree<(a: A) => B>,
  ): (selfTree: Tree<A>) => Tree<DoObject<N, A, B>>
} = Monad.flipApplyTo

export const bind: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    tree: Tree<B>,
  ): (selfTree: Tree<A>) => Tree<DoObject<N, A, B>>
} = Monad.bind

export const flatMapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => Tree<B>,
  ): (tree: Tree<A>) => Tree<DoObject<N, A, B>>
} = Monad.flatMapTo

export interface TreeGenerator<A> {
  (
    makeIterable: <A>(tree: Tree<A> | (() => Tree<A>)) => TreeIterable<A>,
  ): Generator<unknown, A>
}

export interface TreeIterable<A> {
  readonly [Symbol.iterator]: () => Generator<unknown, A>
}

function* makeIterable<A>(tree: Tree<A> | (() => Tree<A>)): TreeIterable<A> {
  return (yield tree) as A
}

export const gen: {
  <A>(generator: TreeGenerator<A>): Tree<A>
} = getIterableGen(Monad, makeIterable)
