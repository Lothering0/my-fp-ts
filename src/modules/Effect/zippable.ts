import * as Zippable_ from '../../typeclasses/Zippable'
import { Applicative } from './applicative'
import { Effect } from './effect'

export const Zippable = Zippable_.create(Applicative)

export const zipWith: {
  <A, B, D, C, R>(
    that: Effect<B, D, R>,
    f: (a: A, b: B) => C,
  ): <E>(self: Effect<A, E, R>) => Effect<C, E | D, R>
} = Zippable.zipWith

export const zip: {
  <A, B, D, R>(
    that: Effect<B, D, R>,
  ): <E>(self: Effect<A, E, R>) => Effect<readonly [A, B], E | D, R>
} = Zippable.zip

export const unzip: {
  <A, B, E, R>(
    zipped: Effect<readonly [A, B], E, R>,
  ): readonly [Effect<A, E, R>, Effect<B, E, R>]
} = Zippable.unzip
