import * as Iterable from './iterable'
import { create } from '../../typeclasses/Tappable'
import { Sync } from '../Sync'
import { Monad, NonEmptyMonad } from './monad'

export const Tappable = create(Monad)

export const NonEmptyTappable = create(NonEmptyMonad)

export const tap: {
  <F extends Iterable<any>, G extends Iterable<any>>(
    f: (a: Iterable.Infer<F>) => G,
  ): (iterable: F) => Iterable.AndNonEmpty<F, G, Iterable.Infer<F>>
} = NonEmptyTappable.tap as any

export const tapSync: {
  <F extends Iterable<any>>(
    f: (a: Iterable.Infer<F>) => Sync<unknown>,
  ): (iterable: F) => Iterable.With<F>
} = NonEmptyTappable.tapSync as any
