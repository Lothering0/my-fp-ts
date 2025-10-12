import * as Zippable_ from '../../typeclasses/Zippable'
import { Applicative } from './applicative'
import { Reader } from './reader'

export const Zippable = Zippable_.create(Applicative)

export const zipWith: {
  <A, B, C, R>(
    that: Reader<R, B>,
    f: (a: A, b: B) => C,
  ): (self: Reader<R, A>) => Reader<R, C>
} = Zippable.zipWith

export const zip: {
  <A, B, R>(
    that: Reader<R, B>,
  ): (self: Reader<R, A>) => Reader<R, readonly [A, B]>
} = Zippable.zip

export const unzip: {
  <A, B, R>(
    zipped: Reader<R, readonly [A, B]>,
  ): readonly [Reader<R, A>, Reader<R, B>]
} = Zippable.unzip
