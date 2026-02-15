import * as Array from './readonly-array'
import { create } from '../../typeclasses/Tappable'
import { Sync } from '../Sync'
import { Monad, NonEmptyMonad } from './monad'

export const Tappable = create(Monad)

export const NonEmptyTappable = create(NonEmptyMonad)

export const tap: {
  <F extends ReadonlyArray<any>, G extends ReadonlyArray<any>>(
    f: (a: Array.Infer<F>) => G,
  ): (array: F) => Array.AndNonEmpty<F, G, Array.Infer<F>>
} = Tappable.tap as any

export const tapSync: {
  <F extends ReadonlyArray<any>>(
    f: (a: Array.Infer<F>) => Sync<unknown>,
  ): (array: F) => Array.With<F>
} = Tappable.tapSync as any
