import * as Chunk from './chunk'
import { create } from '../../typeclasses/Tappable'
import { Sync } from '../Sync'
import { Monad, NonEmptyMonad } from './monad'

export const Tappable = create(Monad)

export const NonEmptyTappable = create(NonEmptyMonad)

export const tap: {
  <F extends Chunk.Chunk<any>, G extends Chunk.Chunk<any>>(
    f: (a: Chunk.Infer<F>) => G,
  ): (chunk: F) => Chunk.AndNonEmpty<F, G, Chunk.Infer<F>>
} = NonEmptyTappable.tap as any

export const tapSync: {
  <F extends Chunk.Chunk<any>>(
    f: (a: Chunk.Infer<F>) => Sync<unknown>,
  ): (chunk: F) => Chunk.With<F>
} = NonEmptyTappable.tapSync as any
