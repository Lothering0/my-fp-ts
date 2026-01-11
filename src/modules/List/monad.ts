import * as Monad_ from '../../typeclasses/Monad'
import * as MonadWithIndex_ from '../../typeclasses/MonadWithIndex'
import * as List from './list'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import { Functor, FunctorWithIndex } from './functor'
import { FromIdentity } from './from-identity'
import { getIterableGen } from '../_internal'
import { append } from './utils'

export const Monad = Monad_.create<List.ListHkt>(FromIdentity, Functor, {
  flat: <A>(list: List.List<List.List<A>>) => {
    let out = List.nil<A>()
    for (const as of list) {
      for (const a of as) {
        out = append(a)(out)
      }
    }
    return out
  },
})

export const MonadWithIndex = MonadWithIndex_.create<List.ListHkt, number>(
  FunctorWithIndex,
  Monad,
)

export const Do = Monad.Do

export const flat: {
  <A>(list: List.List<List.List<A>>): List.List<A>
} = Monad.flat

export const flatMap: {
  <A, B>(
    amb: (a: A, i: number) => List.List<B>,
  ): (list: List.List<A>) => List.List<B>
} = MonadWithIndex.flatMapWithIndex

export const andThen: {
  <A>(list: List.List<A>): (list: List.List<unknown>) => List.List<A>
} = MonadWithIndex.andThen

export const compose: {
  <A, B, C>(
    bmc: (b: B, i: number) => List.List<C>,
    amb: (a: A) => List.List<B>,
  ): (a: A) => List.List<C>
} = MonadWithIndex.composeWithIndex

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (list: List.List<A>) => List.List<DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A, i: number) => B,
  ): (list: List.List<A>) => List.List<DoObject<N, A, B>>
} = MonadWithIndex.mapToWithIndex

export const flipApplyTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fab: List.List<(a: A, i: number) => B>,
  ): (list: List.List<A>) => List.List<DoObject<N, A, B>>
} = MonadWithIndex.flipApplyToWithIndex

export const bind: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fb: List.List<B>,
  ): (list: List.List<A>) => List.List<DoObject<N, A, B>>
} = Monad.bind

export const flatMapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A, i: number) => List.List<B>,
  ): (list: List.List<A>) => List.List<DoObject<N, A, B>>
} = MonadWithIndex.flatMapToWithIndex

export interface GenUtils {
  readonly $: <A>(list: List.List<A> | (() => List.List<A>)) => ListIterable<A>
  readonly where: (a: boolean) => Generator<unknown, void>
}

export interface ListGenerator<A> {
  (genUtils: GenUtils): Generator<unknown, A>
}

export interface ListIterable<A> {
  readonly [Symbol.iterator]: () => Generator<unknown, A>
}

function* makeIterable<A>(
  list: List.List<A> | (() => List.List<A>),
): ListIterable<A> {
  return (yield list) as A
}

function* where(a: boolean) {
  if (!a) {
    return yield* makeIterable(List.nil())
  }
}

export const gen: {
  <A>(generator: ListGenerator<A>): List.List<A>
} = getIterableGen(Monad, {
  $: makeIterable,
  where,
})
