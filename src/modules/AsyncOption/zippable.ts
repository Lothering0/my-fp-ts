import * as Zippable_ from '../../typeclasses/Zippable'
import { Applicative } from './applicative'
import { AsyncOption } from './async-option'

export const Zippable = Zippable_.create(Applicative)

export const zipWith: {
  <A, B, C>(
    that: AsyncOption<B>,
    f: (a: A, b: B) => C,
  ): (self: AsyncOption<A>) => AsyncOption<C>
} = Zippable.zipWith

export const zip: {
  <A, B>(
    that: AsyncOption<B>,
  ): (self: AsyncOption<A>) => AsyncOption<readonly [A, B]>
} = Zippable.zip

export const unzip: {
  <A, B>(
    zipped: AsyncOption<readonly [A, B]>,
  ): readonly [AsyncOption<A>, AsyncOption<B>]
} = Zippable.unzip
