import * as Zippable_ from '../../typeclasses/Zippable'
import { Applicative } from './applicative'
import { Sync } from './sync'

export const Zippable = Zippable_.create(Applicative)

export const zipWith: {
  <A, B, C>(that: Sync<B>, f: (a: A, b: B) => C): (self: Sync<A>) => Sync<C>
} = Zippable.zipWith

export const zip: {
  <A, B>(that: Sync<B>): (self: Sync<A>) => Sync<readonly [A, B]>
} = Zippable.zip

export const unzip: {
  <A, B>(zipped: Sync<readonly [A, B]>): readonly [Sync<A>, Sync<B>]
} = Zippable.unzip
