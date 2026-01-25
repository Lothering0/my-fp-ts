import * as List from './list'
import { create } from '../../typeclasses/Tappable'
import { Sync } from '../Sync'
import { Monad, NonEmptyMonad } from './monad'

export const Tappable = create(Monad)

export const NonEmptyTappable = create(NonEmptyMonad)

export const tap: {
  <F extends List.List<any>, G extends List.List<any>>(
    f: (a: List.Infer<F>) => G,
  ): (list: F) => List.AndNonEmpty<F, G, List.Infer<F>>
} = Tappable.tap as any

export const tapSync: {
  <F extends List.List<any>>(
    f: (a: List.Infer<F>) => Sync<unknown>,
  ): (list: F) => List.With<F>
} = Tappable.tapSync as any
