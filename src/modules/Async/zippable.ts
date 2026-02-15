import * as Zippable_ from '../../typeclasses/Zippable'
import { Applicative } from './applicative'
import { Async } from './async'

export const Zippable = Zippable_.create(Applicative)

export const zipWith: {
  <A, B, C>(
    async: Async<B>,
    f: (a: A, b: B) => C,
  ): (selfAsync: Async<A>) => Async<C>
} = Zippable.zipWith

export const zip: {
  <A, B>(async: Async<B>): (selfAsync: Async<A>) => Async<readonly [A, B]>
} = Zippable.zip

export const unzip: {
  <A, B>(zipped: Async<readonly [A, B]>): readonly [Async<A>, Async<B>]
} = Zippable.unzip
