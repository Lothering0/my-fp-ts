import * as Iterable from './iterable'
import * as Monad_ from '../../typeclasses/Monad'
import * as MonadWithIndex_ from '../../typeclasses/MonadWithIndex'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import { Functor, FunctorWithIndex, NonEmptyFunctorWithIndex } from './functor'
import { FromIdentity } from './from-identity'
import { getIterableGen } from '../_internal'

export const Monad = Monad_.create<Iterable.Hkt>(FromIdentity, Functor, {
  flat: iterables => ({
    *[Symbol.iterator]() {
      for (const iterable of iterables) {
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
    iterable: F,
  ): Iterable.AndNonEmpty<
    F,
    Iterable.Infer<F>,
    Iterable.Infer<Iterable.Infer<F>>
  >
} = NonEmptyMonad.flat as any

export const flatMap: {
  <F extends Iterable<any>, G extends Iterable<any>>(
    aimb: (a: Iterable.Infer<F>, i: number) => G,
  ): (iterable: F) => Iterable.AndNonEmpty<F, G, Iterable.Infer<G>>
} = NonEmptyMonadWithIndex.flatMapWithIndex as any

export const andThen: {
  <F extends Iterable<any>>(
    iterable: F,
  ): <G extends Iterable<any>>(
    selfIterable: G,
  ) => Iterable.AndNonEmpty<F, G, Iterable.Infer<F>>
} = NonEmptyMonadWithIndex.andThen as any

export const compose: {
  <A, F extends Iterable<any>, G extends Iterable<any>>(
    amb: (a: A) => F,
    bmc: (b: Iterable.Infer<F>, i: number) => G,
  ): (a: A) => Iterable.AndNonEmpty<F, G, Iterable.Infer<G>>
} = MonadWithIndex.composeWithIndex as any

export const setTo: {
  <N extends DoObjectKey, F extends Iterable<any>, B>(
    name: Exclude<N, keyof Iterable.Infer<F>>,
    b: B,
  ): (iterable: F) => Iterable.With<F, DoObject<N, Iterable.Infer<F>, B>>
} = NonEmptyMonad.setTo as any

export const mapTo: {
  <N extends DoObjectKey, F extends Iterable<any>, B>(
    name: Exclude<N, keyof Iterable.Infer<F>>,
    ab: (a: Iterable.Infer<F>, i: number) => B,
  ): (iterable: F) => Iterable.With<F, DoObject<N, Iterable.Infer<F>, B>>
} = NonEmptyMonadWithIndex.mapToWithIndex as any

export const flipApplyTo: {
  <
    N extends DoObjectKey,
    F extends Iterable<any>,
    G extends Iterable<(a: Iterable.Infer<F>, i: number) => any>,
  >(
    name: Exclude<N, keyof Iterable.Infer<F>>,
    iterable: G,
  ): (
    selfIterable: F,
  ) => Iterable.AndNonEmpty<
    F,
    G,
    DoObject<N, Iterable.Infer<F>, ReturnType<Iterable.Infer<G>>>
  >
} = MonadWithIndex.flipApplyToWithIndex as any

export const bind: {
  <N extends DoObjectKey, F extends Iterable<any>, G extends Iterable<any>>(
    name: Exclude<N, keyof Iterable.Infer<F>>,
    iterable: G,
  ): (
    selfIterable: F,
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
    iterable: F,
  ) => Iterable.AndNonEmpty<
    F,
    G,
    DoObject<N, Iterable.Infer<F>, Iterable.Infer<G>>
  >
} = NonEmptyMonadWithIndex.flatMapToWithIndex as any

export interface GenUtils {
  readonly $: <A>(
    iterable: Iterable<A> | (() => Iterable<A>),
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
  iterable: Iterable<A> | (() => Iterable<A>),
): IterableIterable<A> {
  return (yield iterable) as A
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
