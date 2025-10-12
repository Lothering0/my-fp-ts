import * as Zippable_ from '../../typeclasses/Zippable'
import { Applicative } from './applicative'
import { Option } from './option'

export const Zippable = Zippable_.create(Applicative)

export const zipWith: {
  <A, B, C>(
    that: Option<B>,
    f: (a: A, b: B) => C,
  ): (self: Option<A>) => Option<C>
} = Zippable.zipWith

export const zip: {
  <A, B>(that: Option<B>): (self: Option<A>) => Option<readonly [A, B]>
} = Zippable.zip

export const unzip: {
  <A, B>(zipped: Option<readonly [A, B]>): readonly [Option<A>, Option<B>]
} = Zippable.unzip
