import * as Chunk from './chunk'
import * as Iterable from '../Iterable'
import { create } from '../../typeclasses/Extendable'
import { Functor, NonEmptyFunctor } from './functor'
import { fromIterable } from './utils'
import { pipe } from '../../utils/flow'

export const Extendable = create<Chunk.Hkt>(Functor, {
  extend: fab => chunk => pipe(chunk, Iterable.extend(fab), fromIterable),
})

export const extend: {
  <F extends Chunk.Chunk<any>, B>(
    fab: (fa: F) => B,
  ): (chunk: F) => Chunk.With<F, B>
} = Extendable.extend as any

export const NonEmptyExtendable = create<Chunk.NonEmptyHkt>(NonEmptyFunctor, {
  extend,
})

export const duplicate: {
  <F extends Chunk.Chunk<any>>(chunk: F): Chunk.With<F, Chunk.With<F>>
} = Extendable.duplicate as any
