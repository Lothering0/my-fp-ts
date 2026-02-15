import * as Chunk from './chunk'
import * as Iterable from '../Iterable'
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
import { pipe } from '../../utils/flow'
import { fromIterable } from './utils'
import { _emptyChunk } from './_internal'

export const Monad = Monad_.create<Chunk.Hkt>(FromIdentity, Functor, {
  flat: chunk => pipe(chunk, Iterable.flat, fromIterable),
})

export const MonadWithIndex = MonadWithIndex_.create<Chunk.Hkt, number>(
  FunctorWithIndex,
  Monad,
)

export const flat: {
  <F extends Chunk.Chunk<Chunk.Chunk<any>>>(
    chunk: F,
  ): Chunk.AndNonEmpty<F, Chunk.Infer<F>, Chunk.Infer<Chunk.Infer<F>>>
} = Monad.flat as any

export const NonEmptyMonad = Monad_.create<Chunk.NonEmptyHkt>(
  NonEmptyFromIdentity,
  NonEmptyFunctor,
  { flat },
)

export const Do: Chunk.NonEmpty<{}> = NonEmptyMonad.Do

export const NonEmptyMonadWithIndex = MonadWithIndex_.create<
  Chunk.NonEmptyHkt,
  number
>(NonEmptyFunctorWithIndex, NonEmptyMonad)

export const flatMap: {
  <F extends Chunk.Chunk<any>, G extends Chunk.Chunk<any>>(
    aimb: (a: Chunk.Infer<F>, i: number) => G,
  ): (chunk: F) => Chunk.AndNonEmpty<F, G, Chunk.Infer<G>>
} = MonadWithIndex.flatMapWithIndex as any

export const andThen: {
  <F extends Chunk.Chunk<any>>(
    chunk: F,
  ): <G extends Chunk.Chunk<any>>(
    selfChunk: G,
  ) => Chunk.AndNonEmpty<F, G, Chunk.Infer<F>>
} = MonadWithIndex.andThen as any

export const compose: {
  <A, F extends Chunk.Chunk<any>, G extends Chunk.Chunk<any>>(
    amb: (a: A) => F,
    bmc: (b: Chunk.Infer<F>, i: number) => G,
  ): (a: A) => Chunk.AndNonEmpty<F, G, Chunk.Infer<G>>
} = MonadWithIndex.composeWithIndex as any

export const setTo: {
  <N extends DoObjectKey, F extends Chunk.Chunk<any>, B>(
    name: Exclude<N, keyof Chunk.Infer<F>>,
    b: B,
  ): (chunk: F) => Chunk.With<F, DoObject<N, Chunk.Infer<F>, B>>
} = Monad.setTo as any

export const mapTo: {
  <N extends DoObjectKey, F extends Chunk.Chunk<any>, B>(
    name: Exclude<N, keyof Chunk.Infer<F>>,
    ab: (a: Chunk.Infer<F>, i: number) => B,
  ): (chunk: F) => Chunk.With<F, DoObject<N, Chunk.Infer<F>, B>>
} = MonadWithIndex.mapToWithIndex as any

export const flipApplyTo: {
  <
    N extends DoObjectKey,
    F extends Chunk.Chunk<any>,
    G extends Chunk.Chunk<(a: Chunk.Infer<F>, i: number) => any>,
  >(
    name: Exclude<N, keyof Chunk.Infer<F>>,
    chunk: G,
  ): (
    selfChunk: F,
  ) => Chunk.AndNonEmpty<
    F,
    G,
    DoObject<N, Chunk.Infer<F>, ReturnType<Chunk.Infer<G>>>
  >
} = MonadWithIndex.flipApplyToWithIndex as any

export const bind: {
  <
    N extends DoObjectKey,
    F extends Chunk.Chunk<any>,
    G extends Chunk.Chunk<any>,
  >(
    name: Exclude<N, keyof Chunk.Infer<F>>,
    chunk: G,
  ): (
    selfChunk: F,
  ) => Chunk.AndNonEmpty<F, G, DoObject<N, Chunk.Infer<F>, Chunk.Infer<G>>>
} = Monad.bind as any

export const flatMapTo: {
  <
    N extends DoObjectKey,
    F extends Chunk.Chunk<any>,
    G extends Chunk.Chunk<any>,
  >(
    name: Exclude<N, keyof Chunk.Infer<F>>,
    amb: (a: Chunk.Infer<F>, i: number) => G,
  ): (
    chunk: F,
  ) => Chunk.AndNonEmpty<F, G, DoObject<N, Chunk.Infer<F>, Chunk.Infer<G>>>
} = MonadWithIndex.flatMapToWithIndex as any

export interface GenUtils {
  readonly $: <A>(
    chunk: Chunk.Chunk<A> | (() => Chunk.Chunk<A>),
  ) => ChunkIterable<A>
  readonly where: (a: boolean) => Generator<unknown, void>
}

export interface ChunkGenerator<A> {
  (genUtils: GenUtils): Generator<unknown, A>
}

export interface ChunkIterable<A> {
  readonly [Symbol.iterator]: () => Generator<unknown, A>
}

function* makeIterable<A>(
  chunk: Chunk.Chunk<A> | (() => Chunk.Chunk<A>),
): ChunkIterable<A> {
  return (yield chunk) as A
}

function* where(a: boolean) {
  if (!a) {
    return yield* makeIterable(_emptyChunk)
  }
}

export const gen: {
  <A>(generator: ChunkGenerator<A>): Chunk.Chunk<A>
} = getIterableGen(Monad, {
  $: makeIterable,
  where,
})
