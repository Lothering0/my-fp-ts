import * as Monad_ from '../../typeclasses/Monad'
import * as MonadWithIndex_ from '../../typeclasses/MonadWithIndex'
import * as List from './list'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import { Functor, FunctorWithIndex, NonEmptyFunctorWithIndex } from './functor'
import { FromIdentity } from './from-identity'
import { getIterableGen } from '../_internal'
import { append } from './utils'

export const Monad = Monad_.create<List.Hkt>(FromIdentity, Functor, {
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

export const NonEmptyMonad: Monad_.Monad<List.NonEmptyHkt> = Monad as any

export const MonadWithIndex = MonadWithIndex_.create<List.Hkt, number>(
  FunctorWithIndex,
  Monad,
)

export const NonEmptyMonadWithIndex = MonadWithIndex_.create<
  List.NonEmptyHkt,
  number
>(NonEmptyFunctorWithIndex, NonEmptyMonad)

export const Do: List.NonEmpty<{}> = NonEmptyMonad.Do

export const flat: {
  <F extends List.List<List.List<any>>>(
    self: F,
  ): List.AndNonEmpty<F, List.Infer<F>, List.Infer<List.Infer<F>>>
} = Monad.flat as any

export const flatMap: {
  <F extends List.List<any>, G extends List.List<any>>(
    aimb: (a: List.Infer<F>, i: number) => G,
  ): (list: F) => List.AndNonEmpty<F, G, List.Infer<G>>
} = MonadWithIndex.flatMapWithIndex as any

export const andThen: {
  <F extends List.List<any>>(
    ma: F,
  ): <G extends List.List<any>>(
    list: G,
  ) => List.AndNonEmpty<F, G, List.Infer<F>>
} = MonadWithIndex.andThen as any

export const compose: {
  <A, F extends List.List<any>, G extends List.List<any>>(
    amb: (a: A) => F,
    bmc: (b: List.Infer<F>, i: number) => G,
  ): (a: A) => List.AndNonEmpty<F, G, List.Infer<G>>
} = MonadWithIndex.composeWithIndex as any

export const setTo: {
  <N extends DoObjectKey, F extends List.List<any>, B>(
    name: Exclude<N, keyof List.Infer<F>>,
    b: B,
  ): (list: F) => List.With<F, DoObject<N, List.Infer<F>, B>>
} = Monad.setTo as any

export const mapTo: {
  <N extends DoObjectKey, F extends List.List<any>, B>(
    name: Exclude<N, keyof List.Infer<F>>,
    ab: (a: List.Infer<F>, i: number) => B,
  ): (list: F) => List.With<F, DoObject<N, List.Infer<F>, B>>
} = MonadWithIndex.mapToWithIndex as any

export const flipApplyTo: {
  <
    N extends DoObjectKey,
    F extends List.List<any>,
    G extends List.List<(a: List.Infer<F>, i: number) => any>,
  >(
    name: Exclude<N, keyof List.Infer<F>>,
    fab: G,
  ): (
    list: F,
  ) => List.AndNonEmpty<
    F,
    G,
    DoObject<N, List.Infer<F>, ReturnType<List.Infer<G>>>
  >
} = MonadWithIndex.flipApplyToWithIndex as any

export const bind: {
  <N extends DoObjectKey, F extends List.List<any>, G extends List.List<any>>(
    name: Exclude<N, keyof List.Infer<F>>,
    fb: G,
  ): (
    list: F,
  ) => List.AndNonEmpty<F, G, DoObject<N, List.Infer<F>, List.Infer<G>>>
} = Monad.bind as any

export const flatMapTo: {
  <N extends DoObjectKey, F extends List.List<any>, G extends List.List<any>>(
    name: Exclude<N, keyof List.Infer<F>>,
    amb: (a: List.Infer<F>, i: number) => G,
  ): (
    list: F,
  ) => List.AndNonEmpty<F, G, DoObject<N, List.Infer<F>, List.Infer<G>>>
} = MonadWithIndex.flatMapToWithIndex as any

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
