import * as Zippable_ from '../../typeclasses/Zippable'
import { Applicative } from './applicative'
import { Identity } from './identity'

export const Zippable = Zippable_.create(Applicative)

export const zipWith: {
  <A, B, C>(
    b: Identity<B>,
    f: (a: A, b: B) => C,
  ): (a: Identity<A>) => Identity<C>
} = Zippable.zipWith

export const zip: {
  <A, B>(b: Identity<B>): (a: Identity<A>) => Identity<readonly [A, B]>
} = Zippable.zip

export const unzip: {
  <A, B>(zipped: Identity<readonly [A, B]>): readonly [Identity<A>, Identity<B>]
} = Zippable.unzip
