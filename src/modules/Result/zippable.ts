import * as Zippable_ from '../../typeclasses/Zippable'
import { Applicative } from './applicative'
import { Result } from './result'

export const Zippable = Zippable_.create(Applicative)

export const zipWith: {
  <A, B, D, C>(
    result: Result<B, D>,
    f: (a: A, b: B) => C,
  ): <E>(selfResult: Result<A, E>) => Result<C, E | D>
} = Zippable.zipWith

export const zip: {
  <A, B, D>(
    result: Result<B, D>,
  ): <E>(selfResult: Result<A, E>) => Result<readonly [A, B], E | D>
} = Zippable.zip

export const unzip: {
  <A, B, E>(
    zipped: Result<readonly [A, B], E>,
  ): readonly [Result<A, E>, Result<B, E>]
} = Zippable.unzip
