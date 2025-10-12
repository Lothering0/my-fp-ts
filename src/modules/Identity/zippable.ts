import * as Zippable_ from '../../typeclasses/Zippable'
import { Applicative } from './applicative'
import { Identity } from './identity'

export const Zippable = Zippable_.create(Applicative)

export const zipWith: {
  <A, B, C>(
    that: Identity<B>,
    f: (a: A, b: B) => C,
  ): (self: Identity<A>) => Identity<C>
} = Zippable.zipWith

export const zip: {
  <A, B>(that: Identity<B>): (self: Identity<A>) => Identity<readonly [A, B]>
} = Zippable.zip

export const unzip: {
  <A, B>(zipped: Identity<readonly [A, B]>): readonly [Identity<A>, Identity<B>]
} = Zippable.unzip
