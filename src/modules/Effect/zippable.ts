import * as Zippable_ from '../../typeclasses/Zippable'
import { Applicative } from './applicative'
import { Effect } from './effect'

export const Zippable = Zippable_.create(Applicative)

export const zipWith: {
  <A, B, D, C>(
    that: Effect<B, D>,
    f: (a: A, b: B) => C,
  ): <E>(self: Effect<A, E>) => Effect<C, E | D>
} = Zippable.zipWith

export const zip: {
  <A, B, D>(
    that: Effect<B, D>,
  ): <E>(self: Effect<A, E>) => Effect<readonly [A, B], E | D>
} = Zippable.zip

export const unzip: {
  <A, B, E>(
    zipped: Effect<readonly [A, B], E>,
  ): readonly [Effect<A, E>, Effect<B, E>]
} = Zippable.unzip
