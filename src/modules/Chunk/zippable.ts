import * as Chunk from './chunk'
import * as Zippable_ from '../../typeclasses/Zippable'
import * as Iterable from '../Iterable'
import { pipe } from '../../utils/flow'
import { fromIterable } from './utils'

export const zipWith: {
  <F extends Chunk.Chunk<any>, G extends Chunk.Chunk<any>, C>(
    chunk: G,
    abic: (a: Chunk.Infer<F>, b: Chunk.Infer<G>, i: number) => C,
  ): (selfChunk: F) => Chunk.AndNonEmpty<F, G, C>
} = (chunk, abic) => selfChunk =>
  pipe(selfChunk, Iterable.zipWith(chunk, abic as any), fromIterable) as any

export const zip: {
  <F extends Chunk.Chunk<any>>(
    chunk: F,
  ): <G extends Chunk.Chunk<any>>(
    selfChunk: G,
  ) => Chunk.AndNonEmpty<F, G, readonly [Chunk.Infer<G>, Chunk.Infer<F>]>
} = chunk => zipWith(chunk, (a, b) => [a, b]) as any

export const unzip: {
  <F extends Chunk.Chunk<readonly [any, any]>>(
    zipped: F,
  ): readonly [
    Chunk.With<F, Chunk.Infer<F>[0]>,
    Chunk.With<F, Chunk.Infer<F>[1]>,
  ]
} = zipped => pipe(zipped, Iterable.unzip, fromIterable) as any

export const Zippable: Zippable_.Zippable<Chunk.Hkt> = {
  zipWith,
  zip,
  unzip,
}

export const NonEmptyZippable: Zippable_.Zippable<Chunk.NonEmptyHkt> = {
  zipWith,
  zip,
  unzip,
}
