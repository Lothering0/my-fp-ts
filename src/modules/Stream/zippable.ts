import * as Zippable_ from '../../typeclasses/Zippable'
import { Stream } from '../Stream'
import { Applicative } from './applicative'

export const Zippable = Zippable_.create(Applicative)

export const zipWith: {
  <A, B, D, C, R>(
    stream: Stream<B, D, R>,
    f: (a: A, b: B) => C,
  ): <E>(selfStream: Stream<A, E, R>) => Stream<C, E | D, R>
} = Zippable.zipWith

export const zip: {
  <A, B, D, R>(
    stream: Stream<B, D, R>,
  ): <E>(selfStream: Stream<A, E, R>) => Stream<readonly [A, B], E | D, R>
} = Zippable.zip

export const unzip: {
  <A, B, E, R>(
    zipped: Stream<readonly [A, B], E, R>,
  ): readonly [Stream<A, E, R>, Stream<B, E, R>]
} = Zippable.unzip
