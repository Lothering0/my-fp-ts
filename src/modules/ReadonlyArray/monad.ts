import * as Array from './readonly-array'
import * as Monad_ from '../../typeclasses/Monad'
import * as MonadWithIndex_ from '../../typeclasses/MonadWithIndex'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import {
  Functor,
  FunctorWithIndex,
  NonEmptyFunctor,
  NonEmptyFunctorWithIndex,
} from './functor'
import { FromIdentity, NonEmptyFromIdentity } from './from-identity'
import { getIterableGen } from '../_internal'

export const Monad = Monad_.create<Array.Hkt>(FromIdentity, Functor, {
  flat: self => self.flat(),
})

export const MonadWithIndex = MonadWithIndex_.create<Array.Hkt, number>(
  FunctorWithIndex,
  Monad,
)

export const flat: {
  <F extends ReadonlyArray<ReadonlyArray<any>>>(
    self: F,
  ): Array.AndNonEmpty<F, Array.Infer<F>, Array.Infer<Array.Infer<F>>>
} = Monad.flat as any

export const NonEmptyMonad = Monad_.create<Array.NonEmptyHkt>(
  NonEmptyFromIdentity,
  NonEmptyFunctor,
  { flat },
)

export const Do: Array.NonEmpty<{}> = NonEmptyMonad.Do

export const NonEmptyMonadWithIndex = MonadWithIndex_.create<
  Array.NonEmptyHkt,
  number
>(NonEmptyFunctorWithIndex, NonEmptyMonad)

export const flatMap: {
  <F extends ReadonlyArray<any>, G extends ReadonlyArray<any>>(
    aimb: (a: Array.Infer<F>, i: number) => G,
  ): (self: F) => Array.AndNonEmpty<F, G, Array.Infer<G>>
} = MonadWithIndex.flatMapWithIndex as any

export const andThen: {
  <F extends ReadonlyArray<any>>(
    ma: F,
  ): <G extends ReadonlyArray<any>>(
    self: G,
  ) => Array.AndNonEmpty<F, G, Array.Infer<F>>
} = MonadWithIndex.andThen as any

export const compose: {
  <A, F extends ReadonlyArray<any>, G extends ReadonlyArray<any>>(
    amb: (a: A) => F,
    bmc: (b: Array.Infer<F>, i: number) => G,
  ): (a: A) => Array.AndNonEmpty<F, G, Array.Infer<G>>
} = MonadWithIndex.composeWithIndex as any

export const setTo: {
  <N extends DoObjectKey, F extends ReadonlyArray<any>, B>(
    name: Exclude<N, keyof Array.Infer<F>>,
    b: B,
  ): (self: F) => Array.With<F, DoObject<N, Array.Infer<F>, B>>
} = Monad.setTo as any

export const mapTo: {
  <N extends DoObjectKey, F extends ReadonlyArray<any>, B>(
    name: Exclude<N, keyof Array.Infer<F>>,
    ab: (a: Array.Infer<F>, i: number) => B,
  ): (self: F) => Array.With<F, DoObject<N, Array.Infer<F>, B>>
} = MonadWithIndex.mapToWithIndex as any

export const flipApplyTo: {
  <
    N extends DoObjectKey,
    F extends ReadonlyArray<any>,
    G extends ReadonlyArray<(a: Array.Infer<F>, i: number) => any>,
  >(
    name: Exclude<N, keyof Array.Infer<F>>,
    fab: G,
  ): (
    self: F,
  ) => Array.AndNonEmpty<
    F,
    G,
    DoObject<N, Array.Infer<F>, ReturnType<Array.Infer<G>>>
  >
} = MonadWithIndex.flipApplyToWithIndex as any

export const bind: {
  <
    N extends DoObjectKey,
    F extends ReadonlyArray<any>,
    G extends ReadonlyArray<any>,
  >(
    name: Exclude<N, keyof Array.Infer<F>>,
    fb: G,
  ): (
    self: F,
  ) => Array.AndNonEmpty<F, G, DoObject<N, Array.Infer<F>, Array.Infer<G>>>
} = Monad.bind as any

export const flatMapTo: {
  <
    N extends DoObjectKey,
    F extends ReadonlyArray<any>,
    G extends ReadonlyArray<any>,
  >(
    name: Exclude<N, keyof Array.Infer<F>>,
    amb: (a: Array.Infer<F>, i: number) => G,
  ): (
    self: F,
  ) => Array.AndNonEmpty<F, G, DoObject<N, Array.Infer<F>, Array.Infer<G>>>
} = MonadWithIndex.flatMapToWithIndex as any

export interface GenUtils {
  readonly $: <A>(
    self: ReadonlyArray<A> | (() => ReadonlyArray<A>),
  ) => ReadonlyArrayIterable<A>
  readonly where: (a: boolean) => Generator<unknown, void>
}

export interface ReadonlyArrayGenerator<A> {
  (genUtils: GenUtils): Generator<unknown, A>
}

export interface ReadonlyArrayIterable<A> {
  readonly [Symbol.iterator]: () => Generator<unknown, A>
}

function* makeIterable<A>(
  self: ReadonlyArray<A> | (() => ReadonlyArray<A>),
): ReadonlyArrayIterable<A> {
  return (yield self) as A
}

function* where(a: boolean) {
  if (!a) {
    return yield* makeIterable([])
  }
}

export const gen: {
  <A>(generator: ReadonlyArrayGenerator<A>): ReadonlyArray<A>
} = getIterableGen(Monad, {
  $: makeIterable,
  where,
})
