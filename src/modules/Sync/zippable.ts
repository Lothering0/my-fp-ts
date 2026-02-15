import * as Zippable_ from '../../typeclasses/Zippable'
import { Applicative } from './applicative'
import { Sync } from './sync'

export const Zippable = Zippable_.create(Applicative)

export const zipWith: {
  <A, B, C>(sync: Sync<B>, f: (a: A, b: B) => C): (selfSync: Sync<A>) => Sync<C>
} = Zippable.zipWith

export const zip: {
  <A, B>(sync: Sync<B>): (selfSync: Sync<A>) => Sync<readonly [A, B]>
} = Zippable.zip

export const unzip: {
  <A, B>(zipped: Sync<readonly [A, B]>): readonly [Sync<A>, Sync<B>]
} = Zippable.unzip
