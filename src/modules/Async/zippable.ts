import * as Zippable_ from '../../typeclasses/Zippable'
import { Applicative } from './applicative'
import { Async } from './async'

export const Zippable = Zippable_.create(Applicative)

export const zipWith: {
  <A, B, C>(that: Async<B>, f: (a: A, b: B) => C): (self: Async<A>) => Async<C>
} = Zippable.zipWith

export const zip: {
  <A, B>(that: Async<B>): (self: Async<A>) => Async<readonly [A, B]>
} = Zippable.zip

export const unzip: {
  <A, B>(zipped: Async<readonly [A, B]>): readonly [Async<A>, Async<B>]
} = Zippable.unzip
