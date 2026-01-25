import * as Chunk from './chunk'
import * as Iterable from '../Iterable'
import * as Option from '../Option'
import * as Result from '../Result'
import { create } from '../../typeclasses/Compactable'
import { Functor } from './functor'
import { pipe } from '../../utils/flow'
import { fromIterable } from './utils'

export const Compactable = create<Chunk.Hkt>(Functor, {
  compact: chunk => pipe(chunk, Iterable.compact, fromIterable),
})

export const compact: {
  <A>(chunk: Chunk.Chunk<Option.Option<A>>): Chunk.Chunk<A>
} = Compactable.compact

export const compactResults: {
  <A>(chunk: Chunk.Chunk<Result.Result<A, unknown>>): Chunk.Chunk<A>
} = Compactable.compactResults

export const separate: {
  <A, E>(
    chunk: Chunk.Chunk<Result.Result<A, E>>,
  ): readonly [Chunk.Chunk<A>, Chunk.Chunk<E>]
} = Compactable.separate
