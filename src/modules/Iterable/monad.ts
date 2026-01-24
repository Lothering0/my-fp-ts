import * as Iterable from './iterable'
import * as Monad_ from '../../typeclasses/Monad'
import * as MonadWithIndex_ from '../../typeclasses/MonadWithIndex'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import { Functor, FunctorWithIndex, NonEmptyFunctorWithIndex } from './functor'
import { FromIdentity } from './from-identity'
import { getIterableGen } from '../_internal'

export const Monad = Monad_.create<Iterable.Hkt>(FromIdentity, Functor, {
  flat: self => ({
    *[Symbol.iterator]() {
      for (const iterable of self) {
        yield* iterable
      }
    },
  }),
})

export const MonadWithIndex = MonadWithIndex_.create<Iterable.Hkt, number>(
  FunctorWithIndex,
  Monad,
)

export const NonEmptyMonad: Monad_.Monad<Iterable.NonEmptyHkt> = Monad as any

export const NonEmptyMonadWithIndex = MonadWithIndex_.create<
  Iterable.NonEmptyHkt,
  number
>(NonEmptyFunctorWithIndex, NonEmptyMonad)

export const Do: Iterable.NonEmpty<{}> = NonEmptyMonad.Do

export const flat: {
  <F extends Iterable<Iterable<any>>>(
    self: F,
  ): Iterable.AndNonEmpty<
    F,
    Iterable.Infer<F>,
    Iterable.Infer<Iterable.Infer<F>>
  >
} = NonEmptyMonad.flat as any

export const flatMap: {
  <F extends Iterable<any>, G extends Iterable<any>>(
    aimb: (a: Iterable.Infer<F>, i: number) => G,
  ): (self: F) => Iterable.AndNonEmpty<F, G, Iterable.Infer<G>>
} = NonEmptyMonadWithIndex.flatMapWithIndex as any

export const andThen: {
  <F extends Iterable<any>>(
    ma: F,
  ): <G extends Iterable<any>>(
    self: G,
  ) => Iterable.AndNonEmpty<F, G, Iterable.Infer<F>>
} = NonEmptyMonadWithIndex.andThen as any

export const compose: {
  <A, B, C>(
    bmc: (b: B, i: number) => Iterable<C>,
    amb: (a: A) => Iterable<B>,
  ): (a: A) => Iterable<C>
} = MonadWithIndex.composeWithIndex

export const setTo: {
  <N extends DoObjectKey, F extends Iterable<any>, B>(
    name: Exclude<N, keyof Iterable.Infer<F>>,
    b: B,
  ): (self: F) => Iterable.With<F, DoObject<N, Iterable.Infer<F>, B>>
} = NonEmptyMonad.setTo as any

export const mapTo: {
  <N extends DoObjectKey, F extends Iterable<any>, B>(
    name: Exclude<N, keyof Iterable.Infer<F>>,
    ab: (a: Iterable.Infer<F>, i: number) => B,
  ): (self: F) => Iterable.With<F, DoObject<N, Iterable.Infer<F>, B>>
} = NonEmptyMonadWithIndex.mapToWithIndex as any

export const flipApplyTo: {
  <
    N extends DoObjectKey,
    F extends Iterable<any>,
    G extends Iterable<(a: Iterable.Infer<F>, i: number) => any>,
  >(
    name: Exclude<N, keyof Iterable.Infer<F>>,
    fab: G,
  ): (
    self: F,
  ) => Iterable.AndNonEmpty<
    F,
    G,
    DoObject<N, Iterable.Infer<F>, ReturnType<Iterable.Infer<G>>>
  >
} = MonadWithIndex.flipApplyToWithIndex as any

export const bind: {
  <N extends DoObjectKey, F extends Iterable<any>, G extends Iterable<any>>(
    name: Exclude<N, keyof Iterable.Infer<F>>,
    fb: G,
  ): (
    self: F,
  ) => Iterable.AndNonEmpty<
    F,
    G,
    DoObject<N, Iterable.Infer<F>, Iterable.Infer<G>>
  >
} = NonEmptyMonad.bind as any

export const flatMapTo: {
  <N extends DoObjectKey, F extends Iterable<any>, G extends Iterable<any>>(
    name: Exclude<N, keyof Iterable.Infer<F>>,
    amb: (a: Iterable.Infer<F>, i: number) => G,
  ): (
    self: F,
  ) => Iterable.AndNonEmpty<
    F,
    G,
    DoObject<N, Iterable.Infer<F>, Iterable.Infer<G>>
  >
} = NonEmptyMonadWithIndex.flatMapToWithIndex as any

export interface GenUtils {
  readonly $: <A>(
    self: Iterable<A> | (() => Iterable<A>),
  ) => IterableIterable<A>
  readonly where: (a: boolean) => Generator<unknown, void>
}

export interface IterableGenerator<A> {
  (genUtils: GenUtils): Generator<unknown, A>
}

export interface IterableIterable<A> {
  readonly [Symbol.iterator]: () => Generator<unknown, A>
}

function* makeIterable<A>(
  self: Iterable<A> | (() => Iterable<A>),
): IterableIterable<A> {
  return (yield self) as A
}

function* where(a: boolean) {
  if (!a) {
    return yield* makeIterable([])
  }
}

export const gen: {
  <A>(generator: IterableGenerator<A>): Iterable<A>
} = getIterableGen(Monad, {
  $: makeIterable,
  where,
})
