import * as Monad_ from '../../typeclasses/Monad'
import * as Iterable from '../Iterable'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import { Tree, TreeHkt } from './tree'
import { Functor } from './functor'
import { make, valueOf, forestOf } from './utils'
import { pipe } from '../../utils/flow'
import { FromIdentity } from './from-identity'

export const Monad: Monad_.Monad<TreeHkt> = Monad_.create<TreeHkt>(
  FromIdentity,
  Functor,
  {
    flat: self =>
      make(
        pipe(self, valueOf, valueOf),
        Iterable.concat(pipe(self, forestOf, Iterable.map(Monad.flat)))(
          pipe(self, valueOf, forestOf),
        ),
      ),
  },
)

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

export const flipApplyTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fab: Tree<(a: A) => B>,
  ): (self: Tree<A>) => Tree<DoObject<N, A, B>>
} = Monad.flipApplyTo

export const bind: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fb: Tree<B>,
  ): (self: Tree<A>) => Tree<DoObject<N, A, B>>
} = Monad.bind

export const flatMapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => Tree<B>,
  ): (self: Tree<A>) => Tree<DoObject<N, A, B>>
} = Monad.flatMapTo
